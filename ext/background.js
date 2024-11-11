
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    (async () => {
       if (request.event === "questionContentGenerated") {
         console.log("Content received in background.js", request.content);

         let data = {
           nature: "error",
           code: request.content.code,
           problemStatement: "dummy", // request.content.description,
           language: request.content.language,
           error: request.content.output,
         };
         const url = "http://localhost:3000/api/check";
         const res = await fetch(url, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer token`,
           },
           body: JSON.stringify(data),
         });

         console.log("data", data);

         const editSuggestions = await res.json();

         console.log("editSuggestions", editSuggestions);
         sendResponse({
           message: "Content received in background.js",
           response: editSuggestions,
         });
       }
    })();
    return true;
   
});
