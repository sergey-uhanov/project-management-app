import { defineStore } from 'pinia'
import type { Task, TaskFormData } from '@/types/task.types.ts'
import { tasksApi } from '@/api/task.ts'
import { useToast } from '@/composables/useToast.ts'
const toast = useToast()
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
  }),

  actions: {
    async fetchTasks(id: string): Promise<void> {
      this.tasks = await tasksApi.getById(id)
    },

    async createTask(payload: TaskFormData) {
      this.loading = true
      try {
        const data = await tasksApi.create(payload)
        this.tasks.push(data)
        return data
      } finally {
        this.loading = false
      }
    },
    async updateTask(payload: Partial<Task> & { id: string }) {
      this.loading = true
      try {
        const data = await tasksApi.update(payload)
        const idx = this.tasks.findIndex((item) => item.id === data.id)
        this.tasks[idx] = { ...data }
        toast.info('Status change successful')
        return data
      }catch (e){
        toast.error('Error')
      } finally {
        this.loading = false
      }
    },
  },
})
