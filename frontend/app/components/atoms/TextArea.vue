<script setup lang="ts">
interface Props {
  id?: string
  placeholder?: string
  rows?: number
  error?: boolean
  disabled?: boolean
}

const { rows = 3, error = false, disabled = false } = defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
  <textarea
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    class="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
    :class="
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    "
  />
</template>
