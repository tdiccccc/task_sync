<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const {
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
} = defineProps<Props>()

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="rounded-md font-medium disabled:opacity-50"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot>
      {{ loading ? '処理中...' : '' }}
    </slot>
  </button>
</template>
