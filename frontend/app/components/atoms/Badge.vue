<script setup lang="ts">
interface Props {
  variant?: 'default' | 'admin' | 'success' | 'warning'
}

const { variant = 'default' } = defineProps<Props>()

const variantClasses: Record<string, string> = {
  default: 'bg-blue-100 text-blue-800',
  admin: 'bg-orange-100 text-orange-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="variantClasses[variant]"
  >
    <slot />
  </span>
</template>
