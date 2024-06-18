const mssOnClick = () => {
  button.disabled = true

  chrome.tabs.query({
    active: true,
    currentWindow: true
  },
  tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['js/content_script.js']
    })
  })
}

const button = document.getElementById('mss-send-button')
button.addEventListener('click', mssOnClick)
