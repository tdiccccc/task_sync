<script setup lang="ts">
interface NavLinkItem {
  to: string
  label: string
}

interface Props {
  navLinks: NavLinkItem[]
  adminLinks: NavLinkItem[]
  isAdmin: boolean
  userName?: string
  userEmail?: string
  logoutLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <aside class="flex w-64 flex-col border-r border-gray-200 bg-white">
    <!-- アプリタイトル -->
    <div class="border-b border-gray-200 px-6 py-4">
      <h1 class="text-lg font-bold text-gray-900">TaskFlow</h1>
    </div>

    <!-- ナビゲーション -->
    <nav class="flex-1 space-y-1 px-3 py-4">
      <NavLink v-for="link in navLinks" :key="link.to" :to="link.to" :label="link.label" />

      <!-- admin専用セクション -->
      <template v-if="isAdmin">
        <div class="my-2 border-t border-gray-200" />
        <p class="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">管理者</p>
        <NavLink v-for="link in adminLinks" :key="link.to" :to="link.to" :label="link.label" />
      </template>
    </nav>

    <!-- ユーザー情報 + ログアウト -->
    <div class="border-t border-gray-200 px-4 py-3">
      <div class="text-sm font-medium text-gray-900">{{ userName }}</div>
      <div class="text-xs text-gray-500">{{ userEmail }}</div>
      <Button
        variant="secondary"
        size="sm"
        :loading="logoutLoading"
        class="mt-2 w-full"
        @click="emit('logout')"
      >
        ログアウト
      </Button>
    </div>
  </aside>
</template>
