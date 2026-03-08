<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)

const { project, loading, error, fetchProject, deleteProject } = useProject()

const showDeleteConfirm = ref(false)

await fetchProject(id)

const handleDelete = async () => {
  try {
    await deleteProject(id)
    await navigateTo('/projects')
  } catch {
    // エラーはuseProject内で処理
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <p v-if="loading" class="text-gray-500">読み込み中...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <template v-else-if="project">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
        <div class="flex gap-2">
          <Button variant="secondary" @click="navigateTo(`/projects/${id}/edit`)"> 編集 </Button>
          <Button variant="danger" @click="showDeleteConfirm = true"> 削除 </Button>
        </div>
      </div>

      <!-- 詳細情報 -->
      <div class="rounded-lg border border-gray-200 bg-white p-6">
        <dl class="space-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">金額</dt>
            <dd class="mt-1 text-gray-900">{{ project.amount.toLocaleString() }}円</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">概要</dt>
            <dd class="mt-1 whitespace-pre-wrap text-gray-900">{{ project.description }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">ステータス</dt>
            <dd class="mt-1">
              <Badge :variant="project.is_active ? 'success' : 'default'">
                {{ project.is_active ? '進行中' : '完了' }}
              </Badge>
            </dd>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">着手日</dt>
              <dd class="mt-1 text-gray-900">{{ project.started_at ?? '未設定' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">完了日</dt>
              <dd class="mt-1 text-gray-900">{{ project.ended_at ?? '未設定' }}</dd>
            </div>
          </div>
        </dl>
      </div>

      <!-- 削除確認 -->
      <div v-if="showDeleteConfirm" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <p class="text-sm text-red-800">
          「{{ project.name }}」を削除しますか？この操作は取り消せません。
        </p>
        <div class="mt-3 flex gap-2">
          <Button variant="danger" size="sm" @click="handleDelete"> 削除する </Button>
          <Button variant="secondary" size="sm" @click="showDeleteConfirm = false">
            キャンセル
          </Button>
        </div>
      </div>
    </template>

    <div class="mt-6">
      <Button variant="secondary" @click="navigateTo('/projects')"> 一覧に戻る </Button>
    </div>
  </div>
</template>
