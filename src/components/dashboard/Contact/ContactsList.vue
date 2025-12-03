<template>
  <div class="min-h-screen p-2 sm:p-4">
    <!-- عنوان + زر التحديث -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <!-- العنوان في الأعلى -->
      <div class="text-center sm:text-right order-1 sm:order-1">
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">إدارة الاتصالات</h1>
        <p class="text-xs sm:text-sm text-secondary mt-1">إدارة رسائل العملاء والاستفسارات</p>
      </div>
      
      <!-- زر التحديث -->
      <button 
        @click="refreshData"
        :disabled="loading"
        class="bg-tertiary hover:bg-primary text-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center order-2 sm:order-2"
      >
        <svg 
          :class="['w-4 h-4', loading ? 'animate-spin' : '']" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        تحديث
      </button>
    </div>

    <!-- رسالة تم التحديث بنجاح -->
    <div 
      v-if="showSuccessMessage" 
      class="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm text-green-800 font-medium">تم التحديث بنجاح</span>
          <span class="text-sm text-green-700">{{ currentFilterInfo }}</span>
        </div>
        <button 
          @click="showSuccessMessage = false"
          class="text-green-600 hover:text-green-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- رسالة تم التعديل بنجاح -->
    <div 
      v-if="showEditSuccessMessage" 
      class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 animate-fade-in"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm text-blue-800 font-medium">تم التعديل بنجاح</span>
          <span class="text-sm text-blue-700">تم تحديث حالة الرسالة بنجاح</span>
        </div>
        <button 
          @click="showEditSuccessMessage = false"
          class="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- أدوات البحث والتصفية -->
    <div class="flex flex-col sm:flex-row items-stretch gap-4 mb-6 bg-tertiary p-4 rounded-lg border border-primary">
      <!-- البحث -->
      <div class="relative flex-1 sm:max-w-xs">
        <input 
          v-model="searchQuery" 
          placeholder="ابحث في الرسائل..." 
          class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors pr-10" 
          @input="handleSearch"
        />
        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </span>
      </div>
      
      <!-- الفلتر حسب النوع -->
      <select 
        v-model="messageType" 
        class="flex-1 sm:flex-none min-w-[140px] rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors sm:mr-auto"
        @change="handleFilter"
      >
        <option value="">جميع الأنواع</option>
        <option value="inquiry">استفسار</option>
        <option value="complaint">شكوى</option>
        <option value="suggestion">اقتراح</option>
        <option value="support">دعم فني</option>
      </select>

      <!-- الفلتر حسب الحالة -->
      <select 
        v-model="status" 
        class="flex-1 sm:flex-none min-w-[140px] rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
        @change="handleFilter"
      >
        <option value="">جميع الحالات</option>
        <option value="new">جديد</option>
        <option value="in_progress">قيد المعالجة</option>
        <option value="resolved">تم الحل</option>
        <option value="closed">مغلق</option>
      </select>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p class="text-sm text-secondary">جاري تحميل البيانات...</p>
      </div>
    </div>

    <!-- رسالة الخطأ -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded-lg flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ error }}</span>
      </div>
      <button @click="clearError" class="text-red-700 hover:text-red-900 font-bold text-lg">×</button>
    </div>

    <!-- رسالة النجاح -->
    <div v-else-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-1 rounded-lg flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
      <button @click="clearSuccess" class="text-green-700 hover:text-green-900 font-bold text-lg">×</button>
    </div>

    <!-- الجدول -->
    <div v-else class="bg-primary border border-primary rounded-lg overflow-hidden">
      <!-- جدول للشاشات الكبيرة -->
      <div class="hidden lg:block">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-primary bg-tertiary">
              <th class="px-4 py-1 text-start font-medium text-primary">المرسل</th>
              <th class="px-4 py-1 text-start font-medium text-primary">الموضوع والنوع</th>
              <th class="px-4 py-1 text-start font-medium text-primary">الحالة</th>
              <th class="px-4 py-1 text-start font-medium text-primary">تاريخ الإرسال</th>
              <th class="px-4 py-1 text-start font-medium text-primary">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="contact in paginatedContacts" 
              :key="contact.id"
              class="border-b border-primary hover:bg-tertiary transition-colors"
            >
              <!-- معلومات المرسل -->
              <td class="px-4 py-1">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <span class="text-brand-600 font-medium text-sm">
                      {{ getContactInitials(contact.name) }}
                    </span>
                  </div>
                  <div>
                    <div class="text-primary font-medium">{{ contact.name }}</div>
                    <div class="text-xs text-secondary direction-ltr">{{ contact.email }}</div>
                    <div v-if="contact.phone" class="text-xs text-secondary">{{ contact.phone }}</div>
                  </div>
                </div>
              </td>

              <!-- الموضوع والنوع -->
              <td class="px-4 py-1">
                <div class="text-primary font-medium mb-1">{{ contact.subject }}</div>
                <span :class="messageTypeBadgeClass(contact.message_type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getMessageTypeLabel(contact.message_type) }}
                </span>
              </td>

              <!-- الحالة -->
              <td class="px-4 py-1">
                <div class="space-y-2">
                  <span :class="statusBadgeClass(contact.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusLabel(contact.status) }}
                  </span>
                  <div v-if="contact.admin_notes" class="text-xs text-secondary max-w-[200px] truncate" :title="contact.admin_notes">
                    {{ contact.admin_notes }}
                  </div>
                </div>
              </td>

              <!-- تاريخ الإرسال -->
              <td class="px-4 py-1">
                <div class="text-primary text-sm">{{ formatDate(contact.created_at) }}</div>
                <div class="text-xs text-secondary">{{ formatTimeAgo(contact.created_at) }}</div>
              </td>

              <!-- الإجراءات -->
              <td class="px-4 py-1">
                <div class="flex items-center gap-2">
                  <button 
                    @click="viewContactDetails(contact)"
                    class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                    title="عرض التفاصيل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button 
                    @click="updateContactStatus(contact)"
                    class="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
                    title="تغيير الحالة"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    @click="replyToContact(contact)"
                    class="text-purple-600 hover:text-purple-800 transition-colors p-1 rounded"
                    title="الرد على المرسل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDeleteContact(contact)"
                    class="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                    title="حذف الرسالة"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- بطاقات للشاشات الصغيرة -->
      <div class="lg:hidden space-y-3 p-3">
        <div 
          v-for="contact in paginatedContacts" 
          :key="contact.id"
          class="bg-secondary rounded-lg p-4 border border-primary"
        >
          <!-- رأس البطاقة -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                <span class="text-brand-600 font-medium text-sm">
                  {{ getContactInitials(contact.name) }}
                </span>
              </div>
              <div>
                <div class="text-primary font-medium">{{ contact.name }}</div>
                <div class="text-xs text-secondary direction-ltr">{{ contact.email }}</div>
                <div v-if="contact.phone" class="text-xs text-secondary">{{ contact.phone }}</div>
              </div>
            </div>
            <span :class="statusBadgeClass(contact.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ getStatusLabel(contact.status) }}
            </span>
          </div>

          <!-- معلومات الرسالة -->
          <div class="space-y-2 mb-3">
            <div class="text-primary font-medium">{{ contact.subject }}</div>
            <span :class="messageTypeBadgeClass(contact.message_type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ getMessageTypeLabel(contact.message_type) }}
            </span>
            <div v-if="contact.admin_notes" class="text-xs text-secondary bg-yellow-50 p-2 rounded mt-1">
              {{ contact.admin_notes }}
            </div>
          </div>

          <!-- التاريخ والإجراءات -->
          <div class="flex items-center justify-between pt-3 border-t border-primary">
            <div class="text-xs text-secondary">
              {{ formatDate(contact.created_at) }}
            </div>
            <div class="flex items-center gap-1">
              <button 
                @click="viewContactDetails(contact)"
                class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                title="عرض التفاصيل"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button 
                @click="updateContactStatus(contact)"
                class="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
                title="تغيير الحالة"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button 
                @click="replyToContact(contact)"
                class="text-purple-600 hover:text-purple-800 transition-colors p-1 rounded"
                title="الرد على المرسل"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
              </button>
              <button 
                @click="confirmDeleteContact(contact)"
                class="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                title="حذف الرسالة"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-if="contacts.length === 0" class="text-center py-12 text-secondary">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-primary mb-2">لا توجد رسائل</h3>
        <p class="text-sm text-secondary mb-4">لم يتم استلام أي رسائل حتى الآن.</p>
      </div>
    </div>

    <!-- الترقيم -->
    <div v-if="contacts.length > 0" class="mt-4 bg-tertiary px-4 py-1 rounded-lg border border-primary">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary rounded-lg border border-primary">
        <!-- معلومات الصفحة -->
        <div class="text-sm text-secondary">
          عرض {{ startItem }} - {{ endItem }} من إجمالي {{ filteredContacts.length }} رسالة
        </div>

        <!-- أزرار التنقل -->
        <div class="flex items-center gap-1 order-first sm:order-none">
          <!-- زر الصفحة الأولى -->
          <button 
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === 1 
                ? 'bg-tertiary text-secondary cursor-not-allowed border-primary' 
                : 'bg-primary text-primary hover:bg-tertiary border-primary hover:border-brand-500'
            ]"
            title="الصفحة الأولى"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- زر الصفحة السابقة -->
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === 1 
                ? 'bg-tertiary text-secondary cursor-not-allowed border-primary' 
                : 'bg-primary text-primary hover:bg-tertiary border-primary hover:border-brand-500'
            ]"
            title="الصفحة السابقة"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- أرقام الصفحات -->
          <div class="flex gap-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="page !== '...' && goToPage(page)"
              :class="[
                'min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors border flex items-center justify-center',
                page === currentPage
                  ? 'bg-brand-500 text-white border-brand-500 shadow-md'
                  : page === '...' 
                    ? 'bg-transparent text-secondary border-transparent cursor-default'
                    : 'bg-primary text-primary hover:bg-tertiary border-primary hover:border-brand-500 hover:text-brand-600'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <!-- زر الصفحة التالية -->
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'bg-tertiary text-secondary cursor-not-allowed border-primary' 
                : 'bg-primary text-primary hover:bg-tertiary border-primary hover:border-brand-500'
            ]"
            title="الصفحة التالية"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- زر الصفحة الأخيرة -->
          <button 
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            :class="[
              'p-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'bg-tertiary text-secondary cursor-not-allowed border-primary' 
                : 'bg-primary text-primary hover:bg-tertiary border-primary hover:border-brand-500'
            ]"
            title="الصفحة الأخيرة"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- اختيار عدد العناصر -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-secondary">عرض</span>
          <select 
            :value="itemsPerPage"
            @change="updateItemsPerPage(parseInt($event.target.value))"
            class="px-3 py-2 rounded-lg border border-primary bg-primary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors cursor-pointer min-w-[80px]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
          <span class="text-sm text-secondary">لكل صفحة</span>
        </div>
      </div>
    </div>

    <!-- مودال عرض التفاصيل -->
    <div 
      v-if="showDetailsModal && selectedContact" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      @click.self="closeDetailsModal"
    >
      <div class="w-full max-w-4xl bg-primary rounded-xl border border-primary shadow-lg flex flex-col" style="max-height: 90vh;">
        <!-- رأس الـ Modal ثابت -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-primary bg-primary rounded-t-xl flex-shrink-0">
          <h2 class="text-lg sm:text-xl font-semibold text-primary">تفاصيل الرسالة</h2>
          <button 
            @click="closeDetailsModal"
            class="text-secondary hover:text-primary transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-tertiary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- محتوى الـ Modal مع تمرير -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- معلومات المرسل -->
            <div class="bg-tertiary p-4 rounded-lg border border-primary">
              <h3 class="text-md font-semibold text-primary mb-4 border-b border-primary pb-2">معلومات المرسل</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">الاسم</div>
                    <div class="text-sm text-primary font-medium">{{ selectedContact.name }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">البريد الإلكتروني</div>
                    <div class="text-sm text-primary font-medium direction-ltr">{{ selectedContact.email }}</div>
                  </div>
                </div>

                <div v-if="selectedContact.phone" class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">الهاتف</div>
                    <div class="text-sm text-primary font-medium">{{ selectedContact.phone }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">تاريخ الإرسال</div>
                    <div class="text-sm text-primary font-medium">{{ formatDate(selectedContact.created_at) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- معلومات الرسالة -->
            <div class="bg-tertiary p-4 rounded-lg border border-primary">
              <h3 class="text-md font-semibold text-primary mb-4 border-b border-primary pb-2">معلومات الرسالة</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">الموضوع</div>
                    <div class="text-sm text-primary font-medium">{{ selectedContact.subject }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">نوع الرسالة</div>
                    <span :class="messageTypeBadgeClass(selectedContact.message_type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1">
                      {{ getMessageTypeLabel(selectedContact.message_type) }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-secondary">الحالة</div>
                    <span :class="statusBadgeClass(selectedContact.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1">
                      {{ getStatusLabel(selectedContact.status) }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedContact.admin_notes" class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 flex-shrink-0 mt-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-secondary mb-1">ملاحظات المسؤول</div>
                    <div class="text-sm text-primary bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {{ selectedContact.admin_notes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- محتوى الرسالة -->
          <div class="bg-tertiary p-4 rounded-lg border border-primary mb-6">
            <h3 class="text-md font-semibold text-primary mb-3 border-b border-primary pb-2">محتوى الرسالة</h3>
            <div class="bg-primary p-4 rounded-lg border border-primary whitespace-pre-wrap min-h-[150px] text-primary leading-relaxed">
              {{ selectedContact.message }}
            </div>
          </div>
        </div>

        <!-- تذييل الـ Modal ثابت -->
        <div class="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-primary bg-primary rounded-b-xl flex-shrink-0">
          <button 
            @click="closeDetailsModal"
            class="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-tertiary transition-colors text-sm font-medium"
          >
            إغلاق
          </button>
          <button 
            @click="updateContactStatus(selectedContact)"
            class="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-[#8FAE2F] text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            تغيير الحالة
          </button>
        </div>
      </div>
    </div>

    <!-- مودال تحديث الحالة -->
    <div 
      v-if="showStatusModal && selectedContact" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      @click.self="closeStatusModal"
    >
      <div class="w-full max-w-md bg-primary rounded-xl border border-primary shadow-lg">
        <!-- رأس الـ Modal -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-primary bg-primary rounded-t-xl">
          <h2 class="text-lg sm:text-xl font-semibold text-primary">تحديث حالة الرسالة</h2>
          <button 
            @click="closeStatusModal"
            class="text-secondary hover:text-primary transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-tertiary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- محتوى الـ Modal -->
        <div class="p-4 sm:p-6">
          <div class="mb-6">
            <p class="text-primary mb-2">
              <span class="font-medium">المرسل:</span> 
              <span class="font-semibold text-brand-600">{{ selectedContact.name }}</span>
            </p>
            <p class="text-primary">
              <span class="font-medium">الموضوع:</span> 
              <span class="font-semibold">{{ selectedContact.subject }}</span>
            </p>
          </div>

          <form @submit.prevent="handleUpdateStatus">
            <!-- الحالة -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-primary mb-3">الحالة</label>
              <select
                v-model="statusForm.status"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors cursor-pointer"
                required
              >
                <option value="new">جديد</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
                <option value="closed">مغلق</option>
              </select>
            </div>

            <!-- ملاحظات المسؤول -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-primary mb-3">ملاحظات المسؤول (اختياري)</label>
              <textarea
                v-model="statusForm.admin_notes"
                rows="4"
                placeholder="أضف ملاحظات حول متابعة هذه الرسالة..."
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors resize-none placeholder:text-secondary"
              ></textarea>
            </div>

            <!-- الحالة الحالية -->
            <div class="bg-tertiary p-4 rounded-lg mb-6 border border-primary">
              <p class="text-sm text-secondary mb-2">الحالة الحالية:</p>
              <span :class="statusBadgeClass(selectedContact.status)" class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full">
                {{ getStatusLabel(selectedContact.status) }}
              </span>
            </div>

            <!-- الإجراءات -->
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="closeStatusModal"
                class="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-tertiary transition-colors text-sm font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="saving"
                :class="[
                  'px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2',
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-brand-500 hover:bg-[#8FAE2F]'
                ]"
              >
                <svg v-if="saving" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.536 7.464l2.828 2.828M6.344 17.656l-2.828 2.828"/>
                </svg>
                {{ saving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- مودال تأكيد الحذف -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div class="w-full max-w-md rounded-xl border border-primary bg-primary p-4 shadow-lg mx-3">
        <h3 class="text-lg font-semibold text-primary mb-2">تأكيد الحذف</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">
          هل أنت متأكد من رغبتك في حذف رسالة "<span class="font-medium text-primary">{{ contactToDelete?.subject }}</span>"؟ 
          لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button 
            @click="closeDeleteModal"
            class="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-tertiary transition-colors text-sm font-medium w-full sm:w-auto"
          >
            إلغاء
          </button>
          <button 
            @click="handleDeleteContact"
            :disabled="deleting"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="deleting" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.536 7.464l2.828 2.828M6.344 17.656l-2.828 2.828"/>
            </svg>
            {{ deleting ? 'جاري الحذف...' : 'حذف' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { useContactStore } from '@/stores/contact'

export default {
  name: 'ContactsManagement',
  
  setup() {
    const contactStore = useContactStore()

    // حالة التطبيق
    const loading = computed(() => contactStore.loading)
    const error = computed(() => contactStore.error)
    const successMessage = computed(() => contactStore.successMessage)
    const contacts = computed(() => contactStore.items)
    
    const searchQuery = ref('')
    const messageType = ref('')
    const status = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showSuccessMessage = ref(false)
    const showEditSuccessMessage = ref(false)
    
    // حالة الـ Modals
    const showDetailsModal = ref(false)
    const showStatusModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedContact = ref(null)
    const contactToDelete = ref(null)
    const saving = ref(false)
    const deleting = ref(false)
    
    // نموذج تحديث الحالة
    const statusForm = reactive({
      status: '',
      admin_notes: ''
    })

    // تحميل البيانات الأولية
    onMounted(async () => {
      await loadContacts()
    })

    // دالة تحميل البيانات من الـ store
    const loadContacts = async () => {
      try {
        const params = {
          search: searchQuery.value || undefined,
          message_type: messageType.value || undefined,
          status: status.value || undefined
        }
        await contactStore.fetchContacts(params)
      } catch (err) {
        console.error('Error loading contacts:', err)
      }
    }

    // معلومات الفلتر الحالي
    const currentFilterInfo = computed(() => {
      const filters = []
      
      if (searchQuery.value) {
        filters.push(`بحث: "${searchQuery.value}"`)
      }
      
      if (messageType.value) {
        const typeLabels = {
          'inquiry': 'استفسار',
          'complaint': 'شكوى', 
          'suggestion': 'اقتراح',
          'support': 'دعم فني'
        }
        filters.push(`نوع: ${typeLabels[messageType.value] || messageType.value}`)
      }
      
      if (status.value) {
        const statusLabels = {
          'new': 'جديد',
          'in_progress': 'قيد المعالجة',
          'resolved': 'تم الحل',
          'closed': 'مغلق'
        }
        filters.push(`حالة: ${statusLabels[status.value] || status.value}`)
      }
      
      return filters.length > 0 ? filters.join(' - ') : 'جميع الرسائل'
    })

    // عرض رسالة النجاح للفلتر
    const showFilterSuccess = () => {
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }

    // عرض رسالة النجاح للتعديل
    const showEditSuccess = () => {
      showEditSuccessMessage.value = true
      setTimeout(() => {
        showEditSuccessMessage.value = false
      }, 3000)
    }

    // تصفية البيانات محلياً للبحث السريع
    const filteredContacts = computed(() => {
      let filtered = contacts.value
      
      if (searchQuery.value) {
        const searchTerm = searchQuery.value.toLowerCase()
        filtered = filtered.filter(contact => 
          contact.name?.toLowerCase().includes(searchTerm) ||
          contact.email?.toLowerCase().includes(searchTerm) ||
          contact.subject?.toLowerCase().includes(searchTerm) ||
          contact.message?.toLowerCase().includes(searchTerm)
        )
      }
      
      if (messageType.value) {
        filtered = filtered.filter(contact => contact.message_type === messageType.value)
      }
      
      if (status.value) {
        filtered = filtered.filter(contact => contact.status === status.value)
      }
      
      return filtered
    })

    // البيانات المعروضة في الصفحة الحالية
    const paginatedContacts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredContacts.value.slice(start, end)
    })

    // معلومات الترقيم
    const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))
    const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
    const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredContacts.value.length))

    // الصفحات المرئية في الترقيم
    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    })

    // البحث والتصفية
    const handleSearch = () => {
      currentPage.value = 1
      loadContacts()
      showFilterSuccess()
    }

    const handleFilter = () => {
      currentPage.value = 1
      loadContacts()
      showFilterSuccess()
    }

    // التنقل بين الصفحات
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page
      }
    }

    const updateItemsPerPage = (value) => {
      itemsPerPage.value = value
      currentPage.value = 1
    }

    // إدارة الـ Modals
    const viewContactDetails = async (contact) => {
      try {
        await contactStore.fetchContactById(contact.id)
        selectedContact.value = contactStore.currentContact
        showDetailsModal.value = true
      } catch (err) {
        console.error('Error fetching contact details:', err)
      }
    }

    const updateContactStatus = (contact) => {
      selectedContact.value = contact
      statusForm.status = contact.status
      statusForm.admin_notes = contact.admin_notes || ''
      showStatusModal.value = true
      showDetailsModal.value = false
    }

    const confirmDeleteContact = (contact) => {
      contactToDelete.value = contact
      showDeleteModal.value = true
    }

    const closeDetailsModal = () => {
      showDetailsModal.value = false
      selectedContact.value = null
    }

    const closeStatusModal = () => {
      showStatusModal.value = false
      selectedContact.value = null
      statusForm.status = ''
      statusForm.admin_notes = ''
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      contactToDelete.value = null
      deleting.value = false
    }

    // الإجراءات
    const refreshData = async () => {
      await loadContacts()
      showFilterSuccess()
    }

    const handleUpdateStatus = async () => {
      saving.value = true
      
      try {
        await contactStore.updateContactStatus(
          selectedContact.value.id,
          statusForm.status,
          statusForm.admin_notes
        )
        
        closeStatusModal()
        showEditSuccess()
      } catch (err) {
        console.error('Error updating status:', err)
      } finally {
        saving.value = false
      }
    }

    const handleDeleteContact = async () => {
      deleting.value = true
      
      try {
        await contactStore.deleteContact(contactToDelete.value.id)
        closeDeleteModal()
      } catch (err) {
        console.error('Error deleting contact:', err)
      } finally {
        deleting.value = false
      }
    }

    const replyToContact = (contact) => {
      window.open(`mailto:${contact.email}?subject=رد على: ${contact.subject}`, '_blank')
    }

    const clearError = () => {
      contactStore.clearMessages()
    }

    const clearSuccess = () => {
      contactStore.clearMessages()
    }

    // دوال مساعدة
    const getContactInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getMessageTypeLabel = (type) => {
      const types = {
        'inquiry': 'استفسار',
        'complaint': 'شكوى',
        'suggestion': 'اقتراح',
        'support': 'دعم فني',
        'other': 'أخرى'
      }
      return types[type] || type
    }

    const getStatusLabel = (status) => {
      const statuses = {
        'new': 'جديد',
        'in_progress': 'قيد المعالجة',
        'resolved': 'تم الحل',
        'closed': 'مغلق'
      }
      return statuses[status] || status
    }

    const messageTypeBadgeClass = (type) => {
      const classes = {
        'inquiry': 'bg-blue-100 text-blue-800',
        'complaint': 'bg-red-100 text-red-800',
        'suggestion': 'bg-green-100 text-green-800',
        'support': 'bg-purple-100 text-purple-800',
        'other': 'bg-gray-100 text-gray-800'
      }
      return classes[type] || classes.other
    }

    const statusBadgeClass = (status) => {
      const classes = {
        'new': 'bg-yellow-100 text-yellow-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'resolved': 'bg-green-100 text-green-800',
        'closed': 'bg-gray-100 text-gray-800'
      }
      return classes[status] || classes.new
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'غير محدد'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatTimeAgo = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)
      
      if (diffInSeconds < 60) return 'الآن'
      if (diffInSeconds < 3600) return `قبل ${Math.floor(diffInSeconds / 60)} دقيقة`
      if (diffInSeconds < 86400) return `قبل ${Math.floor(diffInSeconds / 3600)} ساعة`
      if (diffInSeconds < 2592000) return `قبل ${Math.floor(diffInSeconds / 86400)} يوم`
      return `قبل ${Math.floor(diffInSeconds / 2592000)} شهر`
    }

    return {
      // البيانات
      contacts,
      loading,
      error,
      successMessage,
      searchQuery,
      messageType,
      status,
      currentPage,
      itemsPerPage,
      showSuccessMessage,
      showEditSuccessMessage,
      currentFilterInfo,
      
      // الـ Modals
      showDetailsModal,
      showStatusModal,
      showDeleteModal,
      selectedContact,
      contactToDelete,
      saving,
      deleting,
      statusForm,
      
      // البيانات المحسوبة
      filteredContacts,
      paginatedContacts,
      totalPages,
      startItem,
      endItem,
      visiblePages,
      
      // الدوال
      handleSearch,
      handleFilter,
      goToPage,
      updateItemsPerPage,
      viewContactDetails,
      updateContactStatus,
      confirmDeleteContact,
      closeDetailsModal,
      closeStatusModal,
      closeDeleteModal,
      refreshData,
      handleUpdateStatus,
      handleDeleteContact,
      replyToContact,
      clearError,
      clearSuccess,
      getContactInitials,
      getMessageTypeLabel,
      getStatusLabel,
      messageTypeBadgeClass,
      statusBadgeClass,
      formatDate,
      formatTimeAgo
    }
  }
}
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
  text-align: right;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>