<script setup lang="ts">
const { user, logout } = useAuth()

const loading = ref(false)

const handleLogout = async () => {
  loading.value = true
  try {
    await logout()
    await navigateTo('/login')
  } finally {
    loading.value = false
  }
}

/** ナビゲーションリンク定義 */
const navLinks = [
  { to: '/', label: 'ダッシュボード' },
  { to: '/projects', label: 'プロジェクト' },
  { to: '/tasks', label: 'タスク' },
  { to: '/work-logs', label: '作業ログ' },
  { to: '/reports/projects', label: 'レポート' },
  { to: '/settings', label: '設定' },
]

/** admin専用リンク */
const adminLinks = [
  { to: '/users', label: 'ユーザー管理' },
  { to: '/roles', label: 'ロール管理' },
]

/** ユーザーがadminロールを持つか */
const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <AppSidebar
      :nav-links="navLinks"
      :admin-links="adminLinks"
      :is-admin="isAdmin"
      :user-name="user?.name"
      :user-email="user?.email"
      :logout-loading="loading"
      @logout="handleLogout"
    />

    <!-- メインコンテンツ -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>
