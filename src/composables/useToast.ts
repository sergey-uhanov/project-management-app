import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timeout?: number
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const push = (type: Toast['type'], message: string, timeout = 3000) => {
    const id = counter++
    toasts.value.push({ id, type, message, timeout })
    setTimeout(() => remove(id), timeout)
  }

  return {
    toasts,
    success: (msg: string, timeout?: number) => push('success', msg, timeout),
    error: (msg: string, timeout?: number) => push('error', msg, timeout),
    info: (msg: string, timeout?: number) => push('info', msg, timeout),
    warning: (msg: string, timeout?: number) => push('warning', msg, timeout),
    remove,
  }
}
