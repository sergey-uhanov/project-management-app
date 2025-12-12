import { defineStore } from 'pinia'

import type { ProjectData, ProjectFormData } from '@/types/project.types.ts'
import { projectsApi } from '@/api/projects.ts'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as ProjectData[],
    loading: false,
  }),

  actions: {
    async fetchProjects() {
      this.projects = await projectsApi.getAll()
    },

    async createProject(payload: ProjectFormData) {
      this.loading = true
      try {
        const data = await projectsApi.create(payload)
        this.projects.push(data)
        return data
      } finally {
        this.loading = false
      }
    },
  },
})
