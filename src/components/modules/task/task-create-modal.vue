<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseSelect from 'src/components/base/base-select.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskCategorySelectSearch from 'src/components/modules/task-category/task-category-select-search.vue';
import { computed, reactive, ref } from 'vue';
import { getAvaiablePriorities } from 'src/helpers/modules/task.helper';
import { capitalize } from 'src/utils/string';
import { endOf } from 'src/utils/date';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  values: {
    type: Object,
    default: () => ({}),
  },
  inputs: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'created']);

const { getString } = useString();
const {
  request: storeTask,
  loading: storeTaskLoading,
  validation: storeTaskValidation,
  error: storeTaskError,
  resetError: resetStoreTaskError,
  resetValidation: resetStoreTaskValidation,
} = useRequest({
  method: 'post',
  url: '/api/tasks',
});

const form = reactive({
  name: null,
  task_category_id: null,
  due_date: null,
  description: null,
  priority: null,
});
const selectedCategory = ref(null);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleSubmit() {
  const [success] = await storeTask({
    ...form,
    ...props.values,
    ...(selectedCategory.value
      ? {
          task_category_id: selectedCategory.value.id,
        }
      : {}),
    ...(form.due_date
      ? {
          due_date: endOf(form.due_date),
        }
      : {}),
  });

  if (success) {
    visible.value = false;

    emit('created');
  }
}
function handleCloseAlert() {
  resetStoreTaskError();
}
function handleResetForm() {
  form.name = null;
  form.task_category_id = null;
  form.due_date = null;
  form.description = null;
  form.priority = null;

  selectedCategory.value = null;

  resetStoreTaskValidation();
  resetStoreTaskError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task.actions.create')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleResetForm"
    >
      <div class="space-y-4">
        <base-alert
          :text="storeTaskError"
          type="error"
          :force-visible="!!storeTaskError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task.label.name"
          placeholder="task.placeholder.name"
          :color="storeTaskValidation.name ? 'red' : 'gray'"
          :message="storeTaskValidation.name"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          collapsable
          :collapsed="false"
          v-model="form.name"
        />

        <base-input
          v-if="inputs.category ?? true"
          label="task.label.category"
          placeholder="task.placeholder.category"
          :message="storeTaskValidation.task_category_id"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          collapsable
          collapsed
        >
          <task-category-select-search
            :select-search-props="{
              fullwidth: true,
            }"
            :input-props="{
              withLabel: false,
              label: 'task.label.category',
              labelFromResource: true,
              color: storeTaskValidation.task_category_id ? 'red' : 'gray',
            }"
            v-model="selectedCategory"
          />
        </base-input>

        <base-select
          label="task.label.priority"
          placeholder="task.placeholder.priority"
          :color="storeTaskValidation.priority ? 'red' : 'gray'"
          :message="storeTaskValidation.priority"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          collapsable
          collapsed
          :options="
            getAvaiablePriorities().map((item) => ({
              id: item.value,
              name: capitalize(item.name),
            }))
          "
          v-model="form.priority"
        />

        <base-input
          type="date"
          label="task.label.due_date"
          placeholder="task.placeholder.due_date"
          :color="storeTaskValidation.due_date ? 'red' : 'gray'"
          :message="storeTaskValidation.due_date"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          collapsable
          collapsed
          v-model="form.due_date"
        />

        <base-input
          type="text"
          label="task.label.description"
          placeholder="task.placeholder.description"
          :color="storeTaskValidation.description ? 'red' : 'gray'"
          :message="storeTaskValidation.description"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          textarea
          collapsable
          collapsed
          v-model="form.description"
        />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="storeTaskLoading"
            text-from-resource
          />
          <base-button
            text="actions.cancel"
            text-from-resource
            v-on:click="close"
          />
        </div>
      </template>
    </base-modal>
  </form>
</template>
