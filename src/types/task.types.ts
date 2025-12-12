export interface Task {
  id: string
  taskName: string
  performer: string
  status: 'To do' | 'In progress' | 'Done'
  deadline: string
  projectId: string
}

export interface TaskData extends Task {
  assignee?: string
  dueDate?: string
}

export type TaskFormData = Partial<Omit<Task, 'id'>>
