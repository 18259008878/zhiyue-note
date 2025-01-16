export { Note, NoteListNode } from './note';
export { IApi } from './electronAPI';

declare global {
    interface Window {
        api: IApi
    }
}
