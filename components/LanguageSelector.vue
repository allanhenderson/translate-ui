<template>
  <div>
    <label for="language" class="block text-sm font-medium text-gray-700">
      Target Language
    </label>
    <select
      id="language"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      :disabled="disabled"
    >
      <option
        v-for="option in languageOptions"
        :key="option.code"
        :value="option.code"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { languageOptions } from '~/constants/languages'

defineProps<{
  modelValue: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
