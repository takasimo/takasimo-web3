import { ref, readonly } from 'vue'

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
  position: string
}

export const useToast = () => {
  const toasts = ref<Toast[]>([])

  const showToast = (message: string, options: ToastOptions = {}) => {
    const {
      type = 'info',
      duration = 3000,
      position = 'top-right'
    } = options

    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
      duration,
      position
    }

    toasts.value.push(toast)

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(toast.id)
    }, duration)

    return toast.id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'success' })
  }

  const error = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'error' })
  }

  const info = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'info' })
  }

  const warning = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'warning' })
  }

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearAll
  }
}
