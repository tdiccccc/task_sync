<script setup lang="ts">
const { user } = useAuth()

/** ナビゲーションカード定義 */
const menuCards = [
  {
    to: '/projects',
    title: 'プロジェクト',
    description: 'プロジェクトの作成・管理、進捗の確認ができます。',
  },
  {
    to: '/tasks',
    title: 'タスク',
    description: 'タスクの作成・管理、担当者のアサインができます。',
  },
  {
    to: '/work-logs',
    title: '作業ログ',
    description: '作業時間の記録・確認ができます。',
  },
  {
    to: '/reports/projects',
    title: 'レポート',
    description: 'プロジェクト・ユーザー・カテゴリ別の工数集計を確認できます。',
  },
  {
    to: '/settings',
    title: '設定',
    description: 'プロフィール、Slack・Backlog連携の設定ができます。',
  },
]

/** admin専用カード */
const adminCards = [
  {
    to: '/users',
    title: 'ユーザー管理',
    description: 'ユーザーの作成・編集・無効化ができます。',
  },
  {
    to: '/roles',
    title: 'ロール管理',
    description: 'ロールの作成・編集・削除ができます。',
  },
]

/** ユーザーがadminロールを持つか */
const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)

/** ロール表示用テキスト */
const roleLabel = computed(() => {
  if (!user.value) return ''
  return user.value.roles?.includes('admin') ? '管理者' : 'メンバー'
})
</script>

<template>
  <div>
    <!-- ウェルカムセクション -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">ようこそ、{{ user?.name }}さん</h1>
      <p class="mt-1 text-sm text-gray-500">
        ロール:
        <span
          class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
        >
          {{ roleLabel }}
        </span>
      </p>
    </div>

    <!-- メニューカード -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="card in menuCards"
        :key="card.to"
        :to="card.to"
        class="block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
      >
        <h3 class="text-lg font-semibold text-gray-900">{{ card.title }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ card.description }}</p>
      </NuxtLink>
    </div>

    <!-- 管理者メニュー（adminのみ） -->
    <template v-if="isAdmin">
      <div class="mt-8 border-t border-gray-200 pt-6">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">管理者メニュー</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="card in adminCards"
            :key="card.to"
            :to="card.to"
            class="block rounded-lg border border-orange-200 bg-orange-50 p-6 transition-all hover:border-orange-300 hover:shadow-md"
          >
            <h3 class="text-lg font-semibold text-gray-900">{{ card.title }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ card.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
