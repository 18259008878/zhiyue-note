<script setup lang="ts">
import { useNoteStore } from '../stores';
import path from 'path-browserify-win32';
import 'highlight.js/styles/github.css';

const noteStore = useNoteStore();

function saveNote(): void {
    console.log(noteStore.currentNote);
    if (!noteStore.currentNote) return; // 如果没有当前笔记，则不执行保存操作
    if (noteStore.title?.trim() === '') {
        alert('请输入标题');
        return;
    }
    if (noteStore.currentNote.fullPath) { // 如果当前笔记有路径，则执行重命名操作
        const oldNotePath = noteStore.currentNote.fullPath;
        const isWindows = window.navigator.userAgent.indexOf('Windows') !== -1;
        let fullPath: string;
        if (isWindows) {
            fullPath = path.win32.join(path.win32.dirname(oldNotePath), `${noteStore.title}.md`);
        } else {
            fullPath = path.join(path.dirname(oldNotePath), `${noteStore.title}.md`);
        }
        noteStore.currentNote.fullPath = fullPath;
        window.api.renameNote(oldNotePath, noteStore.currentNote.fullPath);
    }
    window.api.writeNote(JSON.stringify(noteStore.currentNote));
    noteStore.fetchNoteList();
}

function createNote(): void {
    noteStore.setCurrentNote();
}

//     markdown.value = marked(newContent, { renderer }) as string;
// });
</script>

<template>
    <div id="editor—wrapper">
        <div id="toolbar-container">
            <button @click="saveNote" class="toolbar-button">
                <i class="fa-regular fa-floppy-disk"></i>
            </button>
            <button @click="createNote" class="toolbar-button">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <div id="editor-container">
            <input type="text" ref="title-input" placeholder="标题" v-model="noteStore.title" />
            <div id="edit-field">
                <textarea id="editor" placeholder="在这里记录你的每一瞬" v-model="noteStore.content"></textarea>
                <div id="preview-container" v-html="noteStore.markdown"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/** for editor wrapper */
#editor—wrapper {
    /* margin: 0 auto; */
    width: 78%;
    padding: 0 20px;
    position: relative;
    height: 100%;
    margin-top: 18vh;
}

/** for toolbar */

#toolbar-container {
    padding: 10px;
}

.toolbar-button {
    width: 40px;
    height: 40px;
    margin: 0;
    border: none;
    /* border-radius: 5px; */
    background-color: transparent;
    color: var(--color);
    cursor: pointer;
}

.toolbar-button:hover {
    color: var(--selected-color);
}

/** for editor */
#editor-container {
    /* width: 100%; */
    border-top: 1px solid #aaa;
    height: 80%;
    padding: 1em 3em;
    padding-left: 1em;
}

/** for md header */
#editor-container>input {
    width: 100%;
    border: none;
    margin: 1rem auto;
    background-color: transparent;
    color: var(--color);
    font-size: 30px;
    line-height: 1.5;
}

#editor-container>input:focus {
    outline: none;
}

/** for md edit */
#edit-field {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    border-top: 1px solid #aaa;
    height: 100%;
    margin: 0 auto;
}

#editor {
    border: 0;
    padding-top: 1em;
    background-color: transparent;
    color: var(--color);
    resize: none;
    width: 50%;
    height: 97%;
    font-size: 16px;
    font-family: Arial, sans-serif;
}

#editor:focus {
    outline: none;
}

#preview-container {
    width: 50%;
    height: 97%;
    padding: 1em 1em;
    overflow-y: auto;
}

:deep(.hljs) {
    font-family: 'consolas', '微软雅黑', 'sans-serif';
    border-radius: 5px;
    background-color: var(--pre-bg) !important;
    color: var(--color) !important;
}
</style>