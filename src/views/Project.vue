<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { ProjectData } from '@/types/project.types.ts'
import CustomSelect from '@/components/ common/CustomSelect.vue'
import BaseButton from '@/components/ common/BaseButton.vue'
import AddNewProjectModal from '@/components/modals/Add-new-project-modal.vue'
import { useProjectsStore } from '@/stores/project-store.ts'
import { useDateFormat } from '@/composables/useDateFormat'
import RowIcon from '@/icons/Row-icon.vue'
import Loader from '@/components/ common/Loader.vue'

const projectsStore = useProjectsStore()
const router = useRouter()
const projects = ref<ProjectData[]>([])
const searchQuery = ref('')
const loading = ref<boolean>(false)
const filterBy = ref<'projectName' | 'status'>('projectName')
const sortColumn = ref<keyof ProjectData>('projectName')
const sortAsc = ref(true)
const newProjectNodal = useTemplateRef('modal')
const columnWidths = ref({
  id: 50,
  projectName: 100,
  status: 50,
  quantityTasks: 180,
  createdAt: 180,
})
const minWidth = 50

let currentColumn: keyof typeof columnWidths.value | null = null
let startX = 0
let startWidth = 0
let nextColumnStartWidth = 0
let nextColumn: keyof typeof columnWidths.value | null = null
let isResizing = false

async function loadProjects() {
  await projectsStore.fetchProjects()
  projects.value = projectsStore.projects
  loading.value = true
}

function sortBy(column: keyof ProjectData) {
  if (sortColumn.value === column) {
    sortAsc.value = !sortAsc.value
  } else {
    sortColumn.value = column
    sortAsc.value = true
  }
}

const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase()
  let result = projects.value.filter((item) =>
    String(item[filterBy.value]).toLowerCase().includes(query),
  )
  result.sort((a, b) => {
    const aValue = a[sortColumn.value]
    const bValue = b[sortColumn.value]
    if (aValue < bValue) return sortAsc.value ? -1 : 1
    if (aValue > bValue) return sortAsc.value ? 1 : -1
    return 0
  })
  return result
})

function goToProject(id: string) {
  router.push(`/projects/${id}`)
}

