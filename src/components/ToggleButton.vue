<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

// 注意这里不能提前解包出来
const toggleBtnRef = useTemplateRef<HTMLElement>("toggle-theme-btn");

function toggleTheme(event: Event): void {
    const toggleBtn: HTMLElement | null = event.target as HTMLElement;
    toggleBtn.classList.toggle('animate');
    setTimeout(() => {
        toggleBtn.classList.toggle('active');
        document.body.setAttribute("theme", toggleBtn.classList.contains('active') ? "dark" : "light");
    }, 150);
    setTimeout(() => {
        toggleBtn.classList.remove("animate");
    }, 300);
}

onMounted(() => {
    const isDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        toggleBtnRef.value?.click();
    }
})
</script>

<template>
    <span
        class="toggle"
        ref="toggle-theme-btn"
        @click="toggleTheme"
    ></span>
</template>

<style scoped>
.toggle {
    position: absolute;
    cursor: pointer;
    top: 25px;
    right: 25px;
    font-size: 150%;
}

.toggle:before {
    content: '☀️';
}

.toggle.active:before {
    content: '🌒';
}

.toggle.animate {
    animation: animate .3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes animate {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
</style>