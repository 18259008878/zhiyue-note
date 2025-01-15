import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    writeNote: (title, content) => {
        ipcRenderer.send("write-note", { title, content });
    },
    getNotes: () => {
        return ipcRenderer.invoke("get-notes");
    }
})