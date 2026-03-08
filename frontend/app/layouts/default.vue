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
  { to: '/', label: 'ダッシュボード', icon: 'Home' },
  { to: '/projects', label: 'プロジェクト', icon: 'Folder' },
  { to: '/tasks', label: 'タスク', icon: 'CheckSquare' },
  { to: '/work-logs', label: '作業ログ', icon: 'Clock' },
  { to: '/reports/projects', label: 'レポート', icon: 'BarChart' },
  { to: '/settings', label: '設定', icon: 'Settings' },
]

/** admin専用リンク */
const adminLinks = [
  { to: '/users', label: 'ユーザー管理', icon: 'Users' },
  { to: '/roles', label: 'ロール管理', icon: 'Shield' },
]

/** ユーザーがadminロールを持つか */
const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- サイドバー -->
    <aside class="flex w-64 flex-col border-r border-gray-200 bg-white">
      <!-- アプリタイトル -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h1 class="text-lg font-bold text-gray-900">TaskFlow</h1>
      </div>

      <!-- ナビゲーション -->
      <nav class="flex-1 space-y-1 px-3 py-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-blue-50 text-blue-700"
        >
          {{ link.label }}
        </NuxtLink>

        <!-- admin専用セクション -->
        <template v-if="isAdmin">
          <div class="my-2 border-t border-gray-200" />
          <p class="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            管理者
          </p>
          <NuxtLink
            v-for="link in adminLinks"
            :key="link.to"
            :to="link.to"
            class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            active-class="bg-blue-50 text-blue-700"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>

      <!-- ユーザー情報 + ログアウト -->
      <div class="border-t border-gray-200 px-4 py-3">
        <div class="text-sm font-medium text-gray-900">{{ user?.name }}</div>
        <div class="text-xs text-gray-500">{{ user?.email }}</div>
        <button
          :disabled="loading"
          class="mt-2 w-full rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          @click="handleLogout"
        >
          ログアウト
        </button>
      </div>
    </aside>

    <!-- メインコンテンツ -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>
