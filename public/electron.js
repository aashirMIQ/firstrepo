const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  // mainWindow.once("ready-to-show", () => {
    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : process.env.LOAD_URL
          ? process.env.LOAD_URL
          : `file://${path.join(__dirname, "../build/index.html")}`
    );
  // });
  // mainWindow.loadURL(
  //   process.env.LOAD_URL ||
  //     // `file://${path.join(__dirname, "../build/index.html")}`
  //     `../build/index.html`
  // );
  mainWindow.on("closed", () => (mainWindow = null));

  // use this to open dev tools manualy to debug
  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
