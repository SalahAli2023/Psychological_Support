<template>
  <div class="space-y-2 sticky bottom-0 bg-white pt-2">
    <button 
      @click="$emit('resetFilters')" 
      class="w-full bg-[#dc2626] hover:bg-[#dc2626] text-white py-3 rounded-xl font-bold shadow hover:shadow-md transition-all text-sm"
    >
      {{ translate('therapists.filters.reset') }}
    </button>
    <button 
      @click="$emit('applyFilters')" 
      class="w-full bg-[#9EBF3B] hover:bg-[#9EBF3B] text-white py-3 rounded-xl font-bold shadow hover:shadow-md transition-all text-sm"
    >
      {{ translate('therapists.filters.search') }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterActions',
  props: {
    translate: Function
  },
  emits: ['resetFilters', 'applyFilters']
}
</script>