<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNoteStore } from '../stores';
import type { NoteListNode } from '../types';
import TreeView from './TreeView.vue';

const notes = ref<NoteListNode[]>([]);
const noteStore = useNoteStore();

watch(() => noteStore.needFresh, async (needFresh) => {
    if (needFresh) {
        notes.value = await window.api.getNotes();
        noteStore.setNeedFresh(false);
    }
}, { immediate: true });

</script>

<template>
    <div id="note-wrapper">
        <TreeView :items="notes" />
    </div>
</template>

<style scoped>
#note-wrapper {
    padding: 1rem 1rem;
    height: 100%;
    margin-top: 18vh;
    width: 20%;
}
</style>