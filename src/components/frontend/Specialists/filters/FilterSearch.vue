<template>
  <div class="mb-4">
    <label class="block text-sm font-bold text-[#065f46] mb-2">
      {{ translate('therapists.filters.searchPlaceholder') }}
    </label>
    <div class="relative">
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        class="w-full border-2 border-[#9EBF3B] focus:border-[#9EBF3B] focus:ring-2 focus:ring-[#9EBF3B]/20 rounded-xl py-2 px-4 transition-all duration-200 bg-white text-sm" 
        :class="isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'"
        :placeholder="translate('therapists.filters.searchPlaceholder')" 
      />
      <i 
        class="fas fa-search absolute top-1/2 transform -translate-y-1/2 text-[#9EBF3B] text-base" 
        :class="isRTL ? 'right-4' : 'left-4'"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSearch',
  props: {
    searchQuery: String,
    isRTL: Boolean,
    translate: Function
  },
  emits: ['update:searchQuery']
}
</script>