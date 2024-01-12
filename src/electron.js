const electron = require("electron/main");
const path = require("path");
const { ipcMain, dialog } = require("electron");
const fs = require("fs").promises;

const app = electron.app;
const menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  // Remove default menu
  menu.setApplicationMenu(null);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

ipcMain.handle.call(this, "showDialog", async (e) => {
  mainWindow.moveTop();
  let dirinfo = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  return dirinfo.filePaths[0];
});

ipcMain.handle("savePayslips", async (e, data) => {
  try {
    if (!data?.dir) data.dir = path.join(__dirname, "payslip");
    await Promise.all(
      data?.payslips.map(async (el) => {
        let filepath = path.join(data.dir, el?.fileName);
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        // Write Buffer to a file
        await fs.writeFile(filepath, Buffer.from(el?.arrayBuffer), {
          flag: "w",
        });
      })
    );
    return {
      dir: data?.dir,
    };
  } catch (error) {
    throw error;
  }
});

// For debug
let win, serve;
const args = process.argv.slice(1);
serve = args.some((val) => val === "--serve");

if (serve) {
  require("electron-reload")(__dirname, {});
}
