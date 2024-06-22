document.querySelectorAll('[data-i18n]').forEach(elem => {
  elem.innerText = chrome.i18n.getMessage(elem.dataset.i18n)
})

const mssSendLines = (movie) => {
  const html = document.querySelector('html#whatsapp-web')
  if (!html) {
    return
  }

  const main = document.querySelector('#main')
  if (!main) {
    return
  }

  const textarea = main.querySelector(`div[contenteditable="true"]`)
  if (!textarea) {
    return
  }

  const findLanguage = () => {
    const availables = ['en', 'es']

    for (const lang of navigator.languages) {
      if (availables.includes(lang.substring(0, 2))) {
        return lang.substring(0, 2)
      }
    }

    return 'en'
  }

  fetch(`https://raw.githubusercontent.com/inigochoa/the-movie-script-sender/main/scripts/${movie}/${findLanguage()}.json`)
    .then((response) => response.json())
    .then(async (lines) => {
      for (const line of lines) {
        textarea.focus()
        document.execCommand('insertText', false, line)
        textarea.dispatchEvent(new Event('change', { bubbles: true }))

        setTimeout(() => (main.querySelector(`[data-testid="send"]`) || main.querySelector(`[data-icon="send"]`)).click(), 100)

        await new Promise(resolve => setTimeout(resolve, 500))
      }
    })
}

const mssOnClick = () => {
  button.disabled = true

  chrome.tabs.query({
    active: true,
    currentWindow: true
  },
  tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: mssSendLines,
      args: [ select.value ],
    })
  })
}

const button = document.getElementById('mss-send-button')
const select = document.getElementById('mss-movie')

button.addEventListener('click', mssOnClick)
