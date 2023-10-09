<script setup lang="ts">
defineProps({
  genre: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="bg-neutral-800 text-xs leading-3 text-white rounded-full px-2 py-1 cursor-pointer"
    :class="closable ? 'flex gap-1 items-center pr-1' : ''"
    @click="$emit('filter', genre)"
  >
    <span class="">
      {{ genre }}
    </span>
    <button
      v-if="closable"
      class="mx-1 p-0"
      @click="$emit('removeGenre', genre)"
    >
      <svg
        class="w-3 h-3 text-white fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 6.586L2.707 1.293A1 1 0 1 0 1.293 2.707L6.586 8l-5.293 5.293a1 1 0 1 0 1.414 1.414L8 9.414l5.293 5.293a1 1 0 1 0 1.414-1.414L9.414 8l5.293-5.293a1 1 0 0 0-1.414-1.414L8 6.586z"
        />
      </svg>
    </button>
  </button>
</template>

<style scoped></style>
