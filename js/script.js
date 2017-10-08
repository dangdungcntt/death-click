String.isNullOrEmpty = function (value) {
  return !(typeof value === "string" && value.length > 0);
}

const request = (url, params, method, cb) => {
  var http = new XMLHttpRequest();
  http.open(method, url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    cb(http);
  }
  http.send(params);
}

const getToken = (cb) => {
  var uid = document.cookie.match(/c_user=(\d+)/)[1];
  dtsg = document.getElementsByName("fb_dtsg")[0].value;
  url = "//www.facebook.com/v1.0/dialog/oauth/confirm";
  params = "fb_dtsg=" + dtsg + "&app_id=165907476854626&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1&__user=" + uid;
  request(url, params, "POST", (http) => {
    if (4 == http.readyState && 200 == http.status) {
      var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/);
      a = a ? a[1] : "Failed to get Access token make sure you authorized the HTC sense app";
      cb(a);
    }
  });
}
const getCommentRequire = (start, end) => {
  let contentOfThisPost = document.querySelector('.userContent > div > span._5z6m > span').innerText;
  let st = contentOfThisPost.indexOf(start);
  let en = contentOfThisPost.indexOf(end, st + st.length);
  let commentRequire = contentOfThisPost.substring(st, en + en.length);
  return commentRequire;
}

// let postId = document.querySelector('.fbUserStory a[href*=posts]').href.split('/').slice(-1)[0];
// let comment = getCommentRequire(arrInput[0], arrInput[1]);

comment = (postId, comment) => {
  let graphAPI = 'https://graph.facebook.com';
  getToken((token) => {
    var params = `access_token=${token}&message=${comment}`;
    request(`${graphAPI}/${postId}/comments`, params, "POST", (http) => {
      if (http.status == 200 && http.readyState == 4) {
        return alert('Đã bình luận ' + comment);
      }
    });
  })
}

getUserIdFromLink = (link, cb) => {
  var id = "";
  var str = link.split('/').slice(-1)[0];
  var existId = str.indexOf('id=');
  if (existId > -1) {
    id = /\d{15}/.exec(str).toString();
    return cb(id);
  } else {
    var username = str.substring(0, str.indexOf('?') || str.length - 1);
    request('https://mbasic.facebook.com/' + username, "", "GET", (http) => {
      if (http.status == 200 && http.readyState == 4) {
        id = /thread\/\d{9,15}/.exec(http.responseText).toString().substr(7, 15);
        return cb(id);
      }
    });
  }
}

removeUser = (link) => {
  getUserIdFromLink(link, (id) => {
    let removeAPI = 'https://www.facebook.com/ajax/groups/members/remove.php?group_id=677222392439615&uid=' + id + '&is_undo=0&source=profile_browser&dpr=1';
    var uid = document.cookie.match(/c_user=(\d+)/)[1]; 
    var dtsg = document.getElementsByName("fb_dtsg")[0].value;
    var params ='fb_dtsg=' + dtsg + '&confirm=true&__user=' + uid;
    if (id == uid) {
      alert('Đừng tự xóa bản thân chứ =))');
      return;
    }
    request(removeAPI, params, "POST", (http) => { 
        if (4 == http.readyState && 200 == http.status) { 
            alert('Xong');
            // console.log(http.responseText)
            // var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/); 
            // a = a ? a[1] : "Failed to get Access token make sure you authorized the HTC sense app"; 
            // cb(a);
        } 
    });
  });
}

chrome.extension.onMessage.addListener((message, sender, callback) => {
  if (message.functiontoInvoke) {
    switch (message.functiontoInvoke) {
      case "comment": comment(); break;
      case "removeUser": removeUser(message.link); break;
    }
  }
});