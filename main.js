const { app, ipcMain, BrowserWindow } = require('electron')
const AutoLaunch = require('auto-launch')
const path = require('path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	let autoLaunch = new AutoLaunch({
		name: 'Your app name goes here',
		path: app.getPath('exe')
	})

	autoLaunch.isEnabled().then((isEnabled) => {
		if (!isEnabled) autoLaunch.enable()
	})

	createWindow()
	ipcMain.handle('ping', () => 'pong')

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
