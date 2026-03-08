<script setup lang="ts">
const { projects, meta, loading, error, fetchProjects } = useProject()

const currentPage = ref(1)
const isActiveFilter = ref<boolean | undefined>(undefined)

const loadProjects = async () => {
  await fetchProjects({
    page: currentPage.value,
    is_active: isActiveFilter.value,
  })
}

// 初回ロード
await loadProjects()

// ページ変更時に再取得
watch(currentPage, () => loadProjects())

// フィルタ変更時に1ページ目から再取得
watch(isActiveFilter, () => {
  currentPage.value = 1
  loadProjects()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">プロジェクト一覧</h1>
      <Button @click="navigateTo('/projects/create')"> 新規作成 </Button>
    </div>

    <!-- フィルタ -->
    <div class="mb-4">
      <select v-model="isActiveFilter" class="rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option :value="undefined">すべて</option>
        <option :value="true">進行中</option>
        <option :value="false">完了</option>
      </select>
    </div>

    <!-- エラー表示 -->
    <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

    <!-- ローディング -->
    <p v-if="loading" class="text-gray-500">読み込み中...</p>

    <!-- テーブル -->
    <div v-else-if="projects.length > 0" class="overflow-hidden rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              案件名
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              金額
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              ステータス
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="p in projects" :key="p.id">
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/projects/${p.id}`"
                class="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {{ p.name }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ p.amount.toLocaleString() }}円</td>
            <td class="px-6 py-4">
              <Badge :variant="p.is_active ? 'success' : 'default'">
                {{ p.is_active ? '進行中' : '完了' }}
              </Badge>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <Button size="sm" variant="secondary" @click="navigateTo(`/projects/${p.id}/edit`)">
                  編集
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状態 -->
    <p v-else class="text-gray-500">プロジェクトがありません。</p>

    <!-- ページネーション -->
    <Pagination
      v-if="meta && meta.last_page > 1"
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :total="meta.total"
      @update:current-page="currentPage = $event"
    />
  </div>
</template>
