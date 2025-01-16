import { defineStore } from 'pinia';
import type { Note } from '../types/note'

export const useNoteStore = defineStore('noteStore', {
    state: () => ({
        currentNote: null as Note | null,
        needFresh: false,
    }),
    actions: {
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
         * @default true
         * @description 设置是否需要刷新
         * @param needFresh 是否需要刷新
         */
        setNeedFresh(needFresh: boolean = true) {
            this.needFresh = needFresh;
        },

        /**
         *
         * @description 初始化
         */
        init() {
            this.setNeedFresh();
            this.setCurrentNote();
        }
    }
});