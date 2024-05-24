const { app, BrowserWindow } = require("electron");
const path = require("path");
//require("../Server/index");
let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPrefrences: {
      nodeIntegration: true,
      worldSafeExecution: true,
      contextIsolation: true,
    },
  });
  mainWindow.loadURL(
    true
      ? "http://localhost:3000#/"
      : `file://${path.resolve(
          path.join(__dirname, "..", "build", "index.html#/")
        )}`
  );

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  createWindow();
});

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

// Gracefully handle app termination
app.on("before-quit", () => {
  // Kill the backend server process before quitting the app
  if (backendProcess) {
    backendProcess.kill();
  }
});
