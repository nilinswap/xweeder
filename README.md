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
    - Reason2 - Some tweets were getting skipped from processing. that's because Invariably some prompt calls were failing with abortError: The request was cancelled. and `UnknownError: Other generic failures occurred.`, so that I should be able to process those tweets again, I was setting data-processed attribute as "false" and hoped querySelector will pick these again for processing but for that query selector needed to be changed. As a result same tweets were being processed even when I am scrolling down
    solution? I changed the query selector
- I did two things to remove errors completely, I changed from m1 air 8gb to m3 pro 36 gb and secondly, I started creating sessions inside the eventHandler so that they get destroyed as a result. Although, it was still leading to crashes but that is after processing much more content.
- It stopped crashing after I started destroying the session as prompts were generated. (as a pretext - I had always been cutting prompt in the middle as soon as I get an answer to delete a post or not (instead of letting it finish its statement)) It started working with 5 parallel sessions now. As a result, it is now working seamless. 
- Sometimes it felt like it is deleting "tech" posts too. but that was as I was deleting the component (or effectively, by display:none) and it was shifting up. Instead I started blurring and it works fine. 
- I suspect it is still deleting some of the useful tweets. I need to look into that. 
    - it is unable to identify some posts despite them being about tech clearly. e.g. it can't identify "Gemini" is a thing in AI. That's blasphemy

- For the purpose of this extension, if postive means deleted. False Positive is ok. but not False negatives.

- Some prompting lessons I learnt
    - Initially, I was pumping a lot of statements in my prompts. They were too long so shorting it helped and it seems that SLM tend to lose context if the prompts are too long. - SOLVED
        - Old Session Prompt - "You are an AI assistant that specializes in identifying tweets discussing topics in engineering and computer science. When reading a tweet in english, determine if it discusses engineering or computer science concepts, developments, or issues."
        - New Session Prompt - "You are an content inspector that specializes in identifying tweets which discuss about anything related to science or business."
    - For most Twitter posts on tech or business, model was marking them to be deleted saying "though, it talks about tech, it doesn't provide data or evidence" or "it merely touches on the topic but there is nothing meaningful stated"
        - Old Prompt - Is this discussing about science or business? Answer in yes or no with reasoning.
        - New Prompt - Is this a tweet about topic related to science or business directly? Answer in yes or no with reasoning. Answer should be yes even if it is an opinion, if it is not relevant and it is not meaningful.
    - It is still facing the problem of promt-injection attack. e.g. if there is a shitty post with a meme and a caption "This surely is a true statement", it says yes. 




# TODO
[] Don't delete
    - posts which are not recommended (of our followers)
    - if there is an enclosed tweet (i.e. reshare), ignore caption and read the enclosed tweet's text
[] Ignore processing posts which are scrolled down.

- Post upcoming features
- Post final success
- Video to submit
