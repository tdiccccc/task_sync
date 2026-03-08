import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { User } from '~~/src/openapi/schemas/base/user'
import type { GetUserResponse } from '~~/src/openapi/schemas/api/user/get'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const user = useState<User | null>('auth-user', () => null)
  const isInitialized = useState<boolean>('auth-initialized', () => false)

  const isAuthenticated = computed(() => user.value !== null)

  const getCsrfToken = (): string | undefined => {
    return useCookie('XSRF-TOKEN').value ?? undefined
  }

  const apiFetch = async <T>(
    path: string,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> => {
    const csrfToken = getCsrfToken()

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
    }

    return await $fetch<T>(path, {
      baseURL: apiBase,
      credentials: 'include',
      headers,
      ...options,
    })
  }

  const initCsrf = async (): Promise<void> => {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: apiBase,
      credentials: 'include',
    })
  }

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await apiFetch<GetUserResponse>('/api/user')
      user.value = response.user
    } catch {
      user.value = null
    }
  }

  /**
   * アプリ起動時の初期化処理
   * CSRF Cookieの取得とユーザー情報の取得を行う
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return // 二重初期化を防止

    await initCsrf()
    await fetchUser()
    isInitialized.value = true
  }

  const login = async (email: string, password: string): Promise<void> => {
    await initCsrf()
    await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password },
    })
    await fetchUser()
  }

  const logout = async (): Promise<void> => {
    await apiFetch('/api/logout', {
      method: 'POST',
    })
    user.value = null
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isInitialized: readonly(isInitialized),
    init,
    login,
    logout,
    fetchUser,
  }
}
