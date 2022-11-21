require("dotenv").config();

const path = require("path");

const { app, ipcMain, BrowserWindow } = require("electron");
const Store = require("electron-store");

const TrayGenerator = require("./TrayGenerator");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 225,
    height: 300,
    // show: !app.getLoginItemSettings().wasOpenedAsHidden,
    backgroundColor: "#FFF",
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  return win;
};

app.whenReady().then(() => {
  const store = new Store({
    isLaunchAtStart: { type: "boolean", default: true },
  });
  console.log(store.get("isLaunchAtStart"));

  const window = createWindow();

  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, "..", "Update.exe");
  const exeName = path.basename(process.execPath);

  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("env", () => ({
    LocalDev: process.env.LOCAL_DEV === "true",
    restart: {
      isPackaged: app.isPackaged,
      appFolder,
      updateExe,
      exeName,
    },
  }));

  const tray = new TrayGenerator(app, window, store);
  tray.createTray();

  if (process.env.LOCAL_DEV !== "true") {
    console.warn("Launching at startup");
    launchAtStartup();
  }

  if (process.platform === "darwin") {
    app.dock.hide();
  }

  // app.on("activate", () => {
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });

  // app.on("window-all-closed", () => {
  //   if (process.platform !== "darwin") {
  //     app.quit();
  //   }
  // });
});

function launchAtStartup() {
  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, "..", "Update.exe");
  const exeName = path.basename(process.execPath);

  let config = {
    openAtLogin: true,
    openAsHidden: true,
  };
  if (process.platform === "win32") {
    config = {
      ...config,
      path: updateExe,
      args: [
        "--processStart",
        `"${exeName}"`,
        "--process-start-args",
        `"--hidden"`,
      ],
    };
  }
  app.setLoginItemSettings(config);
}
