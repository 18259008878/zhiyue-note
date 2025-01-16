<script setup lang="ts">
import HeadPart from './components/HeadPart.vue';
import AsideList from './components/AsideList.vue';
import MdEditor from './components/MdEditor.vue';
import { useNoteStore } from './stores';
import { onMounted } from 'vue';

onMounted(() => {
  const noteStore = useNoteStore();
  noteStore.init();
});
</script>

<template>
  <HeadPart />
  <AsideList />
  <MdEditor />
</template>

<style scoped></style>
