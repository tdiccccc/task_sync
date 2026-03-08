<script setup lang="ts">
import type { CreateProjectRequest } from '~~/src/openapi/schemas/api/project/create'

const route = useRoute()
const id = Number(route.params.id)

const { project, loading, fetchProject, updateProject } = useProject()

const serverError = ref('')

await fetchProject(id)

const handleSubmit = async (data: CreateProjectRequest) => {
  serverError.value = ''
  try {
    await updateProject(id, data)
    await navigateTo(`/projects/${id}`)
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'data' in e) {
      const errData = (e as { data: { message?: string } }).data
      serverError.value = errData.message ?? '更新に失敗しました'
    } else {
      serverError.value = '更新に失敗しました'
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">プロジェクト編集</h1>

    <p v-if="loading && !project" class="text-gray-500">読み込み中...</p>

    <template v-else-if="project">
      <p v-if="serverError" class="mb-4 text-sm text-red-600">{{ serverError }}</p>

      <ProjectForm
        mode="edit"
        :initial-data="{
          name: project.name,
          amount: project.amount,
          description: project.description,
          started_at: project.started_at,
          ended_at: project.ended_at,
          is_active: project.is_active,
        }"
        :loading="loading"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>
