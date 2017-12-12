
const request = (url, params, method, cb) => {
  var http = new XMLHttpRequest()
  http.open(method, url, true)
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  http.onreadystatechange = function () {
    cb(http)
  }
  http.send(params)
}

const loadConfig = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (data) => {
      if (typeof data[key] == 'undefined')
        return reject(`${key} is not defined`);
      resolve({key, value: data[key]});
    });
  })
}

const setConfig = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      chrome.runtime.sendMessage({
        functiontoInvoke: 'updateConfig',
        key
      }, () => resolve());
    });
  })
}
