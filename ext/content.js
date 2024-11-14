let session = null;

let useOnce = false;
(async () => {
  const { available, defaultTemperature, defaultTopK, maxTopK } =
    await ai.languageModel.capabilities();
  if (available !== "no") {
    session = await ai.languageModel.create({
      systemPrompt:
        "You are an AI assistant that specializes in identifying tweets discussing topics in engineering and computer science. When reading a tweet in english, determine if it discusses engineering or computer science concepts, developments, or issues.",
    });
    console.log("Model available: session created", session);
  } else {
    console.log("Model not available");
  }
})();

async function processTweets() {
  if (!session) {
    console.log("Session not initialized yet.");
    return;
  }
  // Select all article elements with `data-testid="tweet"` that haven't been processed
  const tweetElements = document.querySelectorAll(
    'article[data-testid="tweet"]:not([data-processed])'
  );

  for (const tweet of tweetElements) {
    tweet.setAttribute("data-processed", "true");

    // Find the tweetText element within each tweet
    const tweetTextElement = tweet.querySelector('[data-testid="tweetText"]');

    if (tweetTextElement) {
      try {
        // Ensure `session` is initialized before making a prompt call
        console.log(tweetTextElement.textContent);
        if (useOnce) return;
        useOnce = true;
        const promptText = `ACCEPTING ${tweetTextElement.textContent} - does it talk about computer science? answer in yes or no with reasoning.`;
        const stream = await session.promptStreaming(promptText);
        console.log("prmpt", promptText);
        for await (const chunk of stream) {
          fullResponse = chunk.trim();
          console.log("fullResponse", fullResponse, promptText);
          if (
            fullResponse.toLowerCase().includes("yes") ||
            fullResponse.toLowerCase().includes("no")
          ) {
            // stop the stream
            console.log(promptText, fullResponse, "breaking");
            break;
          }
        }
      } catch (error) {
        console.error("Error processing tweet:", error);
      }
    } else {
      // If no tweetText element is found, print "delete this"
      console.log("delete this");
    }
  }
}

// Attach the scroll event listener to process tweets on scroll
window.addEventListener("scroll", processTweets, false);

// Process tweets initially when the script runs
processTweets();
