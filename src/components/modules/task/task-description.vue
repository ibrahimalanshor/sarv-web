<script setup>
import BaseDescription from 'src/components/base/base-description.vue';
import TaskPriorityBadge from './task-priority-badge.vue';
import TaskEditStatus from './task-edit-status.vue';
import { computed, h } from 'vue';
import { RouterLink } from 'vue-router';
import { useString } from 'src/composes/resource.compose';
import { formatDate, toDate } from 'src/utils/date';
import TaskChildrenStatusBadge from './task-children-status-badge.vue';
import { hasChildren } from 'src/helpers/modules/task.helper';
import { conditionalElement } from 'src/utils/array.js';
import { nullable } from 'src/utils/type.js';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  attributes: {
    type: Object,
    default: () => ({}),
  },
  baseDescriptionProps: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['updated']);

const { getString } = useString();

const attributes = computed(() => {
  return [
    ...conditionalElement(nullable(props.attributes.name, true), {
      id: 'name',
      name: getString('task.attributes.name'),
    }),
    ...conditionalElement(nullable(props.attributes.category, true), {
      id: 'category',
      name: getString('task.attributes.category'),
      render: () =>
        props.task.category
          ? h(
              RouterLink,
              {
                class: 'hover:underline',
                to: {
                  name: 'task-category.detail',
                  params: { id: props.task.category.id },
                },
              },
              { default: () => props.task.category.name }
            )
          : h('span', {}, '-'),
    }),
    ...conditionalElement(nullable(props.attributes.created_at, true), {
      id: 'created_at',
      name: getString('task.attributes.created_at'),
      value: formatDate(props.task.created_at),
    }),
    ...conditionalElement(nullable(props.attributes.due_date, true), {
      id: 'due_date',
      name: getString('task.attributes.due_date'),
      value: props.task.due_date ? toDate(props.task.due_date) : '-',
    }),
    ...conditionalElement(nullable(props.attributes.status, true), {
      id: 'status',
      name: getString('task.attributes.status'),
    }),
    ...conditionalElement(
      hasChildren(props.task) &&
        nullable(props.attributes.children_count, true),
      {
        id: 'children_count',
        name: getString('task.attributes.sub_task_status'),
        render: () => h(TaskChildrenStatusBadge, { meta: props.task.meta }),
      }
    ),
    ...conditionalElement(nullable(props.attributes.priority, true), {
      id: 'priority',
      name: getString('task.attributes.priority'),
    }),
    ...conditionalElement(nullable(props.attributes.description, true), {
      id: 'description',
      name: getString('task.attributes.description'),
      value: props.task.description ?? '-',
      fullwidth: props.task.meta.children_count === 0,
    }),
  ];
});

function hanldeUpdatedStatus() {
  emit('updated');
}
</script>

<template>
  <base-description
    :attributes="attributes"
    :data="task"
    v-bind="props.baseDescriptionProps"
  >
    <template #[`priority`]>
      <task-priority-badge v-if="task.priority" :task="task" />
      <span v-else>-</span>
    </template>
    <template #[`status`]>
      <div class="flex">
        <task-edit-status :task="task" v-on:updated="hanldeUpdatedStatus" />
      </div>
    </template>
  </base-description>
</template>
