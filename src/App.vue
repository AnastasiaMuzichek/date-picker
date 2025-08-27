<script setup lang="ts">
import DatePicker from './components/DatePicker.vue';
import { computed, ref } from 'vue';

const date = ref('');
const locale = ref<'ru' | 'en'>('ru');

const titleValue = computed(
    () => (locale.value == 'ru' ? 'Ваша дата: ' : 'Your date: ') + date.value
);
const titleButton = computed(() =>
    locale.value == 'ru' ? 'Русский' : 'English'
);
</script>

<template>
    <div class="header">DATE PICKER</div>
    <div>{{ titleValue }}</div>
    <button @click="locale = locale == 'ru' ? 'en' : 'ru'" class="buttonClick">
        {{ titleButton }}
    </button>
    <DatePicker :locale="locale" v-model="date"></DatePicker>
</template>

<style scoped>
.header {
    font-size: 30px;
    font-weight: 400;
    color: #1f1e1e;
    text-shadow: 4px 4px 0px #ebe6e6;
    margin-bottom: 10px;
}

.buttonClick {
    margin-bottom: 5px;
}
</style>
