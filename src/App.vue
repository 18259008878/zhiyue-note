<script setup lang="ts">
import HeadPart from './components/HeadPart.vue';
import AsideList from './components/AsideList.vue';
import MdEditor from './components/MdEditor.vue';
import { useNoteStore } from './stores';
import { watch } from 'vue';

const noteStore = useNoteStore();
noteStore.init();
watch(() => noteStore.noteList, (newNoteList) => {
  console.log({newNoteList});
});
watch(() => noteStore.currentNote, (newNote) => {
  console.log({newNote});
});
</script>

<template>
  <HeadPart />
  <AsideList />
  <MdEditor />
</template>

<style scoped></style>
