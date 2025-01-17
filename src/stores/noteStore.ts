import { defineStore } from 'pinia';
import type { FileNode } from '../types'

export const useNoteStore = defineStore('noteStore', {
    state: () => ({
        currentNote: null as FileNode | null,
        noteList: [] as FileNode[],
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
        setCurrentNote(note: FileNode | null = null) {
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