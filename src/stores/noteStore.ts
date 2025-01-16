import { defineStore } from 'pinia';
import type { Note, NoteListNode } from '../types'

export const useNoteStore = defineStore('noteStore', {
    state: () => ({
        currentNote: null as Note | null,
        noteList: [] as NoteListNode[],
    }),
    actions: {
        async fetchNoteList() {
            this.noteList = await window.api.getNotes();
        },
        /**
         *
         * @default null
         * @description 设置编辑器展示的笔记
         * @param note 笔记
         */
        setCurrentNote(note: Note | null = null) {
            this.currentNote = note;
        },

        /**
         *
         * @description 初始化
         */
        init() {
            this.setCurrentNote();
            this.fetchNoteList();
        }
    }
});