const sendFunction = (funName, data) => {
  data.functiontoInvoke = funName
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, () => {})
    }
  )
}

$(function() {
  $("input[type=checkbox]").each((index, el) => {
    var id = $(el).attr("id")
    loadConfig(id)
      .then(obj => {
        if (obj.value) $(el).click()
      })
      .catch(err => console.log(err))
  })
  $("input[type=checkbox]").on("change", e => {
    var id = $(e.target).attr("id")
    var value = $(e.target).is(":checked")
    setConfig(id, value)
  })

  $("#btnSettings").on("click", e => {
    chrome.runtime.openOptionsPage()
  })
})
