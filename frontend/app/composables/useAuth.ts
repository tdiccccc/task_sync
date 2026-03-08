import type { User } from '~~/src/openapi/schemas/base/user'
import type { GetUserResponse } from '~~/src/openapi/schemas/api/user/get'

export const useAuth = () => {
  const { apiFetch, initCsrf } = useApi() // ← useApiから取得

  const user = useState<User | null>('auth-user', () => null)
  const isInitialized = useState<boolean>('auth-initialized', () => false)

  const isAuthenticated = computed(() => user.value !== null)

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await apiFetch<GetUserResponse>('/api/user')
      user.value = response.user
    } catch {
      user.value = null
    }
  }

  const init = async (): Promise<void> => {
    if (isInitialized.value) return

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
