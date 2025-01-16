export interface Note {
    id: string;
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