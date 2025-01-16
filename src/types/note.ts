export interface Note {
    title: string;
    content: string;
    categoryName?: string;
}

export interface NoteListNode {
    type: 'file' | 'directory';
    name: string;
    content?: Note;
    children?: NoteListNode[];
}

export interface NoteMeta {
    title: string;
    fullPath: string;
}