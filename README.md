# XWeeder extension

This helps keep your x feed free of random content other than one you asked for. 

# challenges
- currently multiple parallel requests are not possible, that is causing abortError: The request was cancelled. - for most requests, it fails if prompt is being generated. read [this](https://github.com/explainers-by-googlers/prompt-api/issues/59)
    - confirmed it by using a "usedOnce" flag

- 