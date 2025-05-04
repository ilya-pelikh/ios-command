const express = require('express');

function createServer(ipcMain, mainWindow) {
  const app = express();
  const port = 3000;

  // Middleware для парсинга JSON
  app.use(express.json());

  // Обработчики IPC в главном процессе
  ipcMain.handle('execute-js', async (event, code) => {
    return await mainWindow.webContents.executeJavaScript(code);
  });

  // API endpoint для выполнения JS
  app.post('/execute', async (req, res) => {
    const request = req.body?.request
    console.log(req.body)
    
    if (!request) return res.json({ result: 'Нет кода' });

    const script = `
    function setNativeValue(element, value) {
      let lastValue = element.value;
      element.value = value;
      let event = new Event("input", { target: element, bubbles: true });
      // React 15
      event.simulated = true;
      // React 16
      let tracker = element._valueTracker;
      if (tracker) {
          tracker.setValue(lastValue);
      }
      element.dispatchEvent(event);
    } 

    function load () {
      const textarea = document.querySelector('#chat-input')

      const text = 'Привет, мир!'

      return new Promise(res => {
        var input = document.getElementById('chat-input');
        setNativeValue(input, "${request}");
        const inputIcon = document.querySelector('div[aria-disabled="false"]')
        inputIcon.click()

        setTimeout(() => {
          const interval = setInterval(() => {
            const node = document.querySelector('div[role=button]>div>.ds-icon>svg')
            console.log(node)
            if (node) {
              clearInterval(interval)
              const nodes = Array.from(document.querySelectorAll('.ds-markdown')).map(el => el.innerText.replaceAll('\\n', ' '))
              const result = nodes.join(' ')
              res(result)
            }
        }, 2000)

      })



      })
    }



    load()
    `

    


    try {
      const answer = await mainWindow.webContents.executeJavaScript(script);
      res.json({answer});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API endpoint для навигации
  app.post('/navigate', async (req, res) => {
    try {
      await mainWindow.loadURL(req.body.url);
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = { createServer };
        // Array.from(document.querySelectorAll('.ds-markdown')).map(el => el.innerText.replaceAll('\n', ' '))
// setTimeout(() => {
//   function setNativeValue(element, value) {
//       let lastValue = element.value;
//       element.value = value;
//       let event = new Event("input", { target: element, bubbles: true });
//       // React 15
//       event.simulated = true;
//       // React 16
//       let tracker = element._valueTracker;
//       if (tracker) {
//           tracker.setValue(lastValue);
//       }
//       element.dispatchEvent(event);
//     }

//     var input = document.getElementById('chat-input');
//     setNativeValue(input, "VALUE YOU WANT TO SET");

//     }, 3000)
//   }

// load()
// `