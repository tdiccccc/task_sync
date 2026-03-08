<script setup lang="ts">
interface Props {
  currentPage: number
  lastPage: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const hasPrev = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.lastPage)

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.lastPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 pt-4">
    <!-- 件数表示 -->
    <p class="text-sm text-gray-500">
      全 {{ total }} 件中 {{ currentPage }} / {{ lastPage }} ページ
    </p>

    <!-- ページ切り替えボタン -->
    <div class="flex gap-2">
      <Button variant="secondary" size="sm" :disabled="!hasPrev" @click="goToPage(currentPage - 1)">
        前へ
      </Button>
      <Button variant="secondary" size="sm" :disabled="!hasNext" @click="goToPage(currentPage + 1)">
        次へ
      </Button>
    </div>
  </div>
</template>
