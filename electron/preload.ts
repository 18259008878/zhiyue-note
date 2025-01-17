import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    writeNote: (fileNodeJson: string) => {
        ipcRenderer.send("write-note", fileNodeJson);
    },
    getNotes: () => {
        return ipcRenderer.invoke("get-notes");
    },
    moveToRecycle: (fileNodeJson: string) => {
        ipcRenderer.send("move-to-recycle", fileNodeJson);
    },
    recycleNote: (fileNodeJson: string) => {
        ipcRenderer.send("recycle-note", fileNodeJson);
    },
    deleteNote: (fileNodeJson: string) => {
        ipcRenderer.send("delete-note", fileNodeJson);
    }
})