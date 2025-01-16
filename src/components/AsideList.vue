<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFreshNoteStore } from '../stores';
import type { NoteListNode } from '../types/note';

const notes = ref<NoteListNode[]>([]);
// const currentNoteStore = useCurrentNoteStore();
const freshNoteStore = useFreshNoteStore();

// function handleOpenNote(note: Note): void {
//     currentNoteStore.setCurrentNote(note);
// }

// function moveToRecycle(note: Note): void {
//     window.api.moveToRecycle(note.title, note.content);
//     freshNoteStore.setNeedFresh();
// }

watch(() => freshNoteStore.needFresh, async (needFresh) => {
    if (needFresh) {
        const data = await window.api.getNotes();
        notes.value = data;
        for (let i = 0; i < notes.value.length; i++) {
            console.log(notes.value[i]);
        }
        freshNoteStore.resetNeedFresh();
    }
}, { immediate: true });

</script>

<template>
    <ul id="notes-list" ref="notesList">
        <!-- <li v-for="note in notes" :key="note.id">
            <div class="note-title" @click="handleOpenNote(note)" :class="{ active: note.id == currentNoteStore.currentNote?.id }">
                {{ note.title }}-{{ note.categoryName }}
            </div>
            <button class="delete-btn" @click="moveToRecycle(note)">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </li> -->
    </ul>
</template>

<style scoped>
#notes-list {
    list-style-type: none;
    padding: 3rem 3rem;
    height: 100%;
    margin-top: 18vh;
    width: 20%;
}

#notes-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.note-title {
    width: 80%;
    font-size: 1.2rem;
    margin: 0.5rem 0.5rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.5rem;
    color: var(--color);
    cursor: pointer;
}

.note-title.active {
    background-color: var(--selected-color);
}

.note-title:hover {
    background-color: var(--selected-color);
}

.delete-btn {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background-color: #be656d;
    color: var(--color);
    cursor: pointer;
}

.delete-btn:hover {
    background-color: #d42332;
}
</style>