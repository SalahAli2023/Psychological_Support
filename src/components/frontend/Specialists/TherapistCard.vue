<template>
  <div class="p-4 sm:p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <!-- Profile Image -->
      <div class="flex sm:justify-start">
        <div class="relative">
          <img :src="therapist.image" :alt="therapist.name" 
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4"
              :class="index % 2 === 0 ? 'ring-primary-green' : 'ring-primary-pink'" />
        </div>
      </div>

      <!-- Therapist Info -->
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-bold text-[#065f46] mb-1">{{ therapist.name }}</h3>
            <p class="text-[#047857] font-medium text-sm sm:text-base mb-2">{{ therapist.title }}</p>

            <!-- Rating -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <i v-for="i in 5" :key="i" class="fas fa-star text-sm text-primary-pink"></i>
              </div>
              <span class="text-[#059669] font-semibold text-sm">{{ therapist.rating }}/50 {{ translate('therapists.therapist.sessions') }}</span>
            </div>

            <!-- Description -->
            <p class="text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">{{ therapist.description }}</p>

            <!-- Session Duration -->
            <p class="text-[#059669] font-medium text-sm">
              {{ translate('therapists.therapist.sessionDuration') }} : 45 {{ translate('therapists.therapist.minutes') }}
            </p>
          </div>

          <!-- Book Button -->
          <div class="flex justify-end sm:justify-end">
            <router-link :to="`/therapist/${therapist.id}`" 
                         class="text-white px-6 py-3 rounded-xl font-semibold shadow hover:shadow-md transition-all text-sm sm:text-base bg-primary-green hover:bg-secondary-pink">
              {{ translate('therapists.therapist.book') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TherapistCard',
  props: {
    therapist: Object,
    index: Number,
    isRTL: Boolean,
    translate: Function
  }
}
</script>