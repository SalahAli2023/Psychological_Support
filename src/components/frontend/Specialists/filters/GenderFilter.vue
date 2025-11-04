<template>
  <div class="mb-4">
    <h3 class="text-base font-bold text-[#065f46] mb-3">
      {{ translate('therapists.filters.gender') }}
    </h3>
    <div class="space-y-2">
      <GenderOption 
        value="all"
        :currentValue="filters.gender"
        :label="translate('therapists.filters.all')"
        :colorClass="'border-[#9EBF3B] text-[#9EBF3B]'"
        icon="far fa-user"
        :isRTL="isRTL"
        @update="updateGender"
      />
      <GenderOption 
        value="male"
        :currentValue="filters.gender"
        :label="translate('therapists.filters.male')"
        :colorClass="'border-[#D6A29A] text-[#D6A29A]'"
        icon="fas fa-mars"
        :isRTL="isRTL"
        @update="updateGender"
      />
      <GenderOption 
        value="female"
        :currentValue="filters.gender"
        :label="translate('therapists.filters.female')"
        :colorClass="'border-[#9EBF3B] text-[#9EBF3B]'"
        icon="fas fa-venus"
        :isRTL="isRTL"
        @update="updateGender"
      />
    </div>
  </div>
</template>

<script>
import GenderOption from './GenderOption.vue'

export default {
  name: 'GenderFilter',
  components: {
    GenderOption
  },
  props: {
    filters: Object,
    isRTL: Boolean,
    translate: Function
  },
  emits: ['update:filters'],
  methods: {
    updateGender(value) {
      this.$emit('update:filters', {
        ...this.filters,
        gender: value
      })
    }
  }
}
</script>