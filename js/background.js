String.isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
};

function genericRemoveUser(info, tabs) {
  //Add all you functional Logic here
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
      );
    }
  );
}

function genericRemoveAndBanUser(info, tabs) {
  //Add all you functional Logic here
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
      );
    }
  );
}

var DeathClick = chrome.contextMenus.create({
  title: "Death Click",
  contexts: ["link"]
});

chrome.contextMenus.create({
  title: "Xóa khỏi nhóm",
  contexts: ["link"],
  parentId: DeathClick,
  onclick: genericRemoveUser
});

chrome.contextMenus.create({
  title: "Xóa và chặn khỏi nhóm",
  contexts: ["link"],
  parentId: DeathClick,
  onclick: genericRemoveAndBanUser
});
