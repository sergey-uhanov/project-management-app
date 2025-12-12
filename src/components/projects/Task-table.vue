<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import type { TaskData } from '@/types/task.types.ts'
import { useDateFormat } from '@/composables/useDateFormat.ts'

interface Props {
  tasks: TaskData[]
}

interface Emits {
  (e: 'reorder-tasks', tasks: TaskData[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTasks = ref<TaskData[]>([...props.tasks])

watch(
  () => props.tasks,
  (val) => (localTasks.value = [...val]),
)

const minWidth = 60
const columnWidths = ref({
  id: 80,
  title: 200,
  performer: 150,
  status: 120,
  deadline: 150,
})

let currentColumn: keyof typeof columnWidths.value | null = null
let nextColumn: keyof typeof columnWidths.value | null = null
let startX = 0
let startWidth = 0
let nextColumnStartWidth = 0

function startResize(event: MouseEvent | TouchEvent, column: keyof typeof columnWidths.value) {
  event.stopPropagation()

  currentColumn = column
  startX = event instanceof MouseEvent ? event.clientX : event.touches[0]!.clientX
  startWidth = columnWidths.value[column]

  const columns = Object.keys(columnWidths.value) as Array<keyof typeof columnWidths.value>
  const currentIndex = columns.indexOf(column)
  if (currentIndex < columns.length - 1) {
    nextColumn = columns[currentIndex + 1]!
    nextColumnStartWidth = columnWidths.value[nextColumn!]
  } else {
    nextColumn = null
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', stopResize)
}

function onMouseMove(e: MouseEvent) {
  handleResize(e.clientX)
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 1) {
    e.preventDefault()
    handleResize(e.touches[0]!.clientX)
  }
}

function handleResize(clientX: number) {
  if (!currentColumn) return
  let delta = clientX - startX
  let newCurrent = startWidth + delta
  if (newCurrent < minWidth) newCurrent = minWidth
  const actualDelta = newCurrent - startWidth

  if (nextColumn) {
    let newNext = nextColumnStartWidth - actualDelta
    if (newNext < minWidth) {
      newNext = minWidth
      newCurrent = startWidth + (nextColumnStartWidth - minWidth)
    }
    columnWidths.value[nextColumn] = newNext
  }

  columnWidths.value[currentColumn] = newCurrent
}

function stopResize() {
  currentColumn = null
  nextColumn = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', stopResize)
}


onBeforeUnmount(() => stopResize())
</script>

<template>
  <div class="task-table">
    <table class="task-table__table">
      <thead class="task-table__head">
        <tr class="task-table__row task-table__row_head">
          <th
            v-for="(width, column) in columnWidths"
            :key="column"
            :style="{ width: width + 'px' }"
            class="task-table__cell task-table__cell_head"
          >
            {{ column.toUpperCase() }}
            <span
              class="task-table__resizer"
              @mousedown.stop="(e) => startResize(e, column)"
              @touchstart.prevent.stop="(e) => startResize(e, column)"
            ></span>
          </th>
        </tr>
      </thead>

      <draggable
        v-model="localTasks"
        tag="tbody"
        item-key="id"
        handle="tr"
        class="task-table__body"
      >
        <template #item="{ element: task }">
          <tr class="task-table__row">
            <td :style="{ width: columnWidths.id + 'px' }" class="task-table__cell">
              {{ task.id }}
            </td>
            <td :style="{ width: columnWidths.title + 'px' }" class="task-table__cell">
              {{ task.taskName }}
            </td>
            <td :style="{ width: columnWidths.performer + 'px' }" class="task-table__cell">
              {{ task.performer }}
            </td>
            <td :style="{ width: columnWidths.status + 'px' }" class="task-table__cell">
              {{ task.status }}
            </td>
            <td :style="{ width: columnWidths.deadline + 'px' }" class="task-table__cell">
              {{ useDateFormat(task.deadline) }}
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.task-table {
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 768px;
    overflow-x: auto;
  }

  &__head {
    background: $background;
  }

  &__row {
    &_head {
      font-weight: 600;
      color: $font-color;
      user-select: none;
    }

    transition: background 0.2s;
    cursor: grab;
    user-select: none;

    &.dragging {
      opacity: 0.5;
    }

    &:hover {
      background: $background;
    }
  }

  &__cell {
    padding: 12px;
    border-bottom: 1px solid $border-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    border-right: 1px solid $border-color;

    &_head {
      position: relative;
    }
  }

  &__resizer {
    position: absolute;
    right: 0;
    top: 0;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 50;

    &:hover {
      background: $background-secondary;
    }
  }
}
</style>
