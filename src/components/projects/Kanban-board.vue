<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import type { TaskData } from '@/types/task.types.ts'
import { useTasksStore } from '@/stores/tasks-store.ts'


interface Props {
  tasks: TaskData[]
}
interface Emits {
  (e: 'reorder-tasks', tasks: TaskData[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const tasksStore = useTasksStore()
const statusList = ['To do', 'In progress', 'Done'] as const

const columns = ref<Record<string, TaskData[]>>({
  'To do': [],
  'In progress': [],
  'Done': [],
})


const initColumns = () => {
  columns.value = {
    'To do': [],
    'In progress': [],
    'Done': [],
  }
  props.tasks.forEach((t) => {
    const status = t.status ?? 'To do'
    if (!columns.value[status]) columns.value[status] = []
    columns.value[status].push({ ...t })
  })
}

initColumns()

watch(
  () => props.tasks,
  () => initColumns(),
  { deep: true }
)

const onDragEnd = async (evt: any) => {

    const itemEl = evt.item as HTMLElement
    const movedId = itemEl?.dataset?.id
    const fromCol = evt.from?.closest('.kanban__column')?.querySelector('.kanban__title')?.textContent?.trim()
    const toCol = evt.to?.closest('.kanban__column')?.querySelector('.kanban__title')?.textContent?.trim()

    if (!movedId || !fromCol || !toCol) {
      const flat = statusList.flatMap((s) => columns.value[s] ?? [])
      emit('reorder-tasks', flat)
      return
    }


    if (fromCol !== toCol) {
      await tasksStore.updateTask({ id: movedId, status: toCol })
    }
    const flat = statusList.flatMap((s) => columns.value[s] ?? [])
    emit('reorder-tasks', flat)


}
</script>

<template>
  <div class="kanban">
    <div class="kanban__column" v-for="status in statusList" :key="status">
      <h3 class="kanban__title">{{ status }}</h3>

      <draggable
        class="kanban__list"
        :list="columns[status]"
        group="tasks"
        item-key="id"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <div class="kanban__card" :data-id="String(element.id)">
            <div class="kanban__card-name">{{ element.taskName }}</div>
            <div class="kanban__card-info">
              <span class="kanban__card-performer">{{ element.performer }}</span>
              <span class="kanban__card-deadline">{{ new Date(element.deadline).toLocaleDateString() }}</span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kanban {
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
   flex-direction: column;
  }

  &__column {
    background: $background;
    padding: 12px;
    border-radius: 8px;
    width: 300px;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      width: calc(100% - 20px);
    }
  }

  &__title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 50px;
  }

  &__card {
    background: $white;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 1px 4px $background-secondary;
    cursor: grab;

    &-name {
      font-weight: 500;
      margin-bottom: 6px;
    }

    &-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: $font-color;
    }
  }
}
</style>