function startResize(
  event: MouseEvent | TouchEvent,
  column: Exclude<keyof ProjectData, 'description'>,
) {
  event.stopPropagation()
  currentColumn = column
  startX = event instanceof MouseEvent ? event.clientX : event.touches[0]!.clientX
  startWidth = columnWidths.value[column]

  const columns: Array<keyof typeof columnWidths.value> = [
    'id',
    'projectName',
    'status',
    'quantityTasks',
    'createdAt',
  ]
  const currentIndex = columns.indexOf(column)

  if (currentIndex < columns.length - 1) {
    nextColumn = columns[currentIndex + 1]!
    nextColumnStartWidth = columnWidths.value[nextColumn]
  } else {
    nextColumn = null
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', onTouchMove)
  document.addEventListener('touchend', stopResize)
}

function onMouseMove(event: MouseEvent) {
  handleResize(event.clientX)
}

function onTouchMove(event: TouchEvent) {
  if (event.touches.length === 1) {
    event.preventDefault()
    handleResize(event.touches[0]!.clientX)
  }
}

function handleResize(clientX: number) {
  if (!currentColumn) return

  const delta = clientX - startX

  if (Math.abs(delta) > 1) {
    isResizing = true
  }

  let newCurrentWidth = startWidth + delta

  if (newCurrentWidth < minWidth) {
    newCurrentWidth = minWidth
  }

  const actualDelta = newCurrentWidth - startWidth

  if (nextColumn) {
    let newNextWidth = nextColumnStartWidth - actualDelta

    if (newNextWidth < minWidth) {
      newNextWidth = minWidth
      newCurrentWidth = startWidth + (nextColumnStartWidth - minWidth)
    }

    columnWidths.value[nextColumn] = newNextWidth
  }

  columnWidths.value[currentColumn] = newCurrentWidth
}

function stopResize() {
  currentColumn = null
  nextColumn = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', stopResize)
  requestAnimationFrame(() => {
    isResizing = false
  })
}

onMounted(() => {
  loadProjects()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', stopResize)
})
</script>

<template>
  <div class="project-page">
    <div class="project-page__container">
      <div v-if="loading" class="project-page__table">
        <h1 class="project-page__title">Projects</h1>

        <BaseButton
          class="project-page__create-btn"
          variant="primary"
          @click="newProjectNodal?.open()"
        >
          New Project
        </BaseButton>

        <div class="project-page__filters">
          <input v-model="searchQuery" placeholder="Search..." class="project-page__search" />

          <CustomSelect
            v-model="filterBy"
            :options="[
              { label: 'Search by name', value: 'projectName' },
              { label: 'Search by status', value: 'status' },
            ]"
            placeholder="Select filter"
          />
        </div>

        <div class="project-page__table-wrapper">
          <table class="project-page__table-element">
            <thead>
              <tr class="project-page__table-header">
                <th :style="{ width: columnWidths.id + 'px' }" @click="!isResizing && sortBy('id')">
                  <span v-if="sortColumn === 'id'" class="project-page__sort-indicator">
                    <RowIcon :isDirectionUp="sortAsc" />
                  </span>
                  Id

                  <span
                    class="project-page__col-resizer"
                    @mousedown.stop="(e) => startResize(e, 'id')"
                    @touchstart.prevent.stop="(e) => startResize(e, 'id')"
                  ></span>
                </th>

                <th
                  :style="{ width: columnWidths.projectName + 'px' }"
                  @click="!isResizing && sortBy('projectName')"
                >
                  <span v-if="sortColumn === 'projectName'" class="project-page__sort-indicator">
                    <RowIcon :isDirectionUp="sortAsc" />
                  </span>
                  Name
                  <span
                    class="project-page__col-resizer"
                    @mousedown.stop="(e) => startResize(e, 'projectName')"
                    @touchstart.prevent.stop="(e) => startResize(e, 'projectName')"
                  ></span>
                </th>

                <th
                  :style="{ width: columnWidths.status + 'px' }"
                  @click="!isResizing && sortBy('status')"
                >
                  <span v-if="sortColumn === 'status'" class="project-page__sort-indicator">
                    <RowIcon :isDirectionUp="sortAsc" />
                  </span>
                  Status
                  <span
                    class="project-page__col-resizer"
                    @mousedown="(e) => startResize(e, 'status')"
                    @touchstart.prevent="(e) => startResize(e, 'status')"
                  ></span>
                </th>

                <th
                  :style="{ width: columnWidths.quantityTasks + 'px' }"
                  @click="!isResizing && sortBy('quantityTasks')"
                >
                  <span v-if="sortColumn === 'quantityTasks'" class="project-page__sort-indicator">
                    <RowIcon :isDirectionUp="sortAsc" />
                  </span>
                  Quantity tasks
                  <span
                    class="project-page__col-resizer"
                    @mousedown="(e) => startResize(e, 'quantityTasks')"
                    @touchstart.prevent="(e) => startResize(e, 'quantityTasks')"
                  ></span>
                </th>

                <th :style="{ width: columnWidths.createdAt + 'px' }">created</th>
              </tr>
            </thead>

            <tbody>
              <tr
                class="project-page__table-row"
                v-for="project in filteredProjects"
                :key="project.id"
                @click="goToProject(project.id)"
              >
                <td class="project-page__table-cell" :style="{ width: columnWidths.id + 'px' }">
                  {{ project.id }}
                </td>

                <td
                  class="project-page__table-cell"
                  :style="{ width: columnWidths.projectName + 'px' }"
                >
                  {{ project.projectName }}
                </td>

                <td class="project-page__table-cell" :style="{ width: columnWidths.status + 'px' }">
                  {{ project.status }}
                </td>

                <td
                  class="project-page__table-cell"
                  :style="{ width: columnWidths.quantityTasks + 'px' }"
                >
                  {{ project.quantityTasks }}
                </td>

                <td
                  class="project-page__table-cell"
                  :style="{ width: columnWidths.createdAt + 'px' }"
                >
                  {{ useDateFormat(project.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <AddNewProjectModal ref="modal" />
      </div>

      <loader v-else />
    </div>
  </div>
</template>

<style lang="scss">
.project-page {
  &__container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 10px;
  }

  &__title {
    margin-bottom: 16px;
  }

  &__create-btn {
    margin-bottom: 16px;
  }

  &__filters {
    display: flex;
    gap: 12px;
    margin: 12px 0;
    flex-wrap: wrap;
  }

  &__search {
    padding: 6px 10px;
    width: 260px;
    border: 1px solid $border-color;
    border-radius: 4px;
  }

  &__table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__table-element {
    width: 100%;
    border-collapse: collapse;
  }

  &__table-header {
    th {
      position: relative;
      background: $background;
      padding: 10px 10px 10px 20px;
      text-align: left;
      user-select: none;
      border-right: 1px solid $border-color;
      white-space: nowrap;

      &:last-child {
        border-right: none;
      }
    }
  }

  &__table-row {
    cursor: pointer;
  }

  &__table-cell {
    border-right: 1px solid $border-color;
    padding: 8px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:last-child {
      border-right: none;
    }
  }

  &__sort-indicator {
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__col-resizer {
    cursor: col-resize;
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background: transparent;
    touch-action: none;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  @media (hover: none) and (pointer: coarse) {
    &__col-resizer {
      width: 20px;
    }
  }
}
</style>
