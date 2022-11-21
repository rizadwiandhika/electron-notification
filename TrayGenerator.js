const path = require("path");

const { Tray, Menu } = require("electron");

class TrayGenerator {
  constructor(app, mainWindow, store) {
    this.app = app;
    this.mainWindow = mainWindow;
    this.tray = null;
    this.store = store;
  }

  getWindowPosition = () => {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
    );
    const y = Math.round(trayBounds.y + trayBounds.height);
    return { x, y };
  };

  showWindow = () => {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.focus();
    // this.mainWindow.setVisibleOnAllWorkspaces(false);
  };

  toggleWindow = () => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  };

  rightClickMenu = () => {
    const menu = [
      {
        label: "Launch at startup",
        type: "checkbox",
        checked: this.store.get("isLaunchAtStart"),
        click: (event) => {
          this.store.set("isLaunchAtStart", event.checked);
          this.app.setLoginItemSettings({
            ...this.app.getLoginItemSettings(),
            openAtLogin: this.store.get("isLaunchAtStart"),
          });
        },
      },
      {
        type: "separator",
      },
      {
        role: "quit",
        accelerator: "CmdOrCtrl+Q",
      },
    ];
    this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
  };

  createTray = () => {
    this.tray = new Tray(path.join(__dirname, "./assets/IconTemplate.png"));
    this.tray.setIgnoreDoubleClickEvents(true);

    this.tray.on("click", this.toggleWindow);
    this.tray.on("right-click", this.rightClickMenu);
  };
}

module.exports = TrayGenerator;
