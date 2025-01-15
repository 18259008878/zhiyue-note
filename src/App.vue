<script setup lang="ts">
import HeadPart from './components/HeadPart.vue';
import AsideList from './components/AsideList.vue';
import MdEditor from './components/MdEditor.vue';
import { useCurrentNoteStore, useFreshNoteStore } from './stores';
import { onMounted } from 'vue';

onMounted(() => {
  const currentNoteStore = useCurrentNoteStore();
  const freshNoteStore = useFreshNoteStore();
  currentNoteStore.clearCurrentNote();
  freshNoteStore.setNeedFresh();
});
</script>

<template>
  <HeadPart />
  <AsideList />
  <MdEditor />
</template>

<style scoped></style>
