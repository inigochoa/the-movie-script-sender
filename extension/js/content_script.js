const mssSendLines = () => {
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

  fetch(`https://raw.githubusercontent.com/inigochoa/the-movie-script-sender/main/scripts/shrek/${findLanguage()}.json`)
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

mssSendLines()
