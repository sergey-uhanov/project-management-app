import apiClient from './axios'
import type { ProjectData, ProjectFormData } from '@/types/project.types.ts'

const PROJECTS_ENDPOINT = '/projects'

export const projectsApi = {
  async getAll(): Promise<ProjectData[]> {
    try {
      const response = await apiClient.get<ProjectData[]>(PROJECTS_ENDPOINT)
      return response.data
    } catch (error) {
      console.error('Ошибка при получении проектов:', error)
      throw error
    }
  },
  async getById(id: string): Promise<ProjectData> {
    try {
      const response = await apiClient.get<ProjectData>(`${PROJECTS_ENDPOINT}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error)
      throw error
    }
  },

  async create(projectData: ProjectFormData): Promise<ProjectData> {
    try {
      const newProject = {
        ...projectData,
        createdAt: new Date().toISOString(),
        tasksCount: 0,
        status: projectData.status || 'active',
      }

      const response = await apiClient.post<ProjectData>(PROJECTS_ENDPOINT, newProject)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async update(id: number, projectData: ProjectFormData): Promise<ProjectData> {
    try {
      const response = await apiClient.patch<ProjectData>(`${PROJECTS_ENDPOINT}/${id}`, projectData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async replace(id: number, projectData: ProjectFormData): Promise<ProjectData> {
    try {
      const response = await apiClient.put<ProjectData>(`${PROJECTS_ENDPOINT}/${id}`, projectData)
      return response.data
    } catch (error) {
      console.error(`Ошибка при замене проекта с ID ${id}:`, error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${PROJECTS_ENDPOINT}/${id}`)
    } catch (error) {
      console.error(`Ошибка при удалении проекта с ID ${id}:`, error)
      throw error
    }
  },
}
