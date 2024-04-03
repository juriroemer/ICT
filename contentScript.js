function interceptData() {
  var xhrOverrideScript = document.createElement("script");
  xhrOverrideScript.type = "text/javascript";

  xhrOverrideScript.innerHTML = `
  const { fetch: origFetch } = window;
  window.fetch = async (...args) => {
    console.log("fetch called with args:", args);
    const response = await origFetch(...args);

    response
      .clone()
      .json()
      .then((data) => { console.log("intercepted response data:", data)
      url = decodeURI(args[0]).split(/=|&/)
      parents = [url[1], url[3]]
      console.log(url)
      console.log(parents)
      data = {parents: parents, result: data}
      window.postMessage({data: data}, function (response) {console.log(response);})
      
      document.getElementById("__data").innerHTML = JSON.stringify(data);
    })
      .catch((err) => console.error(err));

    

    return response
  };
    `;
  document.head.prepend(xhrOverrideScript);

  storage = document.getElementById("__data");

  chrome.runtime.sendMessage(
    { newData: storage.innerHTML },
    function (response) {
      console.log(response);
    }
  );
}

function checkForDOM() {
  if (document.body && document.head) {
    var elem = document.createElement("div");

    elem.setAttribute("id", "__data");
    elem.style.cssText = "visibility: hidden; position: absolute;";
    document.body.appendChild(elem);
    interceptData();

    storage = document.getElementById("__data");

    const callback = (mutationList) => {
      chrome.runtime.sendMessage(
        { newData: storage.innerHTML },
        function (response) {
          console.log(response);
        }
      );
    };
    const observer = new MutationObserver(callback);

    observer.observe(storage, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  sendResponse("message received");
});
