export interface ProjectData {
  id: string,
  projectName: string,
  quantityTasks: number,
  status: 'To do'| 'In progress'| 'Pause'|'Done'
  createdAt: string,
  description: string,
}


export type ProjectFormData =  Partial<Omit<ProjectData, 'id'>>
