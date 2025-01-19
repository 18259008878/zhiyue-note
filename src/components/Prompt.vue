<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    show: boolean
}>();

const emit = defineEmits<{
    (event: 'confirm', text: string): void;
    (event: 'close'): void;
}>();

const textValue = ref<string>('');

function confirm(text: string): void {
    emit('confirm', text.trim());
    textValue.value = '';
}

function close(): void {
    emit('close');
}

</script>
<template>
    <Transition>
        <div v-if="show" class="prompt">
            <div class="prompt-container">
                <div class="prompt-text">
                    <slot>弹窗标题</slot>
                </div>
                <input type="text" placeholder="Type your message here" v-model="textValue" />
                <div class="prompt-buttons">
                    <button @click="confirm(textValue)">确定</button>
                    <button @click="close">取消</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.prompt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 30%;
    border-radius: 10px;
    background-color: transparent;
    backdrop-filter: blur(2px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.prompt-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

/* .prompt-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
} */

.prompt-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: var(--color);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>