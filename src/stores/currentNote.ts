import type { Note } from '../types/note'
import { defineStore } from 'pinia'

export const useCurrentNoteStore = defineStore('currentNote', {
    state: () => ({
        currentNote: null as Note | null
    }),
    getters: {
        getCurrentNote: (state) => state.currentNote
    },
    actions: {
        setCurrentNote(note: Note) {
            this.currentNote = note
        },
        clearCurrentNote() {
            this.currentNote = null
        }
    }
})