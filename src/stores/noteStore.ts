import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { FileNode, Note } from '../types'
import { marked } from 'marked'
import hljs from 'highlight.js'

// markdown 渲染器
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
    const validLanguage = hljs.getLanguage(lang!) ? lang : 'plaintext';
    return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(text, { language: validLanguage!, ignoreIllegals: true }).value}</code></pre>`;
};

export const useNoteStore = defineStore('noteStore', () => {
    const currentNote = ref<Note | null>(null);
    const noteList = ref<FileNode[]>([]);

    const title = computed<string | undefined>({
        get() {
            return currentNote.value?.nodeName;
        },
        set(value: string | undefined) {
            if (!value) return;
            value = value.trim();
            if (currentNote.value) {
                currentNote.value.nodeName = value;
            } else {
                const fileNode = {
                    type: 'file',
                    nodeName: value,
                    content: ''
                } satisfies Note;

                setCurrentNote(fileNode);
            }
        }
    });

    const content = computed<string | undefined>({
        get() {
            return currentNote.value?.content;
        },
        set(value: string | undefined) {
            if (!value) return;
            value = value.trim();
            if (currentNote.value) {
                currentNote.value.content = value;
            } else {
                const fileNode = {
                    type: 'file',
                    nodeName: '',
                    content: value
                } satisfies Note
                setCurrentNote(fileNode);
            }
        }
    });

    const markdown = computed<string | undefined>(() => {
        if (!content.value) return undefined;
        return marked(content.value, { renderer }) as string;
    });

    async function fetchNoteList() {
        noteList.value = await window.api.getNotes();
    }

    function setCurrentNote(note: Note | null = null) {
        currentNote.value = note;
    }

    function init() {
        setCurrentNote();
        fetchNoteList();
    }

    return {
        currentNote,
        noteList,
        title,
        content,
        markdown,
        fetchNoteList,
        setCurrentNote,
        init
    }
});