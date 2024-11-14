# XWeeder extension

This helps keep your x feed free of random content other than one you asked for. 

# setup
- follow https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04/edit?tab=t.0 for prompt api setup

# Challenges
- Currently multiple parallel requests are not possible, that is causing abortError: The request was cancelled. - for most requests, it fails if prompt is being generated. read [this](https://github.com/explainers-by-googlers/prompt-api/issues/59)
    - confirmed it by using a "usedOnce" flag

- I also face `Not supported error The model attempted to output text in an untested language, and was prevented from doing so.` error from time to time and I don't know why I face this issue for prompt api. 

- I made this to stop consuming random shit that twitter suggests me (except random shit that I consider non-shitty) but in the process of testing, I consumed a decade worth of bad shit. yeah, random feed zoning slowed me down. 

- After using a pool of opened sessions with window.ai I was able to get across abortError and was able to see some results but after a few scrolls, it was crashing. 
    - Reason1 - Too many scroll events (upto 100 for every second of scroll) calling prompt api too often. Solution? -> debounced the scroll event action
    - Reason2 - Some tweets were getting skipped from processing. that's because Invariably some prompt calls were failing with abortError: The request was cancelled. and `UnknownError: Other generic failures occurred.`, so that I should be able to process those tweets again, I was setting data-processed attribute as "false" and hoped querySelector will pick these again for processing but for that query selector needed to be changed. As a result same tweets were being processed even when I am scro

