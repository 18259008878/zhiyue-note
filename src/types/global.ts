import type { Note } from './note'

declare global {
    interface Window {
        api: {
            getNotes: () => Promise<Note[]>;
            writeNote: (title: string, content: string) => void;
        };
    }
}