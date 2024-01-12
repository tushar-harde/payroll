const { contextBridge } = require("electron/renderer");
const { ipcRenderer } = require("electron");

const openDirectoryDialog = async (callback) => {
  try {
    let result = await ipcRenderer.invoke("showDialog", "message");
    callback(false, result);
  } catch (error) {
    callback(error);
  }
};

const savePayslips = async (data, callback) => {
  try {
    let result = await ipcRenderer.invoke("savePayslips", data);
    callback(false, result);
  } catch (error) {
    callback(error);
  }
};

contextBridge.exposeInMainWorld("api", {
  openDirectoryDialog: (callback) => openDirectoryDialog(callback),
  savePayslips: (data, callback) => savePayslips(data, callback),
});
