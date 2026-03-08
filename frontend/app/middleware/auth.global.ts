export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isInitialized, init } = useAuth()

  // 初期化がまだなら実行（アプリ起動時に1回だけ）
  if (!isInitialized.value) {
    await init()
  }

  // 公開ページ（認証不要）のリスト
  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(to.path)

  // 未認証 + 保護ページ → ログインへリダイレクト
  if (!isAuthenticated.value && !isPublicPage) {
    return navigateTo('/login')
  }

  // 認証済み + ログインページ → トップへリダイレクト
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
