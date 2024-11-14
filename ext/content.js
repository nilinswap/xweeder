let session = null;

const PARALLEL_SESSIONS = 3; // Number of parallel sessions to create

async function processTweets() {
  const sessions = []; // Array to store sessions

  const { available, defaultTemperature, defaultTopK, maxTopK } =
    await ai.languageModel.capabilities();

  if (available !== "no") {
    for (let i = 0; i < PARALLEL_SESSIONS; i++) {
      const session = await ai.languageModel.create({
        systemPrompt:
          "You are an AI assistant that specializes in identifying tweets discussing topics in engineering and computer science. When reading a tweet in English, determine if it discusses engineering or computer science concepts, developments, or issues.",
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
          const promptText = `${tweetTextElement.textContent} - does it talk about computer science? Answer in yes or no with reasoning.`;
          console.log("Prompt:", promptText);

          const stream = await session.promptStreaming(promptText);

          let fullResponse = "";
          for await (const chunk of stream) {
            fullResponse += chunk.trim();
            if (
              fullResponse.toLowerCase().includes("yes") ||
              fullResponse.toLowerCase().includes("no")
            ) {
              // delete the tweet
              if (fullResponse.toLowerCase().includes("no")) {
                console.log(
                  "Response:",
                  tweetTextElement.textContent.slice(0, 15),
                  fullResponse,
                  "no"
                );
                tweet.style.display = "none";
              }
              console.log(
                "Response:",
                tweetTextElement.textContent.slice(0, 15),
                fullResponse,
                "yes"
              );

              break; // Stop processing once an answer is found
            }
          }
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
    debounceTimeout = setTimeout(processTweets, 1000); // Adjust delay as needed
  },
  false
);

// Attach the scroll event listener to process tweets on scroll
// window.addEventListener("scroll", processTweets, false);

// Process tweets initially when the script runs
processTweets();
