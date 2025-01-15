<script setup lang="ts">
import ToggleButton from './ToggleButton.vue';
</script>

<template>
    <header>
        <div class="hero">
            <img src="/favicon.ico" alt="图标">
            <p>知月笔记</p>
        </div>
        <ToggleButton />
    </header>
</template>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-height: 10dvh;
    max-width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1rem;
    background-color: transparent;
    backdrop-filter: blur(2px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
    box-sizing: border-box;
    z-index: 9999;
}

.hero {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.hero img {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
}

.hero p {
    font-size: 1.5rem;
    font-family: "华文行楷";
}

</style>
