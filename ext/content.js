// Function to process each tweet element
function processTweets() {
  // Select all article elements with `data-testid="tweet"`
  const tweetElements = document.querySelectorAll(
    'article[data-testid="tweet"]'
  );

  console.log("are you there?");

  tweetElements.forEach((tweet) => {
    // Find the tweetText element within each tweet
    const tweetTextElement = tweet.querySelector('[data-testid="tweetText"]');

    if (tweetTextElement) {
      // Log the text content of the tweetText element if it exists
      console.log(tweetTextElement.textContent);
    } else {
      // If no tweetText element is found, print "delete this"
      console.log("delete this");
    }
  });
}

// Attach the scroll event listener to process tweets on scroll
window.addEventListener("scroll", processTweets);

// Process tweets initially when the script runs
processTweets();
