const express = require('express');

const { createExploit } =  require('./exploit')

function createServer(ipcMain, mainWindow) {
  const app = express();
  const port = 3000;

  app.use(express.json());

  ipcMain.handle('execute-js', async (event, code) => {
    return await mainWindow.webContents.executeJavaScript(code);
  });

  // API endpoint для выполнения JS
  app.post('/execute', async (req, res) => {
    const request = req.body?.request
    const count = req.body?.count || 0
    console.log(req.body)
    
    if (!request) return res.json({ result: 'Нет кода' });



    try {
      const script = createExploit(request, count)
      const answer = await mainWindow.webContents.executeJavaScript(script);
      console.log(answer)
      res.json({ answer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// // API endpoint для навигации
// app.post('/navigate', async (req, res) => {
// try {
//     await mainWindow.loadURL(req.body.url);
//     res.json({ status: 'success' });
// } catch (error) {
//     res.status(500).json({ error: error.message });
// }
// });

module.exports = { createServer };