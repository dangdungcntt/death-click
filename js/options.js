toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

const queryGroups = (graphData) => {
  if (graphData.paging.next) {
    return $.ajax({
      url: graphData.paging.next,
      method: 'get'
    })
      .then(nextData => {
        graphData.paging = nextData.paging;
        graphData.data = graphData.data.concat(nextData.data);
        return queryGroups(graphData);
      })
  }
  return graphData;
}

$(() => {
  loadConfig('access_token')
    .then(data => {
      return $.ajax({
        url: `https://graph.facebook.com/v2.11/me?fields=groups{administrator,name}&access_token=${data.value}`,
        method: 'get'
      })
    })
    .then(graphData => {
      return queryGroups(graphData.groups);
    })
    .then((graphData) => {
      let data = graphData.data;
      data.forEach((group) => {
        if (group.administrator) {
          $('#target_group').append(`<option value="${group.id}">${group.name}</option>`);
        }
      })
      return loadConfig('root');
    })
    .then(rootConfig => {
      let listFun = [];
      rootConfig.value.forEach(c => {
        listFun.push(loadConfig(c))
      });
      return Promise.all(listFun);
    })
    .then(ress => {
      ress.forEach(obj => {
        // console.log(obj);
        if (obj.key == "change_friends_avatar") { //array
          obj.value.forEach(friend => {
            // console.log(friend);
            let template = `
              <div class="input-group">
                <input class="form-control" value="${friend.id}|${friend.avatar}" placeholder="Ex: 1000000000|ex.com/img.png">
                
                <a id="${friend.id}" href="https://fb.com/${friend.id}" target="_blank" class="input-group-addon">
                  <img src="${friend.avatar}" alt="">
                </a>
                
              </div>`;
            $("#btnAddFriend").before(template);
            request('https://facebook.com/' + friend.id, "", "GET", (http) => {
              if (http.readyState == 4 && http.status == 200) {
                start = http.responseText.indexOf(`<title id="pageTitle">`);
                end = http.responseText.indexOf(`</title>`, start);
                let title = http.responseText.substring(start + 22, end);
                $('#' + friend.id).attr('title', title);
              }
            })
          })
          return;
        }
        if (obj.value.id) {
          $(`#${obj.key}`).val(obj.value.id)
        } else {
          $(`#${obj.key}`).val(obj.value);

        }
      })
    })
    .catch(err => console.log(err));

  $('#btnAddFriend').on('click', (e) =>{
    let _this = e.currentTarget;
    let listFriends = $('#change_friends_avatar input');
    for(let i = 0; i < listFriends.length; i++) {
      let friend = listFriends[i];
      if (friend.value.split('|').length < 2) {
        friend.focus();
        return;
      }
    }
    let template = `
      <div class="input-group">
        <input class="form-control" placeholder="Ex: 1000000000|ex.com/img.png">
        <div class="input-group-addon">
          <img src="#" alt="">
        </div>
      </div>`;
    $('#btnAddFriend').before(template);
  });

  $('#btnSave').on('click', (e) => {
    let _this = e.currentTarget;
    let access_token = $('#access_token').val();
    let target_group = $('#target_group').val();
    let target_group_name = $('#target_group').children(':selected').text();
    console.log(target_group);
    console.log(target_group_name);
    let redirect_news_feed_url = $('#redirect_news_feed_url').val() || "https://www.facebook.com/messages/t/";
    let change_friends_avatar = [];
    $('#change_friends_avatar input').each((index, el) => {
      let arr = $(el).val().split('|');
      if (arr.length > 1) {
        change_friends_avatar.push({id: arr[0], avatar: arr[1]});
      }
    });
    console.log(change_friends_avatar);
    Promise.all([
      setConfig('access_token', access_token),
      setConfig('target_group', { id: target_group, name: target_group_name }),
      setConfig('redirect_news_feed_url', redirect_news_feed_url),
      setConfig('change_friends_avatar', change_friends_avatar)
    ])
      .then(() => {
        toastr.success('Đã lưu thiết lập');
      })
      .catch(err => {
        toastr.warning('Có lỗi xuất hiện');
      })
    e.preventDefault();
  });

  $('#debug_access_token').on('click', (e) => {
    let _this = e.currentTarget;
    let access_token = $('#access_token').val();
    $(_this).attr('href', `https://developers.facebook.com/tools/debug/accesstoken/?q=${encodeURIComponent(access_token)}`);
    // e.preventDefault();
  });
});
