let session = null;

const PARALLEL_SESSIONS = 10; // Number of parallel sessions to create

async function processTweets() {
  const sessions = []; // Array to store sessions

  const { available, defaultTemperature, defaultTopK, maxTopK } =
    await ai.languageModel.capabilities();

  if (available !== "no") {
    for (let i = 0; i < PARALLEL_SESSIONS; i++) {
      const session = await ai.languageModel.create({
        systemPrompt:
          "You are an content inspector that specializes in identifying tweets which discuss about anything related to science or business.\n",
      });
      sessions.push(session); // Add session to the array
    }
  } else {
    console.log("Model not available");
  }
  if (!sessions || sessions.length === 0) {
    console.log("Sessions not initialized yet.");
    return;
  }

  // Select all article elements with `data-testid="tweet"` that haven't been processed

  const tweetElements = Array.from(
    document.querySelectorAll('article[data-testid="tweet"][data-processed]')
  )
    .filter((tweet) => tweet.getAttribute("data-processed") === "false")
    .concat(
      Array.from(
        document.querySelectorAll(
          'article[data-testid="tweet"]:not([data-processed])'
        )
      )
    );
  console.log("Tweets to process:", tweetElements.length);

  // Slice the first PARALLEL_SESSIONS tweets and remove them from `tweetElements`
  const batch = tweetElements.splice(0, PARALLEL_SESSIONS);

  // Process each tweet in the batch with a different session
  await Promise.all(
    batch.map(async (tweet, index) => {
      const session = sessions[index % sessions.length];
      tweet.setAttribute("data-processed", "true");

      const tweetTextElement = tweet.querySelector('[data-testid="tweetText"]');
      if (tweetTextElement) {
        try {
          const promptText = `${tweetTextElement.textContent} - Is this a tweet about topic related to science or business directly? Answer in yes or no with reasoning. Answer should be yes even if it is an opinion, if it is not relevant and it is not meaningful`;

          const stream = await session.promptStreaming(promptText);

          let fullResponse = "";
          let answer = "";
          for await (const chunk of stream) {
            fullResponse = chunk.trim();
            if (
              fullResponse.toLowerCase().startsWith("yes") ||
              fullResponse.toLowerCase().startsWith("no")
            ) {
              // delete the tweet
              if (fullResponse.toLowerCase().includes("no")) {
                answer = "no";
                tweet.style.filter = "blur(1.5px)";
              } else {
                answer = "yes";
              }
              session.destroy();
              break; // Stop processing once an answer is found
            }
          }

          console.log(
            "Response:",
            tweetTextElement.textContent.length,
            tweetTextElement.textContent,
            fullResponse          
          );
        } catch (error) {
          console.error("Error processing tweet:", error);
          tweet.setAttribute("data-processed", "false");
        }
      } else {
        tweet.remove();
        console.log("delete this"); // No tweetText element found
      }
    })
  );
}

// Debounce the processTweets call on scroll
let debounceTimeout;
window.addEventListener(
  "scroll",
  () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(processTweets, 500); // Adjust delay as needed
  },
  false
);

// Attach the scroll event listener to process tweets on scroll
// window.addEventListener("scroll", processTweets, false);

// Process tweets initially when the script runs
processTweets();
