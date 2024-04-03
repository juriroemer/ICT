function onrequest(req) {
  if (req.url.includes("https://neal.fun/api/infinite-craft/pair")) {
    console.log(req);
  }
  return { requestHeaders: req.requestHeaders };
}

chrome.webRequest.onCompleted.addListener(onrequest, { urls: ["<all_urls>"] });

window.perfWatch = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  sendResponse("message received in Background.js: " + request.newData);

  old = localStorage.getItem("tree");
  console.log(old);
  if (old === null) {
    updated = [request.newData];
    console.log(updated);
    updated = JSON.stringify(updated);
  } else {
    old = JSON.parse(old);
    updated = [...old, request.newData];
    updated = JSON.stringify(updated);
  }
  localStorage.setItem("tree", updated);
});
