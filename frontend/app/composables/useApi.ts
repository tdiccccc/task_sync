import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * API通信の共通基盤composable
 *
 * CSRF トークン管理と認証Cookie付きのfetch関数を提供する。
 * useAuth, useProject 等の各composableから内部的に使用される。
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  /**
   * CookieからCSRFトークンを取得
   */
  const getCsrfToken = (): string | undefined => {
    return useCookie('XSRF-TOKEN').value ?? undefined
  }

  /**
   * 認証Cookie付きAPIリクエスト
   */
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

  /**
   * CSRF Cookie の初期化
   */
  const initCsrf = async (): Promise<void> => {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: apiBase,
      credentials: 'include',
    })
  }

  return {
    apiFetch,
    initCsrf,
  }
}
