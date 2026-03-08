<script setup lang="ts">
import { Label } from 'reka-ui'

interface Props {
  for?: string
}

defineProps<Props>()
</script>

<template>
  <Label :for="$props.for" class="block text-sm font-medium text-gray-700">
    <slot />
  </Label>
</template>
