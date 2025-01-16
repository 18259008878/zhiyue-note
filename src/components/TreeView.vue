<script setup lang="ts">
import { useNoteStore } from '../stores';
import type { Note, NoteListNode } from '../types';

defineProps<{
    items: NoteListNode[]
}>();

const noteStore = useNoteStore();

function handleOpenNote(note: Note): void {
    noteStore.setCurrentNote(note);
}

function deleteNote(noteListNode: NoteListNode): void {
    if (noteListNode.type === 'directory') return;
    if (noteListNode.content!.categoryName === '回收站' && confirm('确定要彻底删除吗？')) {
        window.api.deleteNote(JSON.stringify(noteListNode.content));
        console.log(noteStore.currentNote, noteListNode.content);
        if (noteStore.currentNote?.title === noteListNode.content?.title) {
            noteStore.setCurrentNote();
        }
        noteStore.fetchNoteList();
        return;
    }
    window.api.moveToRecycle(JSON.stringify(noteListNode));
    noteStore.fetchNoteList();
}

</script>

<template>
    <div>
        <div v-for="item in items">
            <div v-if="item.type === 'directory'" class="directory">
                <div class="title-container">
                    <span class="icon">📁</span>
                    <strong>{{ item.name }}</strong>
                </div>
                <div class="children">
                    <TreeView :items="item.children!" />
                </div>
            </div>
            <div v-else class="file">
                <div class="title-container">
                    <span class="icon">📄</span>
                    <strong @click="handleOpenNote(item.content!)">{{ item.name }}</strong>
                    <button class="delete-btn" @click="deleteNote(item)">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.directory {
    margin: 8px 0;
}

.file {
    margin: 4px 0 4px 0px;
    padding: 4px 0px;
}

.children {
    margin-left: 20px;
}

.icon {
    font-size: 1.2em;
}

.title-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
}

.title-container > strong {
    margin: 0 8px;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--color);
}

.title-container > strong:hover {
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