<script setup lang="ts">
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { PropType } from 'vue';

type LocaleVariant = 'ru' | 'en';

const DATE_FORMAT = 'YYYY-MM-DD';
const LOCALES = ['ru', 'en'];

const props = defineProps({
    locale: {
        default: 'ru',
        type: String as PropType<LocaleVariant>,
    },
});

const modelValue = defineModel<string>();

const date = ref(dayjs());
const selectedDate = ref(dayjs());
const weekdays = ref<string[]>([]);
const open = ref(false);
const refPicker = ref<HTMLDivElement>();

const state = ref({
    days: [] as string[],
    keys: [] as string[],
    weeks: 0,
});

function changeLocale(value: LocaleVariant) {
    if (LOCALES.indexOf(value) !== -1) {
        dayjs.locale(value);
        date.value = date.value.locale(value);
        selectedDate.value = selectedDate.value.locale(value);
        weekdays.value = getWeekdays(date.value);
    }
}

function getDay(week: number, day: number) {
    const index = (week - 1) * 7 + (day - 1);
    return state.value.days[index];
}

function getKey(week: number, day: number) {
    const index = (week - 1) * 7 + (day - 1);
    return state.value.keys[index];
}

function getWeekdays(date: Dayjs) {
    const localeData = date.localeData();
    const weekdays = localeData.weekdaysMin();
    return localeData.firstDayOfWeek()
        ? [...weekdays.slice(1), weekdays[0]]
        : weekdays;
}

function init(date: Dayjs) {
    const days: string[] = [];
    const keys: string[] = [];
    const endInterval = date.endOf('month').weekday(6);
    const startInterval = date.startOf('month').weekday(0);
    const weeks = Math.ceil(endInterval.diff(startInterval, 'd') / 7);

    let current = startInterval.clone();

    for (let i = 0; i < weeks; i++) {
        for (let j = 0; j < 7; j++) {
            keys.push(current.format(DATE_FORMAT));
            if (current.isSame(date, 'month')) {
                days.push(current.date().toString());
            } else {
                days.push('');
            }
            current = current.add(1, 'd');
        }
    }

    state.value.days = days;
    state.value.weeks = weeks;
    state.value.keys = keys;
}

function nextMonth() {
    date.value = date.value.add(1, 'month');
}

function prevMonth() {
    date.value = date.value.subtract(1, 'month');
}

function handleClick(e: MouseEvent) {
    const value = (e.target as HTMLTableCellElement).textContent;

    if (value) {
        modelValue.value = date.value.date(Number(value)).format(DATE_FORMAT);
        open.value = false;
    }
}

function isSame(day: string) {
    if (!date.value.isSame(selectedDate.value, 'year')) {
        return false;
    } else if (!date.value.isSame(selectedDate.value, 'month')) {
        return false;
    }
    return selectedDate.value.date() === Number(day);
}

function initModelValue(newValue?: string) {
    const initDate = dayjs(newValue);

    if (initDate.isValid()) {
        date.value = initDate;
        selectedDate.value = initDate.clone();
    } else {
        modelValue.value = date.value.format(DATE_FORMAT);
    }
}

function handleClickOut(e: MouseEvent) {
    if (!open.value || !refPicker.value) {
        return;
    }

    const datePicker: HTMLDivElement = refPicker.value;

    if (!datePicker.contains(e.target as HTMLElement)) {
        open.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOut);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOut);
});

watch(date, init);
watch(modelValue, initModelValue);
watch(() => props.locale, changeLocale);
watch(open, (value: boolean) => {
    if (value) {
        if (
            !date.value.isSame(selectedDate.value, 'month') ||
            !date.value.isSame(selectedDate.value, 'year')
        ) {
            date.value = selectedDate.value.clone();
        }
    }
});

init(date.value);
initModelValue(modelValue.value);
changeLocale(props.locale);
</script>

<template>
    <div ref="refPicker" class="datepicker" @click="open = !open">
        <input class="datepicker-input" :value="selectedDate.format('L')" />
        <span class="datepicker-icon">&#128197;</span>
        <div @click.stop="" class="datepicker-container" v-show="open">
            <div class="datepicker-header">
                <button @click="prevMonth">&#9668;</button>
                <span>{{ date.format('MMMM YYYY') }}</span>
                <button @click="nextMonth">&#9658;</button>
            </div>
            <div class="datepicker-body">
                <table>
                    <thead>
                        <tr>
                            <th v-for="day in weekdays">
                                {{ day }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="week in state.weeks"
                            :key="date.month() + '_' + week"
                        >
                            <td
                                v-for="day in 7"
                                @click="handleClick"
                                :class="{ active: isSame(getDay(week, day)) }"
                                :key="getKey(week, day)"
                            >
                                {{ getDay(week, day) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.datepicker {
    position: relative;
}

.datepicker-input {
    pointer-events: none;
    padding: 5px;
}

.datepicker-icon {
    position: absolute;
    right: 5px;
    top: 2px;
}

.datepicker-container {
    /* background: yellow; */
    border: 1px solid black;
    position: absolute;
    margin-top: 5px;
    user-select: none;
}

.datepicker-header {
    display: flex;
    justify-content: space-between;
    padding: 2px;
}

.datepicker-header button {
    border: none;
    background: transparent;
    cursor: pointer;
}

.datepicker-body table th {
    font-weight: normal;
    width: 25px;
    text-transform: capitalize;
}

.active {
    background: green;
    color: white;
}
</style>
