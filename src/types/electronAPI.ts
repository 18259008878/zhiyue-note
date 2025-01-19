import type { FileNode } from "./note"

export interface IApi {
    getNotes: () => Promise<FileNode[]>,
    writeNote: (fileNodeJson: string) => void,
    createCategory: (path: string) => void,
    renameNote: (oldPath: string, newPath: string) => void,
    moveToRecycle: (fileNodeJson: string) => void,
    recycleNote: (fileNodeJson: string) => void,
    deleteNote: (fileNodeJson: string) => void,
}