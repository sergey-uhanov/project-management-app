import apiClient from './axios'
import type { Task, TaskFormData } from '@/types/task.types.ts'

const TASKS_ENDPOINT = '/tasks'

export const tasksApi = {
  async getAll(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>(TASKS_ENDPOINT)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getById(id: string): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>(`${TASKS_ENDPOINT}/?projectId=${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getByProjectId(projectId: number): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>(`${TASKS_ENDPOINT}?projectId=${projectId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async create(taskData: TaskFormData): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`${TASKS_ENDPOINT}`, taskData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async update(taskData: Partial<Task> & { id: string }): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`${TASKS_ENDPOINT}/${taskData.id}`, taskData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${TASKS_ENDPOINT}/${id}`)
    } catch (error) {
      throw error
    }
  },
}
