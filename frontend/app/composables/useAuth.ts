import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

interface User {
  id: number
  name: string
  email: string
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const user = useState<User | null>('auth-user', () => null)

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

  const fetchUser = async (): Promise<void> => {
    try {
      user.value = await apiFetch<User>('/api/user')
    } catch {
      user.value = null
    }
  }

  return {
    user: readonly(user),
    login,
    logout,
    fetchUser,
  }
}
