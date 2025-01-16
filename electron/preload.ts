import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    writeNote: (title: string, content: string) => {
        ipcRenderer.send("write-note", { title, content });
    },
    getNotes: () => {
        return ipcRenderer.invoke("get-notes");
    },
    moveToRecycle: (title: string, content: string) => {
        ipcRenderer.send("move-to-recycle", { title, content });
    }
})