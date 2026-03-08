<script setup lang="ts">
interface Props {
  label: string
  fieldId: string
  error?: string
}

defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
  <div>
    <AppLabel :for="fieldId">{{ label }}</AppLabel>
    <Input :id="fieldId" v-model="model" :error="!!error" v-bind="$attrs" />
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
