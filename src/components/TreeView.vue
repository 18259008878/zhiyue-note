<script setup lang="ts">
import path from 'path-browserify-win32';
import { useNoteStore } from '../stores';
import type { FileNode, Note } from '../types';

defineProps<{
    items: FileNode[]
}>();

const noteStore = useNoteStore();

function handleOpenNote(note: FileNode): void {
    noteStore.setCurrentNote(note);
}

function handleCreateNote(note: FileNode): void {
    const isWindows = window.navigator.userAgent.indexOf('Windows') !== -1;
    let fullPath: string;
    if (isWindows) {
        fullPath = path.win32.join(note.fullPath, 'untitled.md');
    } else {
        fullPath = path.join(note.fullPath, 'untitled.md');
    }
    const newNote = {
        type: 'file',
        nodeName: '',
        fullPath: fullPath,
        content: '',
    } satisfies Note;
    noteStore.setCurrentNote(newNote);
}

function recycleNote(note: FileNode): void {
    window.api.recycleNote(JSON.stringify(note));
    noteStore.fetchNoteList();
}

function deleteNote(note: FileNode): void {
    if (note.type === 'directory') return;
    if (note.relativePath === '回收站' && confirm('确定要彻底删除吗？')) {
        window.api.deleteNote(JSON.stringify(note));
        if (noteStore.currentNote?.nodeName === note.nodeName) {
            noteStore.setCurrentNote();
        }
        noteStore.fetchNoteList();
        return;
    }
    window.api.moveToRecycle(JSON.stringify(note));
    noteStore.fetchNoteList();
}

</script>

<template>
    <div>
        <div v-for="item in items">
            <div v-if="item.type === 'directory'" class="directory">
                <div class="title-container">
                    <span class="icon">📁</span>
                    <strong>{{ item.nodeName }}</strong>
                    <button v-if="item.nodeName !== '回收站'" id="create-directory-btn" class="operation-btn">
                        <i class="fa-solid fa-folder-plus"></i>
                    </button>
                    <button v-if="item.nodeName !== '回收站'" id="create-file-btn" class="operation-btn" @click="handleCreateNote(item)">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="children">
                    <TreeView :items="item.children!" />
                </div>
            </div>
            <div v-else class="file">
                <div class="title-container">
                    <span class="icon">📄</span>
                    <strong
                        @click="handleOpenNote(item)"
                        :class = "{ 'active': noteStore.currentNote?.nodeName === item.nodeName }"
                    >
                        {{ item.nodeName }}
                    </strong>
                    <button v-if="item.relativePath === '回收站'" class="operation-btn" id="recycle-btn" @click="recycleNote(item)">
                        <i class="fa-solid fa-trash-arrow-up"></i>
                    </button>
                    <button class="operation-btn" id="delete-btn" @click="deleteNote(item)">
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

.title-container > strong.active {
    background-color: var(--selected-color);
}

.operation-btn {
    width: 25px;
    height: 25px;
    border: none;
    margin: 2px 2px;
    border-radius: 50%;
    color: var(--color);
    cursor: pointer;
}

#create-directory-btn {
    background-color: #a19b79;
}

#create-directory-btn:hover {
    background-color: #827c5a;
}

#create-file-btn {
    background-color: #82af9c;
}

#create-file-btn:hover {
    background-color: #3e705a;
}

#recycle-btn {
    background-color: #82af9c;
}

#recycle-btn:hover {
    background-color: #3e705a;
}

#delete-btn {
    background-color: #be656d;
}

#delete-btn:hover {
    background-color: #d42332;
}
</style>