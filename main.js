/*
 * @Author: zhouxuan
 * @Date: 2023-11-07 11:26:21
 * @Last Modified by: zhouxuan
 * @Last Modified time: 2023-11-21 14:20:16
 */

const { app, BrowserWindow, ipcMain  } = require('electron')
const path = require('node:path')
const { io } = require("socket.io-client");

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  win.webContents.openDevTools();
  const socket = io("http://192.168.28.79:3000", {
    autoConnect: true,
    transports: ["websocket"]
  })
  console.log(socket, 'socket');
  // 监听预定义的 'connect' 事件
  socket.on('connect', () => {
    console.log('connect');
  });

  // 监听预定义的 'disconnect' 事件
  socket.on('disconnect', () => {
    console.log('disconnect');
  });

  // 监听预定义的 'connect_error' 事件
  socket.on('connect_error', (e) => {
    console.log('connect_error', e);
    
  });

  // 监听预定义的 'chat message' 事件
  socket.on('chat message', (data, id) => {
    win.webContents.send('socket_msg', data, id)
  }); 

  ipcMain.on('send_msg', (event, data, counter) => {
    socket.emit('chat message', data, `${socket.id}-${counter}`, () => {});
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})