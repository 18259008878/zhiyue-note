<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Note } from '../types/note';
import { useCurrentNoteStore, useFreshNoteStore } from '../stores';
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';

const currentNoteStore = useCurrentNoteStore();
const freshNoteStore = useFreshNoteStore();
const content = computed({
    get() {
        return currentNoteStore.currentNote?.content || '';
    },
    set(newContent) {
        let currentNote = currentNoteStore.currentNote;
        if (currentNote) {
            currentNote.content = newContent;
            currentNoteStore.setCurrentNote(currentNote);
        } else {
            let newNote: Partial<Note> = {
                title: "",
                content: newContent
            };
            currentNoteStore.setCurrentNote(newNote as Note);
        }
    }
});
const title = computed({
    get() {
        return currentNoteStore.currentNote?.title || '';
    },
    set(newTitle) {
        let currentNote = currentNoteStore.currentNote;
        if (currentNote) {
            currentNote.title = newTitle;
            currentNoteStore.setCurrentNote(currentNote);
        } else {
            let newNote: Partial<Note> = {
                title: newTitle,
                content: ""
            };
            currentNoteStore.setCurrentNote(newNote as Note);
        }
    }
});
const markdown = ref<string>('');

// markdown 渲染器
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
    const validLanguage = hljs.getLanguage(lang!) ? lang : 'plaintext';
    return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(text, { language: validLanguage!, ignoreIllegals: true }).value}</code></pre>`;
};

function saveNote(): void {
    if (title.value && content.value) {
        window.api.writeNote(title.value.trim(), content.value.trim());
        freshNoteStore.setNeedFresh();
    } else {
        alert('标题和内容不能为空');
    }
}

function createNote(): void {
    currentNoteStore.clearCurrentNote();
}

watch(content, (newContent) => {
    markdown.value = marked(newContent, { renderer }) as string;
});
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
            <input type="text" ref="title-input" placeholder="标题" v-model="title" />
            <div id="edit-field">
                <textarea id="editor" placeholder="在这里记录你的每一瞬" v-model="content"></textarea>
                <div id="preview-container" v-html="markdown"></div>
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
    border-radius: 5px;
    background-color: var(--pre-bg) !important;
    color: var(--color) !important;
}
</style>