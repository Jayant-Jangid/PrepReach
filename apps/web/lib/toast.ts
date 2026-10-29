import toast, { ToastOptions } from 'react-hot-toast'

const defaultOptions: ToastOptions = {
  duration: 4000,
  style: {
    borderRadius: '8px',
    background: '#1E293B',
    color: '#FFFFFF',
    fontSize: '14px',
  },
}

export const notify = {
  success: (msg: string) =>
    toast.success(msg, {
      ...defaultOptions,
      iconTheme: { primary: '#524C73', secondary: '#FFFFFF' },
    }),
  error: (msg: string) =>
    toast.error(msg, {
      ...defaultOptions,
      iconTheme: { primary: '#B85324', secondary: '#FFFFFF' },
    }),
  loading: (msg: string) => toast.loading(msg, defaultOptions),
}
