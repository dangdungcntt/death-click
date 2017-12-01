const request = (url, params, method, cb) => {
    var http = new XMLHttpRequest();
    http.open(method, url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        cb(http);
    }
    http.send(params);
}


sendMessage = (id_group_message, message) => {
    let sendAPI = 'https://www.facebook.com/messaging/send/?dpr=1';
    var uid = document.cookie.match(/c_user=(\d+)/)[1];
    var dtsg = document.getElementsByName("fb_dtsg")[0].value;
    var params = `\
client=mercury&action_type=ma-type:user-generated-message\
&thread_fbid=${id_group_message}&fb_dtsg=${dtsg}&__user=${uid}\
&body=${message}`;
// var params = 'client=mercury&action_type=ma-type%3Auser-generated-message&body=1235&ephemeral_ttl_mode=0&has_attachment=false&message_id=6324227676803537040&offline_threading_id=6324227676803537040&signature_id=52545c34&source=source%3Achat%3Aweb&tags[0]=web%3Atrigger%3Ajewel_thread&thread_fbid=797125160412425&timestamp=1507813376618&ui_push_phase=C3&__user=100006487845973&__a=1&__dyn=5V4cjLx2ByK5A9UoHSEWC5ER6yUmAKFbGHyEyeWrWo8ovyui9zob4q2i5UK3u2O2KfgjyRQ8xK5WAAzoPBKaxeUPwExmt0Tz9VobrCCx3ypUkxvxuicx2q5o5S9J3o9ohwCwBxrxqrXG48B1G7WwzxW7-5EbHDBxu3Cq3ueDx6WK6468KbBy9FoO1vzU9oK7Uy5uazrAwIxCXy6by9o-qcK8Cx678-5E-8HgoUhyo&__af=h0&__req=1i&__be=1&__pc=PHASED%3ADEFAULT&__rev=3366207&fb_dtsg=AQHwnkF-mfiI%3AAQEkMGCwIumI&jazoest=2658172119110107704510910210573586581691077771671197311710973&__spin_r=3366207&__spin_b=trunk&__spin_t=1507813306'
    request(sendAPI, params, "POST", (http) => {
        if (4 == http.readyState && 200 == http.status) {
            alert('Xong');
            // console.log(http.responseText)
            // var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/); 
            // a = a ? a[1] : "Failed to get Access token make sure you authorized the HTC sense app"; 
            // cb(a);
        }
    });
}

sendMessage('797125160412425', 'Hello');

