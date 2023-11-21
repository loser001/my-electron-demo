const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  socket_msg: (callback) => ipcRenderer.on('socket_msg', (event, data) => { callback(data) }),
  send_msg: (data, counter) => ipcRenderer.send('send_msg', data, counter)
})