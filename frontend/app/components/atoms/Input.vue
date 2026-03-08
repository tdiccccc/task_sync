<script setup lang="ts">
interface Props {
  id?: string
  type?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
}

const { type = 'text', error = false, disabled = false } = defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
  <input
    :id="id"
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    class="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
    :class="
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    "
  />
</template>
