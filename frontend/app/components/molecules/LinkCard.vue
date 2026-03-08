<script setup lang="ts">
interface Props {
  to: string
  title: string
  description: string
  variant?: 'default' | 'admin'
}

const { variant = 'default' } = defineProps<Props>()

const variantClasses: Record<string, string> = {
  default: 'border-gray-200 bg-white hover:border-blue-300',
  admin: 'border-orange-200 bg-orange-50 hover:border-orange-300',
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="block rounded-lg border p-6 transition-all hover:shadow-md"
    :class="variantClasses[variant]"
  >
    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ description }}</p>
  </NuxtLink>
</template>
