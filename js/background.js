String.isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0)
}

function genericRemoveUser(info, tabs) {
  // alert(1)
  // Add all you functional Logic here
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          functiontoInvoke: "removeUser",
          link: info.linkUrl
        },
        () => {}
      )
    }
  )
}

function genericRemoveAndBanUser(info, tabs) {
  // Add all you functional Logic here
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          functiontoInvoke: "removeAndBanUser",
          link: info.linkUrl
        },
        () => {}
      )
    }
  )
}

var DeathClick = chrome.contextMenus.create({
  title: "Death Click",
  contexts: ["link"]
})

chrome.contextMenus.create({
  title: "Xóa khỏi nhóm",
  contexts: ["link"],
  parentId: DeathClick,
  onclick: genericRemoveUser
})

chrome.contextMenus.create({
  title: "Xóa và chặn khỏi nhóm",
  contexts: ["link"],
  parentId: DeathClick,
  onclick: genericRemoveAndBanUser
})

function openNewTab(url) {
  chrome.tabs.create({ url })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // alert(request.functiontoInvoke);
  if (request.functiontoInvoke == "openNewTab") {
    openNewTab(request.params)
  }
})

function logURL(requestDetails) {
  let url = requestDetails.url.toString()
  if (url.indexOf("www.facebook.com/messaging/send/") > -1) {
    requestDetails.requestBody.raw.forEach(element => {
      console.log
    })
  }
}
chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  { urls: ["<all_urls>"] },
  ["requestBody"]
)
