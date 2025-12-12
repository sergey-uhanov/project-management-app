import { computed } from 'vue'

export function useDateFormat(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options,
  })

  return computed(() => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return formatter.format(d)
  })
}
