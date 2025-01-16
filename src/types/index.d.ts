export { Note, NoteListNode, NoteMeta } from './note';
import { IApi } from './electronAPI';

declare global {
    interface Window {
        api: IApi
    }
}
