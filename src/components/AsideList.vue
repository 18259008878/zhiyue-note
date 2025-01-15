<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCurrentNoteStore, useFreshNoteStore } from '../stores';
import type { Note } from '../types/note';

const notes = ref<Note[]>([]);
const currentNoteStore = useCurrentNoteStore();
const freshNoteStore = useFreshNoteStore();

function handleOpenNote(note: Note): void {
    currentNoteStore.setCurrentNote(note);
}

watch(() => freshNoteStore.needFresh, async (needFresh) => {
    if (needFresh) {
        const data = await window.api.getNotes();
        notes.value = data as Note[];
        freshNoteStore.resetNeedFresh();
    }
}, { immediate: true });

</script>

<template>
    <ul id="notes-list" ref="notesList">
        <li v-for="note in notes" :key="note.id" @click="handleOpenNote(note)"
            :class="{ active: note.id == currentNoteStore.currentNote?.id }">{{ note.title }}</li>
    </ul>
</template>

<style scoped>
#notes-list {
    list-style-type: none;
    padding: 3rem 3rem;
    height: 100%;
    margin-top: 18vh;
    width: 28%;
}

#notes-list li {
    font-size: 1.2rem;
    margin: 0.5rem 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
    color: var(--color);
    cursor: pointer;
}

#notes-list li.active {
    background-color: var(--selected-color);
}

#notes-list li:hover {
    background-color: var(--selected-color);
}
</style>