/* eslint-disable no-undef */
// 'use strict'
function shortcut(shortcut, callback, opt) {
  //Provide a set of default options
  var default_options = {
    'type': 'keydown',
    'propagate': false,
    'target': document
  }
  if (!opt) opt = default_options;
  else {
    for (var dfo in default_options) {
      if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
    }
  }

  var ele = opt.target
  if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
  var ths = this;

  //The function to be called at keypress
  var func = function (e) {
    e = e || window.event;

    //Find Which key is pressed
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code).toLowerCase();

    var keys = shortcut.toLowerCase().split("+");
    //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
    var kp = 0;

    //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
    var shift_nums = {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ":",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    }
    //Special Keys - and their codes
    var special_keys = {
      'esc': 27,
      'escape': 27,
      'tab': 9,
      'space': 32,
      'return': 13,
      'enter': 13,
      'backspace': 8,

      'scrolllock': 145,
      'scroll_lock': 145,
      'scroll': 145,
      'capslock': 20,
      'caps_lock': 20,
      'caps': 20,
      'numlock': 144,
      'num_lock': 144,
      'num': 144,

      'pause': 19,
      'break': 19,

      'insert': 45,
      'home': 36,
      'delete': 46,
      'end': 35,

      'pageup': 33,
      'page_up': 33,
      'pu': 33,

      'pagedown': 34,
      'page_down': 34,
      'pd': 34,

      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,

      'f1': 112,
      'f2': 113,
      'f3': 114,
      'f4': 115,
      'f5': 116,
      'f6': 117,
      'f7': 118,
      'f8': 119,
      'f9': 120,
      'f10': 121,
      'f11': 122,
      'f12': 123
    }


    for (var i = 0; k = keys[i], i < keys.length; i++) {
      //Modifiers
      if (k == 'ctrl' || k == 'control') {
        if (e.ctrlKey) kp++;

      } else if (k == 'shift') {
        if (e.shiftKey) kp++;

      } else if (k == 'alt') {
        if (e.altKey) kp++;

      } else if (k.length > 1) { //If it is a special key
        if (special_keys[k] == code) kp++;

      } else { //The special keys did not match
        if (character == k) kp++;
        else {
          if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
            character = shift_nums[character];
            if (character == k) kp++;
          }
        }
      }
    }

    if (kp == keys.length) {
      callback(e);

      if (!opt['propagate']) { //Stop the event
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = false;

        //e.stopPropagation works only in Firefox.
        if (e.stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        return false;
      }
    }
  }

  //Attach the function with the event	
  if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
  else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
  else ele['on' + opt['type']] = func;
}

const maps = [
  ['k(h|H)', 'x'],
  ['K(h|H)', 'X'],
  ['c(?!(h|H))|q', 'k'],
  ['C(?!(h|H))|Q', 'K'],
  ['t(r|R)|c(h|H)', 'c'],
  ['T(r|R)|C(h|H)', 'C'],
  ['d|g(i|I)|r', 'z'],
  ['D|G(i|I)|R', 'Z'],
  ['g(i|ì|í|ỉ|ĩ|ị|I|Ì|Í|Ỉ|Ĩ|Ị)', 'z$1'],
  ['G(i|ì|í|ỉ|ĩ|ị|I|Ì|Í|Ỉ|Ĩ|Ị)', 'Z$1'],
  ['đ', 'd'],
  ['Đ', 'D'],
  ['p(h|H)', 'f'],
  ['P(h|H)', 'F'],
  ['n(g|G)(h|H)?', 'q'],
  ['N(g|G)(h|H)?', 'Q'],
  ['(g|G)(h|H)', '$1'],
  ['t(h|H)', 'w'],
  ['T(h|H)', 'W'],
  ['(n|N)(h|H)', '$1\'']
];

