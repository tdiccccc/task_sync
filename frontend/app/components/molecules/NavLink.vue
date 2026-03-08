<script setup lang="ts">
interface Props {
  to: string
  label: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    active-class="bg-blue-50 text-blue-700"
  >
    {{ label }}
  </NuxtLink>
</template>
