const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, '..', 'Update.exe')
const exeName = path.basename(process.execPath)

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
	// let autoLaunch = new AutoLaunch({
	// 	name: 'Your app name goes here',
	// 	path: app.getPath('exe')
	// })

	// autoLaunch.isEnabled().then((isEnabled) => {
	// 	if (!isEnabled) autoLaunch.enable()
	// })

	const isDevelopment = process.env.NODE_ENV !== 'production'
	if (isDevelopment === false) {
		launchAtStartup()
	}

	function launchAtStartup() {
		const config = {
			openAtLogin: true,
			openAsHidden: true
		}

		if (process.platform !== 'darwin') {
			config.path = updateExe
			config.args = [
				'--processStart',
				`"${exeName}"`,
				'--process-start-args',
				`"--hidden"`
			]
		}

		app.setLoginItemSettings(config)
	}

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
