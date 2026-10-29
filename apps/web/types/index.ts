// ─── Domain Types ────────────────────────────────────────────────────────────

export type ExamCategory = 'civil_service' | 'public_banking' | 'railway' | 'municipal'
export type UserRole = 'student' | 'instructor' | 'admin'
export type LectureType = 'video' | 'live' | 'material'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  targetExams: ExamCategory[]
  isVerified: boolean
  profileComplete: boolean
  createdAt: string
  updatedAt: string
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Lecture {
  _id: string
  title: string
  type: LectureType
  videoUrl: string
  materialUrl: string
  duration: number // minutes
  isPreview: boolean
  order: number
  scheduledAt?: string // ISO date string, for live type
}

export interface Module {
  _id: string
  course: string
  title: string
  description?: string
  order: number
  lectures: Lecture[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  _id: string
  title: string
  slug: string
  description: string
  examCategory: ExamCategory
  instructor: User | string
  price: number
  thumbnail: string
  language: string
  totalDuration: number // minutes
  totalLectures: number
  isPublished: boolean
  enrolledCount: number
  tags: string[]
  modules?: Module[]
  createdAt: string
  updatedAt: string
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export interface LectureProgress {
  moduleId: string
  lectureId: string
  watchedPercent: number
  completedAt?: string
}

export interface Enrollment {
  _id: string
  student: User | string
  course: Course | string
  enrolledAt: string
  paymentStatus: PaymentStatus
  paymentId: string
  progress: LectureProgress[]
  overallProgress: number // 0–100
  createdAt: string
  updatedAt: string
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T = unknown> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}
