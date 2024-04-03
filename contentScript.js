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
      url = decodeURIComponent(args[0]).split(/=|&/)
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

  storage = document.getElementById("__data").innerHTML;

  if (storage !== "")
    chrome.runtime.sendMessage(
      { newData: storage.innerHTML },
      function (response) {
        console.log(response);
      }
    );
}

function addHint() {
  var sidebar = document.getElementsByClassName("logo")[0];
  sidebar.style.padding = "30px 10px 10px 10px";
  sidebar.style.backgroundColor = "rgba(255, 0, 0, 0.3";
  sidebar.style.borderRadius = "5px";
  var mod = document.createElement("div");
  mod.setAttribute("class", "logo");
  mod.setAttribute("data-v-32e5f4a8", "");
  mod.innerHTML = "MODIFIED";
  mod.style.padding = "5px";
  mod.style.color = "white";
  mod.style.textDecoration = "underline";

  var mod2 = document.createElement("div");
  mod2.innerHTML = "MODIFIED";
  mod2.style.color = "red";
  mod2.style.position = "absolute";
  mod2.style.bottom = "5px";
  mod2.style.width = "100%";
  mod2.style.textAlign = "center";
  mod2.style.opacity = "0.2";

  sidebar.after(mod);
  sidebar.after(mod2);
}

function checkForDOM() {
  if (document.body && document.head) {
    addHint();

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
