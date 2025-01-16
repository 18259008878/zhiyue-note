<script setup lang="ts">
import { useNoteStore } from '../stores';
import TreeView from './TreeView.vue';

const noteStore = useNoteStore();
</script>

<template>
    <div id="note-wrapper">
        <TreeView :items="noteStore.noteList" />
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