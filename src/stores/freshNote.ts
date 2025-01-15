import { defineStore } from 'pinia'

export const useFreshNoteStore = defineStore('freshNote', {
    state: () => ({
        needFresh: false,
    }),
    actions: {
        /**
         * Set needFresh to true
         */
        setNeedFresh() {
            this.needFresh = true;
        },
        /**
         * Set needFresh to false
         */
        resetNeedFresh() {
            this.needFresh = false;
        }
    }
})