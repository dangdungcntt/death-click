var config = {};
const updateConfig = key => {
  if (key == 'change_friends_avatar') {
    loadConfig(key)
      .then(obj => {
        config[obj.key] = [];
        obj.value.forEach(friend => {
          console.log(friend);
          var xhr = new XMLHttpRequest();
          xhr.open('GET', `https://graph.facebook.com/${friend.id}/picture?type=large&redirect=true&width=40&height=40`, true);

          xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              let res = /\d{1,30}_\d{1,30}_\d{1,30}/.exec(xhr.responseURL);
              if (res) {
                config[obj.key].push({ avatar_id: res[0], avatar: friend.avatar });
                console.log(config[obj.key]);
              }
            }
          };

          xhr.send();
        })
        // config[obj.key] = obj.value
      })
    return;
  }
  loadConfig(key)
    .then(obj => config[obj.key] = obj.value);
}

loadConfig('root')
  .then(rootConfig => {
    rootConfig.value.forEach(c => {
      updateConfig(c);
    });
  })


String.isNullOrEmpty = function (value) {
  return !(typeof value === 'string' && value.length > 0)
}

function genericGetID(info, tabs) {
  // Add all you functional Logic here
  // alert("IĐ");
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'getID',
      'link': info.linkUrl
    }, () => { })
  })
}

function genericRemoveUser(info, tabs) {
  // Add all you functional Logic here
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'removeUser',
      'link': info.linkUrl
    }, () => { })
  })
}

function genericRemoveAndBanUser(info, tabs) {
  // Add all you functional Logic here
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      'functiontoInvoke': 'removeAndBanUser',
      'link': info.linkUrl
    }, () => { })
  })
}

chrome.contextMenus.create({
  "title": "Cài đặt",
  "contexts": ["browser_action"],
  "onclick": function (info, tab) {
    chrome.runtime.openOptionsPage()
  }
});

chrome.contextMenus.create({
  "title": "Khôi phục cài đặt gốc",
  "contexts": ["browser_action"],
  "onclick": function (info, tab) {
    setConfig('root', [
      'access_token', 'redirect_news_feed',
      'redirect_news_feed_url', 'target_group',
      'change_friends_avatar', 'translate_vi2vi'
    ])
    setConfig('access_token', '');
    setConfig('change_friends_avatar', []);
    setConfig('redirect_news_feed_url', 'https://www.facebook.com/messages/t/');
    setConfig('target_group', '');
    setConfig('redirect_news_feed', true);
    setConfig('translate_vi2vi', true);
  }
});

var DeathClick = chrome.contextMenus.create({
  title: 'Death Click',
  contexts: ['link']
})

chrome.contextMenus.create({
  title: 'Lấy ID',
  contexts: ['link'],
  parentId: DeathClick,
  onclick: genericGetID
})

chrome.contextMenus.create({
  title: 'Xóa khỏi nhóm',
  contexts: ['link'],
  parentId: DeathClick,
  onclick: genericRemoveUser
})

chrome.contextMenus.create({
  title: 'Xóa và chặn khỏi nhóm',
  contexts: ['link'],
  parentId: DeathClick,
  onclick: genericRemoveAndBanUser
})

function openNewTab(url) {
  chrome.tabs.create({ url });
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    // alert(request.functiontoInvoke);
    if (request.functiontoInvoke == "openNewTab") {
      openNewTab(request.params);
    }
    if (request.functiontoInvoke == "updateConfig") {
      updateConfig(request.key);
    }
    sendResponse();
  }
);

let listReaction = [
  {
    from: 'yIaFAbfUkOi.png',
    to: 'https://i.imgur.com/ynOBYg3.png' //icon trên bình luận
  },
  {
    from: 'vceWWODBKqx.png',
    to: 'https://i.imgur.com/hkIKsbB.png' //icon trên bình luận
  },
  {
    from: 'F8o05Pwe0vn.png',
    to: 'https://i.imgur.com/SQxnviZ.png' //icon trên bình luận
  },
  { 
    from: 'OwssFEPLcUW.png',
    to: 'https://www.facebook.com/rsrc.php/v3/yD/r/UAmSM9NxtV_.png' //trên khu thông báo
  },
  {
    from: 'XTeRB5Z20Am.png',
    to: 'https://www.facebook.com/rsrc.php/v3/yD/r/UAmSM9NxtV_.png' //khi hiện thông báo
  },
  {
    from: 'wAb778PQD6f.png',
    to: 'https://i.imgur.com/QacdtBQ.png' //rê chuột nút thích
  },
  {
    from: '23674693_2395177770707964_4494611271801995624',  //ảnh bìa
    to: 'https://i.imgur.com/TEwxAPL.png'
  },
  {
    from: 'facebook.com/images/emoji.php/v9/z6d/1.5/128/1f620.png', 
    to: 'https://www.facebook.com/images/emoji.php/v9/z63/1.5/128/1f60d.png' //cảm xúc trong messenger
  }
]

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    href = details.url;
    var length = href.length;
    if (href[length - 1] == '/') href = href.substr(0, length - 1);
    var _i = href.indexOf('?');
    if (_i == -1) _i = 100000;
    if (href.indexOf('facebook.com') > -1 && href.substring(0, _i - 1).split('/').length <= 3) {
      if (config['redirect_news_feed']) {
        return { redirectUrl: config['redirect_news_feed_url'] }
      }
      return {};
    }
    for (let i = 0; i < listReaction.length; i++) {
      reaction = listReaction[i];
      if (href.indexOf(reaction.from) > -1) {
        return { redirectUrl: reaction.to }
      }
    }
    
    // https://graph.facebook.com/${friend.id}/picture?type=large&redirect=true&width=40&height=40
    var listChangeAvatar = config['change_friends_avatar'];
    let len = listChangeAvatar.length;
    for (let i = 0; i < len; i++) {
      let friend = listChangeAvatar[i];
      if (href.indexOf('fbcdn.net') > -1 && href.indexOf(friend.avatar_id) > -1) {
        return { redirectUrl: friend.avatar }
      }

    }

  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
