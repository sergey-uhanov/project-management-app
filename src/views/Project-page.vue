<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TaskTable from '@/components/projects/Task-table.vue'
import KanbanBoard from '@/components/projects/Kanban-board.vue'
import TaskModal from '@/components/modals/Task-modal.vue'
import type { Task, TaskData } from '@/types/task.types.ts'
import { projectsApi } from '@/api/projects.ts'
import type { ProjectData } from '@/types/project.types.ts'
import Loader from '@/components/ common/Loader.vue'
import ToggleButton from '@/components/ common/Toggle-button.vue'
import RowIcon from '@/icons/Row-icon.vue'
import BaseButton from '@/components/ common/BaseButton.vue'
import CustomSelect from '@/components/ common/CustomSelect.vue'
import { useTasksStore } from '@/stores/tasks-store.ts'

const route = useRoute()
const projectId = ref<string>('')
const project = ref<ProjectData>()
const tasks = ref<Task[]>([])
const viewMode = ref<'table' | 'kanban'>('table')
const showAddModal = ref(false)
const isLoading = ref(true)
const tasksStore = useTasksStore()
const filters = ref({
  assignee: '',
  status: '',
})
const sortField = ref<'deadline' | 'status'>('deadline')
const sortDirection = ref<'asc' | 'desc'>('asc')

onMounted(async () => {
  projectId.value = route.params.id as string
  await loadProjectData()
  loadViewMode()
})

const loadProjectData = async () => {
  try {
    isLoading.value = true
    await tasksStore.fetchTasks(projectId.value)

    tasks.value = tasksStore.tasks
    if (tasks.value.length > 0 && tasks.value[0]) {
      project.value = await projectsApi.getById(projectId.value)
    }
  } catch (error) {
    console.error('Ошибка загрузки задач:', error)
  } finally {
    isLoading.value = false
  }
}

const setViewMode = (mode: 'table' | 'kanban') => {
  viewMode.value = mode
  localStorage.setItem('projectViewMode', mode)
}

const loadViewMode = () => {
  const savedMode = localStorage.getItem('projectViewMode') as 'table' | 'kanban'

  if (savedMode) {
    viewMode.value = savedMode
  }
}

watch(
  viewMode,
  () => {
    setViewMode(viewMode.value)
  },
  {
    immediate: false,
  },
)

const filteredAndSortedTasks = computed(() => {
  let filtered = [...tasks.value]

  if (filters.value.assignee) {
    filtered = filtered.filter((task) =>
      task.performer.toLowerCase().includes(filters.value.assignee.toLowerCase()),
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter((task) => task.status === filters.value.status)
  }

  filtered.sort((a, b) => {
    const aValue = a[sortField.value]
    const bValue = b[sortField.value]

    if (sortField.value === 'deadline') {
      const aDate = aValue ? new Date(aValue as string).getTime() : 0
      const bDate = bValue ? new Date(bValue as string).getTime() : 0
      return sortDirection.value === 'asc' ? aDate - bDate : bDate - aDate
    }

    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    const comparison = String(aValue).localeCompare(String(bValue))
    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return filtered
})

const toggleSort = (field: 'deadline' | 'status') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const handleTaskReorder = (reorderedTasks: TaskData[]) => {
  console.log(reorderedTasks)
  tasks.value = [...reorderedTasks]
}

const handleKanbanReorder = (updatedTasks: TaskData[]) => {
  tasks.value = updatedTasks
}
</script>

<template>
  <div class="project-page">
    <div class="project-page__container" v-if="!isLoading">
      <div class="page-header">
        <h1>Project: {{ project!.projectName }}</h1>
        <div class="header-controls">
          <ToggleButton
            v-model="viewMode"
            :options="[
              {
                value: 'table',
                label: 'Table',
              },
              {
                value: 'kanban',
                label: 'Kanban',
              },
            ]"
          />

          <button class="btn-add-task" @click="showAddModal = true">Add task</button>
        </div>
      </div>
      <div class="description" v-show="project?.description">
        <span>Description:</span>
        {{ project!.description }}
      </div>
      <!-- Фильтры и сортировка -->
      <div class="controls-panel" v-if="viewMode === 'table'">
        <div class="filters">
          <input
            v-model="filters.assignee"
            placeholder="Фильтр по исполнителю"
            class="filter-input"
          />
          <custom-select
            v-model="filters.status"
            placeholder="All"
            :options="[
              { label: 'All', value: '' },
              { label: 'To Do', value: 'To do' },
              { label: 'In progress', value: 'In progress' },
              { label: 'Done', value: 'Done' },
            ]"
          />
          {{ filters.assignee }}
        </div>
        <div class="sorting">
          <p>Sort:</p>
          <BaseButton
            :variant="sortField === 'deadline' ? 'primary' : 'secondary'"
            @click="toggleSort('deadline')"
          >
            By date
            <RowIcon
              v-show="sortField === 'deadline'"
              :is-direction-up="sortDirection === 'asc'"
              color="white"
            />
          </BaseButton>

          <BaseButton
            :variant="sortField === 'status' ? 'primary' : 'secondary'"
            @click="toggleSort('status')"
          >
            By status
            <RowIcon
              v-show="sortField === 'status'"
              :is-direction-up="sortDirection === 'asc'"
              color="white"
            />
          </BaseButton>
        </div>
      </div>

      <div class="content-area">
        <TaskTable
          v-if="viewMode === 'table'"
          :tasks="filteredAndSortedTasks"
          @reorder-tasks="handleTaskReorder"
        />
        <KanbanBoard v-else :tasks="tasks" @reorder-kanban="handleKanbanReorder" />
      </div>
    </div>
    <Loader v-else />

    <TaskModal v-if="showAddModal" @close="showAddModal = false" :project-id="projectId" />
  </div>
</template>

<style lang="scss">
.description {
  font-size: 18px;
  margin-bottom: 20px;
  color: $font-color;

  span {
    font-size: 20px;
    font-weight: bold;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
  }
}

.header-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.view-toggle {
  display: flex;
  border: 1px solid $border-color;
  border-radius: 6px;
  overflow: hidden;
}

.view-toggle button {
  padding: 8px 16px;
  border: none;
  background: $white;
  cursor: pointer;
  transition: all 0.3s;
}

.view-toggle button.active {
  background: $primary;
  color: $white;
}

.view-toggle button:hover:not(.active) {
  background: $background;
}

.btn-add-task {
  padding: 10px 20px;
  background: $primary;
  color: $white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-add-task:hover {
  background: $primary;
}

.controls-panel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px;
  background: $background;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    row-gap: 25px;
  }
}

.filters {
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid $border-color;
  border-radius: 4px;
  font-size: 14px;
}

.sorting {
  display: flex;
  gap: 8px;
}

.sorting button {
  padding: 6px 12px;
  border: 1px solid $border-color;
  background: $white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.sorting button.active {
  background: $primary;
  color: white;
  border-color: $border-color-secondary;
}

.content-area {
  margin-top: 24px;
}

.sorting {
  font-size: 20px;

  p {
    margin: 8px;
  }
}
</style>
