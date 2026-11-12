import { create } from 'zustand'
import { Course, ExamCategory } from '@/types'

interface CourseFilters {
  examCategory: ExamCategory | ''
  minPrice: number
  maxPrice: number
  search: string
  page: number
}

interface CourseStore {
  courses: Course[]
  selectedCourse: Course | null
  filters: CourseFilters
  total: number
  totalPages: number
  isLoading: boolean
  error: string | null

  setCourses: (courses: Course[], total: number, totalPages: number) => void
  setSelectedCourse: (course: Course | null) => void
  setFilter: <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: CourseFilters = {
  examCategory: '',
  minPrice: 0,
  maxPrice: 50000,
  search: '',
  page: 1,
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  selectedCourse: null,
  filters: { ...defaultFilters },
  total: 0,
  totalPages: 0,
  isLoading: false,
  error: null,

  setCourses: (courses, total, totalPages) =>
    set({ courses, total, totalPages }),

  setSelectedCourse: (course) => set({ selectedCourse: course }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key === 'page' ? (value as number) : 1 },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}))
