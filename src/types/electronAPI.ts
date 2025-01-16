import type { NoteListNode } from "./note"

export interface IApi {
    getNotes: () => Promise<NoteListNode[]>,
    writeNote: (title: string, content: string) => void,
    moveToRecycle: (noteListNodeJson: string) => void,
    deleteNote: (noteJson: string) => void,
}