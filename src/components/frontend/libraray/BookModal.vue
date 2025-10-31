<template>
  <transition name="modal">
    <div v-if="selectedBook" class="fixed inset-0 mt-18 z-100 overflow-y-auto">
      <!-- الخلفية الشفافة -->
      <div class="fixed inset-0 bg-white/80 backdrop-blur-md transition-opacity" @click="closeModal"></div>
      
      <!-- محتوى المودال -->
      <div class="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div class="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 modal-content border border-white/30">
          
          <!-- زر الإغلاق -->
          <button 
            @click="closeModal"
            class="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-lg border border-gray-200"
          >
            <i class="fas fa-times text-sm"></i>
          </button>

          <!-- زر المفضلة -->
          <button
            @click="toggleFavoriteModal"
            class="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-50 transition-all duration-300 shadow-lg border border-gray-200"
          >
            <i :class="selectedBook.isFavorite ? 'fas text-red-500' : 'far text-gray-600'" class="fa-heart text-sm"></i>
          </button>

          <div class="flex flex-col md:flex-row h-full">
            <!-- الجانب الأيسر - صورة الكتاب -->
            <div class="md:w-2/5 bg-gradient-to-br from-[#9EBF3B] to-[#7CA52D] p-4 sm:p-6 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
              <!-- تأثيرات زخرفية شفافة -->
              <div class="absolute top-0 left-0 w-32 h-32 bg-[#9EBF3B]/10 rounded-full -translate-x-16 -translate-y-16"></div>
              <div class="absolute bottom-0 right-0 w-48 h-48 bg-[#7CA52D]/5 rounded-full translate-x-24 translate-y-24"></div>
              
              <div class="relative z-10 w-32 h-44 sm:w-40 h-56 md:w-48 md:h-64 mx-auto">
                <img 
                  :src="selectedBook.cover" 
                  :alt="selectedBook.title" 
                  class="w-full h-full object-cover rounded-xl shadow-2xl border-8 border-white/30"
                />
                <!-- شارة التقييم -->
                <div class="absolute -bottom-2 -left-2 bg-gradient-to-r from-[#d6a29a] to-[#d6a29a] text-white px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <i class="fas fa-star text-xs"></i>
                  <span class="font-bold text-xs">{{ selectedBook.rating }}</span>
                </div>
              </div>
            </div>

            <!-- الجانب الأيمن - محتوى الكتاب -->
            <div class="md:w-3/5 p-4 sm:p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <!-- العنوان والمؤلف -->
              <div class="mb-3 sm:mb-4">
                <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
                  {{ selectedBook.title }}
                </h2>
                <div class="flex items-center gap-2 text-gray-600 mb-2 sm:mb-3">
                  <i class="fas fa-user-edit text-[#9EBF3B] text-sm"></i>
                  <span class="text-sm sm:text-base font-medium">{{ selectedBook.author }}</span>
                </div>
                
                <!-- التصنيف والسنة -->
                <div class="flex flex-wrap gap-2 mb-2 sm:mb-3">
                  <span class="bg-blue-100/80 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                    <i class="fas fa-tag text-xs"></i>
                    {{ selectedBook.category }}
                  </span>
                  <span class="bg-purple-100/80 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                    <i class="fas fa-calendar text-xs"></i>
                    {{ selectedBook.year }}
                  </span>
                </div>
              </div>

              <!-- التقييم -->
              <div class="mb-3 sm:mb-4">
                <div class="flex items-center gap-2 mb-1">
                  <div class="flex text-[#d6a29a] text-sm sm:text-base">
                    <i v-for="star in 5" :key="star" 
                       :class="star <= Math.floor(selectedBook.rating) ? 'fas' : star - 0.5 <= selectedBook.rating ? 'fas fa-star-half-alt' : 'far'" 
                       class="fa-star">
                    </i>
                  </div>
                  <span class="text-gray-600 font-semibold text-xs sm:text-sm">({{ selectedBook.rating }})</span>
                </div>
                <p class="text-gray-500 text-xs">بناءً على 124 تقييم</p>
              </div>

              <!-- الوصف -->
              <div class="mb-4 sm:mb-6">
                <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <i class="fas fa-file-alt text-[#9EBF3B] text-sm"></i>
                  نبذة عن الكتاب
                </h3>
                <p class="text-gray-600 leading-relaxed text-justify text-xs sm:text-sm">
                  {{ selectedBook.description }}
                </p>
              </div>

              <!-- الإحصائيات -->
              <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div class="text-center p-2 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                  <div class="text-lg sm:text-xl font-bold text-[#9EBF3B] mb-1">328</div>
                  <div class="text-xs text-gray-500">صفحة</div>
                </div>
                <div class="text-center p-2 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                  <div class="text-lg sm:text-xl font-bold text-[#9EBF3B] mb-1">4.2</div>
                  <div class="text-xs text-gray-500">ساعات قراءة</div>
                </div>
                <div class="text-center p-2 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                  <div class="text-lg sm:text-xl font-bold text-[#9EBF3B] mb-1">15K</div>
                  <div class="text-xs text-gray-500">قارئ</div>
                </div>
              </div>

              <!-- أزرار الإجراءات -->
              <div class="flex flex-col gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4">
                <div class="flex flex-col sm:flex-row gap-2">
                  <button 
                    @click="downloadBook"
                    class="flex-1 bg-gradient-to-r from-[#9EBF3B] to-[#8cad35] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm backdrop-blur-sm min-h-[44px] sm:min-h-[50px]"
                  >
                    <i class="fas fa-download text-xs sm:text-sm"></i>
                    تحميل الكتاب
                  </button>
                  
                  <button 
                    @click="previewBook"
                    class="flex-1 border-2 border-[#9EBF3B] text-[#9EBF3B] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-[#9EBF3B] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm backdrop-blur-sm min-h-[44px] sm:min-h-[50px]"
                  >
                    <i class="fas fa-eye text-xs sm:text-sm"></i>
                    معاينة
                  </button>
                </div>
                
                <button 
                  @click="rateBook"
                  class="w-full border-2 border-[#d6a29a] text-[#d6a29a] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-[#d6a29a] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm backdrop-blur-sm min-h-[44px] sm:min-h-[50px]"
                >
                  <i class="fas fa-star text-xs sm:text-sm"></i>
                  تقييم الكتاب
                </button>
              </div>

              <!-- معلومات إضافية -->
              <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50">
                <div class="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">
                  <span class="flex items-center gap-1 justify-center sm:justify-start">
                    <i class="fas fa-language text-xs"></i>
                    اللغة: العربية
                  </span>
                  <span class="flex items-center gap-1 justify-center sm:justify-start">
                    <i class="fas fa-file-pdf text-xs"></i>
                    PDF - 5.2 MB
                  </span>
                  <span class="flex items-center gap-1 justify-center sm:justify-start">
                    <i class="fas fa-shield-alt text-xs"></i>
                    مرخصة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BookModal',
  props: {
    selectedBook: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'toggle-favorite', 'download', 'preview', 'rate'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    toggleFavoriteModal() {
      this.$emit('toggle-favorite', this.selectedBook.id);
    },
    downloadBook() {
      this.$emit('download', this.selectedBook.id);
    },
    previewBook() {
      this.$emit('preview', this.selectedBook.id);
    },
    rateBook() {
      this.$emit('rate', this.selectedBook.id);
    }
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.modal-enter-from .modal-content {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}

.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}

/* شريط التمرير المخصص */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #9EBF3B;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #7CA52D;
}

/* تحسينات للاستجابة */
@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .flex-col.md\:flex-row {
    flex-direction: column;
  }
  
  .md\:w-2\/5, .md\:w-3\/5 {
    width: 100%;
  }
}

/* تحسينات للشاشات الصغيرة جداً */
@media (max-width: 480px) {
  .modal-content {
    margin: 0.25rem;
    max-height: 98vh;
  }
}

/* تحسينات للشاشات المتوسطة والكبيرة */
@media (min-width: 769px) {
  .w-32.h-44.sm\:w-40.h-56.md\:w-48.md\:h-64 {
    width: 192px;
    height: 256px;
  }
}

/* تأكد من أن المحتوى يمكن التمرير فيه */
.h-full.overflow-y-auto {
  display: flex;
  flex-direction: column;
}

/* تحسين التخطيط للأزرار */
.mt-auto {
  margin-top: auto;
}
</style>