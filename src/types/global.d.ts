import type { NoteList, Note } from './note'

export interface IApi {
    getNotes: () => Promise<NoteList>,
    writeNote: (title: string, content: string) => void,
    moveToRecycle: (title: string, content: string) => void,
}

declare global {
    interface Window {
        api: IApi
    }
}