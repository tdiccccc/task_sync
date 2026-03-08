import type { Project } from '~~/src/openapi/schemas/base/project/project'
import type {
  GetProjectListResponse,
  PaginationMeta,
} from '~~/src/openapi/schemas/api/project/list'
import type { GetProjectDetailResponse } from '~~/src/openapi/schemas/api/project/detail'
import type {
  CreateProjectRequest,
  CreateProjectResponse,
} from '~~/src/openapi/schemas/api/project/create'
import type {
  UpdateProjectRequest,
  UpdateProjectResponse,
} from '~~/src/openapi/schemas/api/project/update'
import type { DeleteProjectResponse } from '~~/src/openapi/schemas/api/project/delete'

export const useProject = () => {
  const { apiFetch } = useApi()

  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * プロジェクト一覧を取得
   */
  const fetchProjects = async (
    params: {
      page?: number
      per_page?: number
      is_active?: boolean
    } = {}
  ): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', String(params.page))
      if (params.per_page) query.set('per_page', String(params.per_page))
      if (params.is_active !== undefined) query.set('is_active', String(params.is_active))

      const queryString = query.toString()
      const path = `/api/projects${queryString ? `?${queryString}` : ''}`

      const response = await apiFetch<GetProjectListResponse>(path)
      projects.value = response.data
      meta.value = response.meta
    } catch {
      error.value = 'プロジェクト一覧の取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクト詳細を取得
   */
  const fetchProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<GetProjectDetailResponse>(`/api/projects/${id}`)
      project.value = response.data
    } catch {
      error.value = 'プロジェクトの取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを作成
   */
  const createProject = async (data: CreateProjectRequest): Promise<CreateProjectResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<CreateProjectResponse>('/api/projects', {
        method: 'POST',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを更新
   */
  const updateProject = async (
    id: number,
    data: UpdateProjectRequest
  ): Promise<UpdateProjectResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<UpdateProjectResponse>(`/api/projects/${id}`, {
        method: 'PUT',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを削除
   */
  const deleteProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await apiFetch<DeleteProjectResponse>(`/api/projects/${id}`, {
        method: 'DELETE',
      })
    } finally {
      loading.value = false
    }
  }

  return {
    projects: readonly(projects),
    project: readonly(project),
    meta: readonly(meta),
    loading: readonly(loading),
    error: readonly(error),
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  }
}
