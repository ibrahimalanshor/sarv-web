<script setup>
import {
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
} from '@heroicons/vue/24/outline';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSelect from 'src/components/base/base-select.vue';
import { useString } from 'src/composes/resource.compose';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  columns: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const { getString } = useString();

const directionOptions = [
  {
    id: 'asc',
    name: getString('options.sort-direction.asc'),
  },
  {
    id: 'desc',
    name: getString('options.sort-direction.desc'),
  },
];

const selectedDirection = computed({
  get() {
    return props.modelValue && props.modelValue.charAt(0) !== '-'
      ? 'asc'
      : 'desc';
  },
  set(value) {
    emit(
      'update:modelValue',
      value === 'asc' ? selectedColumn.value : `-${selectedColumn.value}`
    );
  },
});
const selectedColumn = computed({
  get() {
    if (!props.modelValue) {
      return props.modelValue;
    }

    return props.modelValue.charAt(0) !== '-'
      ? props.modelValue
      : props.modelValue.slice(1);
  },
  set(value) {
    emit(
      'update:modelValue',
      selectedDirection.value === 'asc' ? value : `-${value}`
    );
  },
});

function handleChange() {
  emit('change');
}
</script>

<template>
  <base-dropdown custom-width="w-44" position="right">
    <template #toggle="{ toggle }">
      <base-button
        :classes="{ base: 'h-full flex items-center gap-x-2' }"
        v-on:click="toggle"
      >
        <span v-if="selectedColumn">{{
          props.columns.find((item) => item.id === selectedColumn).name
        }}</span>
        <arrow-small-down-icon
          v-if="selectedDirection === 'asc'"
          class="w-4 h-4"
        />
        <arrow-small-up-icon v-else class="w-4 h-4" />
      </base-button>
    </template>

    <template #content="{ classes }">
      <div>
        <div :class="[classes.item, 'hover:bg-transparent']">
          <base-select
            label="label.sort.column"
            placeholder="label.sort.column"
            :with-label="true"
            :with-placeholder="false"
            label-from-resource
            fullwidth
            placeholder-from-resource
            :options="props.columns"
            v-model="selectedColumn"
            v-on:change="handleChange"
          />
        </div>
        <div :class="[classes.item, 'hover:bg-transparent']">
          <base-select
            label="label.sort.direction"
            placeholder="label.sort.direction"
            :with-label="true"
            :with-placeholder="false"
            label-from-resource
            fullwidth
            placeholder-from-resource
            :options="directionOptions"
            v-model="selectedDirection"
            v-on:change="handleChange"
          />
        </div>
      </div>
    </template>
  </base-dropdown>
</template>