const tieqviet = input => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`);
  }

  return maps.reduce((seed, map) => {
    input = input.replace(new RegExp(map[0], 'g'), map[1]);
    return input;
  }, input);
};

String.isNullOrEmpty = function (value) {
  return !(typeof value === 'string' && value.length > 0)
}

const getToken = (cb) => {
  var uid = document.cookie.match(/c_user=(\d+)/)[1]
  dtsg = document.getElementsByName('fb_dtsg')[0].value
  url = '//www.facebook.com/v1.0/dialog/oauth/confirm'
  params = `fb_dtsg=${dtsg}&app_id=165907476854626&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1&__user=${uid}`;
  request(url, params, 'POST', (http) => {
    if (http.readyState == 4 && http.status == 200) {
      var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/)
      a = a ? a[1] : 'Failed to get Access token make sure you authorized the HTC sense app'
      cb(a)
    }
  })
}

const comment = (postId, comment) => {
  let graphAPI = 'https://graph.facebook.com'
  getToken((token) => {
    var params = `access_token=${token}&message=${comment}`
    request(`${graphAPI}/${postId}/comments`, params, 'POST', (http) => {
      if (http.status === 200 && http.readyState === 4) {
        return alert('Đã bình luận ' + comment)
      }
    })
  })
}

const getUserIdFromLink = (link, cb) => {
  var id = ''
  var str = link.split('/').slice(-1)[0]
  var existId = str.indexOf('id=')
  if (existId > -1) {
    id = /\d{8,15}/.exec(str).toString()
    return cb(id)
  } else {
    loadConfig('access_token')
    .then(access_token => {
      var str = link.split('/').slice(-1)[0]
      var graph = `https://graph.facebook.com/${str}?fields=id&access_token=${access_token.value}`;
      // alert(graph);
      request(graph, "", 'GET', (http) => {
        if (http.status == 200 && http.readyState == 4) {
          res = JSON.parse(http.responseText);
          cb(res.id);
        }
      })
    })
    
    // request(link, "", 'GET', (http) => {
    //   if (http.status == 200 && http.readyState == 4) {
    //     // console.log(/\"entity_id\":\"(\d+)\"/.exec(http.responseText));
    //     let id = /\"entity_id\":\"(\d+)\"/.exec(http.responseText)[1];
    //     cb(id)
    //   }
    // })
  }
}

const getID = (link) => {
  // alert(1);
  getUserIdFromLink(link, (id) => {
    prompt("", id);
  })
}

const removeUser = (link, banUser = 0) => {
  loadConfig('target_group')
  .then(group => {
    getUserIdFromLink(link, (id) => {
      let removeAPI = `https://www.facebook.com/ajax/groups/members/remove.php?group_id=${group.value.id}&uid=${id}&is_undo=0&source=profile_browser&dpr=1`
      var uid = document.cookie.match(/c_user=(\d+)/)[1]
      var dtsg = document.getElementsByName('fb_dtsg')[0].value
      var params = `fb_dtsg=${dtsg}&confirm=true&ban_user=${banUser}&__user=${uid}`
      if (!id || id === uid) {
        alert('Đừng tự xóa bản thân chứ =))')
        return
      }
      request(removeAPI, params, 'POST', (http) => {
        if (http.readyState == 4 && http.status == 200) {
          alert('Xong')
        }
      })
    })
  })
}

chrome.extension.onMessage.addListener((message, sender, callback) => {
  if (message.functiontoInvoke) {
    switch (message.functiontoInvoke) {
      case 'comment': comment(); break
      case 'getID': getID(message.link); break
      case 'removeUser': removeUser(message.link); break
      case 'removeAndBanUser': removeUser(message.link, 1); break
    }
  }
})

shortcut("Ctrl+I", function (e) { //Ctrl I for convert to tieqviet
  var selection = getSelection();
  var data = tieqviet(selection.baseNode.data);
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(data).select();
  document.execCommand("copy");
  $temp.remove();
  $(e.target).focus();
  selection = getSelection();
  var range = document.createRange();
  range.selectNodeContents(e.target);
  selection.removeAllRanges();
  selection.addRange(range);
  // document.execCommand("Paste");
  setTimeout(() => {
    document.execCommand("Paste");
  }, 1);
});

shortcut("Ctrl+Q", async function (e) { //Ctrl Q for convert to Tieng Viet
  // alert(1);
  var transLocal = await loadConfig('translate_vi2vi');
  var url = "https://dangdung-trans.herokuapp.com/vi2vi";
  if (transLocal.value) {
    url = "https://localhost:3000/vi2vi";
  }
  var selection = getSelection();
  console.log(url)
  $.ajax({
    url,
    method: "POST",
    // crossDomain: true,
    data: {
      text: selection.baseNode.data
    },
    dataType: 'json'
  })
  .then(res => {
    console.log(res);
    var data = res.text;
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(data).select();
    document.execCommand("copy");
    $temp.remove();
    $(e.target).focus();
    selection = getSelection();
    var range = document.createRange();
    range.selectNodeContents(e.target);
    selection.removeAllRanges();
    selection.addRange(range);
    // document.execCommand("Paste");
    setTimeout(() => {
      document.execCommand("Paste");
    }, 1);
  })
  .catch(err => console.log(err))
  
});
