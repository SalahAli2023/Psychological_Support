<template>
  <div class="min-h-screen p-2 sm:p-4">
    <!-- إشعارات -->
    <div v-if="notification.show" 
         :class="[
           'mb-4 p-4 rounded-lg border flex items-center justify-between transition-all duration-300',
           notification.type === 'success' 
             ? 'bg-green-100 border-green-400 text-green-700'
             : notification.type === 'error'
             ? 'bg-red-100 border-red-400 text-red-700'
             : 'bg-blue-100 border-blue-400 text-blue-700'
         ]">
      <div class="flex items-center gap-2">
        <svg v-if="notification.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else-if="notification.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ notification.message }}</span>
      </div>
      <button @click="hideNotification" class="text-lg font-bold hover:opacity-70 transition-opacity">
        ×
      </button>
    </div>

    <!-- عنوان + زر الإضافة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <!-- العنوان في الأعلى -->
      <div class="text-center sm:text-right order-1 sm:order-1">
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">إدارة المستخدمين</h1>
        <p class="text-xs sm:text-sm text-secondary mt-1">إدارة وحفظ بيانات المستخدمين والصلاحيات</p>
      </div>
      
      <!-- زر الإضافة في الأسفل -->
      <button 
        @click="openAddModal"
        class="bg-brand-500 hover:bg-[#8FAE2F] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center order-2 sm:order-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        إضافة مستخدم
      </button>
    </div>

    <!-- أدوات البحث والتصفية -->
    <div class="flex flex-col sm:flex-row items-stretch gap-6 mb-6 bg-tertiary p-4 rounded-lg border border-primary">
      <!-- البحث على اليسار -->
      <div class="relative flex-1 sm:max-w-xs">
        <input 
          v-model="search" 
          placeholder="ابحث بالمستخدمين..." 
          class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors pr-10" 
          @input="handleSearch"
        />
        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
      </div>
      
      <!-- الفلتر على اليمين -->
      <select 
        v-model="role" 
        class="flex-1 sm:flex-none min-w-[140px] rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors sm:mr-auto"
        @change="handleFilter"
      >
        <option value="">جميع المستخدمين</option>
        <option value="Admin">مدير</option>
        <option value="Therapist">معالج</option>
        <option value="Client">عميل</option>
      </select>
    </div>

    <!-- حالة التحميل -->
    <div v-if="userStore.loading" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p class="text-sm text-secondary">جاري تحميل البيانات...</p>
      </div>
    </div>

    <!-- رسالة الخطأ -->
    <div v-else-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded-lg flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ userStore.error }}</span>
      </div>
      <button @click="userStore.clearError()" class="text-red-700 hover:text-red-900 font-bold text-lg">×</button>
    </div>

    <!-- الجدول -->
    <div v-else class="bg-primary border border-primary rounded-lg overflow-hidden">
      <!-- جدول للشاشات الكبيرة -->
      <div class="hidden lg:block">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-primary bg-tertiary">
              <th class="px-4 py-1 text-start font-medium text-primary">المستخدم</th>
              <th class="px-4 py-1 text-start font-medium text-primary">معلومات الاتصال</th>
              <th class="px-4 py-1 text-start font-medium text-primary">الدور والحالة</th>
              <th class="px-4 py-1 text-start font-medium text-primary">تاريخ الانضمام</th>
              <th class="px-4 py-1 text-start font-medium text-primary">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in userStore.items" 
              :key="user.id"
              class="border-b border-primary hover:bg-tertiary transition-colors"
            >
              <!-- معلومات المستخدم -->
              <td class="px-4 py-1">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <img 
                      v-if="user.avatar" 
                      :src="getImageUrl(user.avatar)" 
                      :alt="user.name"
                      class="w-10 h-10 rounded-full object-cover border border-primary"
                      @error="handleImageError"
                    >
                    <span v-else class="text-brand-600 font-medium text-sm">
                      {{ getUserInitials(user.name) }}
                    </span>
                  </div>
                  <div>
                    <div class="text-primary font-medium">{{ user.name }}</div>
                    <div class="text-xs text-secondary">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>

              <!-- معلومات الاتصال -->
              <td class="px-4 py-1">
                <div class="text-primary">{{ user.email }}</div>
                <div class="text-xs text-secondary">{{ user.phone || 'غير محدد' }}</div>
              </td>

              <!-- الدور والحالة -->
              <td class="px-4 py-1">
                <div class="space-y-2">
                  <span :class="roleBadgeClass(user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getRoleText(user.role) }}
                  </span>
                  <div>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      نشط
                    </span>
                  </div>
                </div>
              </td>

              <!-- تاريخ الانضمام -->
              <td class="px-4 py-1">
                <div class="text-primary text-sm">{{ formatDate(user.joined_at || user.created_at) }}</div>
                <div class="text-xs text-secondary">{{ formatTimeAgo(user.joined_at || user.created_at) }}</div>
              </td>

              <!-- الإجراءات -->
              <td class="px-4 py-1">
                <div class="flex items-center gap-3">
                  <button 
                    @click="viewUserDetails(user)"
                    class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                    title="عرض التفاصيل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button 
                    @click="editUser(user)"
                    class="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
                    title="تعديل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    @click="confirmDeleteUser(user)"
                    class="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                    title="حذف"
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
          v-for="user in userStore.items" 
          :key="user.id"
          class="bg-secondary rounded-lg p-4 border border-primary"
        >
          <!-- رأس البطاقة -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                <img 
                  v-if="user.avatar" 
                  :src="getImageUrl(user.avatar)" 
                  :alt="user.name"
                  class="w-12 h-12 rounded-full object-cover border border-primary"
                  @error="handleImageError"
                >
                <span v-else class="text-brand-600 font-medium text-sm">
                  {{ getUserInitials(user.name) }}
                </span>
              </div>
              <div>
                <div class="text-primary font-medium">{{ user.name }}</div>
                <div class="text-xs text-secondary">ID: {{ user.id }}</div>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              نشط
            </span>
          </div>

          <!-- معلومات الاتصال -->
          <div class="space-y-2 mb-3">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </span>
              <span class="text-primary direction-ltr">{{ user.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="text-secondary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </span>
              <span class="text-primary">{{ user.phone || 'غير محدد' }}</span>
            </div>
          </div>

          <!-- الدور وتاريخ الانضمام -->
          <div class="flex items-center justify-between mb-4">
            <span :class="roleBadgeClass(user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ getRoleText(user.role) }}
            </span>
            <div class="text-xs text-secondary text-left">
              {{ formatDate(user.joined_at || user.created_at) }}
            </div>
          </div>

          <!-- الإجراءات -->
          <div class="flex items-center justify-between pt-3 border-t border-primary">
            <div class="flex items-center gap-3">
              <button 
                @click="viewUserDetails(user)"
                class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                title="عرض التفاصيل"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button 
                @click="editUser(user)"
                class="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
                title="تعديل"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
            <button 
              @click="confirmDeleteUser(user)"
              class="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
              title="حذف"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- حالة عدم وجود بيانات -->
      <div v-if="userStore.items.length === 0" class="text-center py-12 text-secondary">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-primary mb-2">لا يوجد مستخدمين</h3>
        <p class="text-sm text-secondary mb-4">ابدأ بإضافة مستخدم جديد.</p>
        <button 
          @click="openAddModal"
          class="bg-brand-500 hover:bg-[#8FAE2F] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          إضافة مستخدم جديد
        </button>
      </div>
    </div>

    <!-- الترقيم -->
    <div v-if="userStore.pagination && userStore.items.length > 0" class="mt-4 bg-tertiary px-4 py-1 rounded-lg border border-primary">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary rounded-lg border border-primary">
        <!-- معلومات الصفحة -->
        <div class="text-sm text-secondary">
          عرض {{ userStore.pagination.from }} - {{ userStore.pagination.to }} من إجمالي {{ userStore.pagination.total }} مستخدم
        </div>

        <!-- أزرار التنقل -->
        <div class="flex items-center gap-1 order-first sm:order-none">
          <!-- زر الصفحة الأولى -->
          <button 
            @click="goToPage(1)"
            :disabled="userStore.pagination.current_page === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              userStore.pagination.current_page === 1 
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
            @click="goToPage(userStore.pagination.current_page - 1)"
            :disabled="userStore.pagination.current_page === 1"
            :class="[
              'p-2 rounded-lg border transition-colors',
              userStore.pagination.current_page === 1 
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
                page === userStore.pagination.current_page
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
            @click="goToPage(userStore.pagination.current_page + 1)"
            :disabled="userStore.pagination.current_page === userStore.pagination.last_page"
            :class="[
              'p-2 rounded-lg border transition-colors',
              userStore.pagination.current_page === userStore.pagination.last_page
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
            @click="goToPage(userStore.pagination.last_page)"
            :disabled="userStore.pagination.current_page === userStore.pagination.last_page"
            :class="[
              'p-2 rounded-lg border transition-colors',
              userStore.pagination.current_page === userStore.pagination.last_page
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
            :value="userStore.pagination.per_page"
            @change="updateItemsPerPage(parseInt($event.target.value))"
            class="px-3 py-2 rounded-lg border border-primary bg-primary text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors cursor-pointer min-w-[80px]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span class="text-sm text-secondary">لكل صفحة</span>
        </div>
      </div>
    </div>

    <!-- مودال إضافة/تعديل المستخدم -->
    <div 
      v-if="showAddModal || showEditModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-primary rounded-xl border border-primary shadow-lg flex flex-col" style="max-height: 90vh;">
        <!-- رأس الـ Modal ثابت -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-primary bg-primary rounded-t-xl flex-shrink-0">
          <h2 class="text-lg sm:text-xl font-semibold text-primary">
            {{ selectedUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد' }}
          </h2>
          <button 
            @click="closeModal"
            class="text-secondary hover:text-primary transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-tertiary"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- محتوى الـ Modal مع تمرير -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <form @submit.prevent="handleSaveUser" class="space-y-6">
            <!-- المعلومات الأساسية -->
            <div class="space-y-4">
              <!-- حقل الصورة -->
              <div class="flex items-center gap-4 mb-4">
                <div class="flex-shrink-0">
                  <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center border-2 border-dashed border-primary overflow-hidden">
                    <img 
                      v-if="form.avatarPreview || form.avatar" 
                      :src="form.avatarPreview || getImageUrl(form.avatar)" 
                      class="w-20 h-20 rounded-full object-cover"
                      @error="handleModalImageError"
                    >
                    <svg v-else class="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-primary mb-2">صورة الملف الشخصي</label>
                  <input 
                    type="file" 
                    ref="avatarInput"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  />
                  <p class="text-xs text-secondary mt-1">يمكنك رفع صورة JPG, PNG, أو GIF (اختياري)</p>
                  <button 
                    v-if="form.avatarPreview || form.avatar"
                    type="button"
                    @click="removeAvatar"
                    class="text-red-600 hover:text-red-800 text-xs mt-2 transition-colors"
                  >
                    حذف الصورة
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-primary mb-2">الاسم الكامل *</label>
                  <input 
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors placeholder:text-secondary"
                    placeholder="أدخل الاسم الكامل"
                    @blur="validateField('name')"
                  />
                  <div v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-primary mb-2">البريد الإلكتروني *</label>
                  <input 
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors placeholder:text-secondary direction-ltr"
                    placeholder="example@email.com"
                    @blur="validateField('email')"
                  />
                  <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-primary mb-2">الدور *</label>
                  <select 
                    v-model="form.role"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors cursor-pointer"
                    @change="validateField('role')"
                  >
                    <option value="" disabled selected>اختر الدور</option>
                    <option value="Admin">مدير</option>
                    <option value="Therapist">معالج</option>
                    <option value="Client">عميل</option>
                  </select>
                  <div v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-primary mb-2">رقم الهاتف</label>
                  <input 
                    v-model="form.phone"
                    type="tel"
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors placeholder:text-secondary direction-ltr"
                    placeholder="+966 5X XXX XXXX"
                    @blur="validateField('phone')"
                  />
                  <div v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</div>
                </div>
              </div>

              <!-- حقل كلمة المرور -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-primary mb-2">
                    كلمة المرور {{ selectedUser ? '(اتركه فارغاً للحفاظ على كلمة المرور الحالية)' : '*' }}
                  </label>
                  <div class="relative">
                    <input 
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      :required="!selectedUser"
                      class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors placeholder:text-secondary direction-ltr pr-10"
                      placeholder="أدخل كلمة المرور"
                      @blur="validateField('password')"
                    />
                    <button 
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-tertiary"
                      :title="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="mt-1 text-xs text-secondary">
                    {{ showPassword ? 'كلمة المرور مرئية' : 'كلمة المرور مخفية' }}
                  </div>
                  <div v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
                </div>
              </div>

              <!-- حقل السيرة الذاتية -->
              <div>
                <label class="block text-sm font-medium text-primary mb-2">السيرة الذاتية</label>
                <textarea 
                  v-model="form.bio"
                  rows="3"
                  maxlength="500"
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors placeholder:text-secondary resize-none"
                  placeholder="أدخل وصفاً عن المستخدم..."
                />
                <div class="mt-1 text-xs text-secondary text-left">
                  {{ form.bio?.length || 0 }}/500
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- تذييل الـ Modal ثابت -->
        <div class="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-primary bg-primary rounded-b-xl flex-shrink-0">
          <button 
            type="button"
            @click="closeModal"
            class="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-tertiary transition-colors text-sm font-medium"
          >
            إلغاء
          </button>
          <button 
            type="submit"
            @click="handleSaveUser"
            :disabled="saving || hasErrors"
            :class="[
              'px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2',
              saving || hasErrors
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-brand-500 hover:bg-[#8FAE2F]'
            ]"
          >
            <svg v-if="saving" class="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.536 7.464l2.828 2.828M6.344 17.656l-2.828 2.828"/>
            </svg>
            {{ saving ? 'جاري الحفظ...' : (selectedUser ? 'تحديث' : 'إضافة') }}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال تأكيد الحذف -->
    <div 
      v-if="showDeleteModal && userToDelete" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      @click.self="closeDeleteModal"
    >
      <div class="w-full max-w-md bg-primary rounded-xl border border-primary shadow-lg">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-primary">تأكيد الحذف</h2>
          </div>
          
          <p class="text-primary mb-6">
            هل أنت متأكد من حذف المستخدم 
            <span class="font-semibold text-red-600">"{{ userToDelete.name }}"</span>؟
            <br>
            <span class="text-sm text-secondary">هذا الإجراء لا يمكن التراجع عنه.</span>
          </p>

          <div class="flex items-center justify-end gap-3">
            <button 
              @click="closeDeleteModal"
              class="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-tertiary transition-colors text-sm font-medium"
            >
              إلغاء
            </button>
            <button 
              @click="deleteUser"
              :disabled="deleting"
              :class="[
                'px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2',
                deleting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              ]"
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

    <!-- مودال عرض التفاصيل -->
    <div 
      v-if="showDetailsModal && selectedUser" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      @click.self="closeDetailsModal"
    >
      <div class="w-full max-w-2xl bg-primary rounded-xl border border-primary shadow-lg flex flex-col" style="max-height: 90vh;">
        <!-- رأس الـ Modal ثابت -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-primary bg-primary rounded-t-xl flex-shrink-0">
          <h2 class="text-lg sm:text-xl font-semibold text-primary">تفاصيل المستخدم</h2>
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
          <div class="space-y-6">
            <!-- معلومات المستخدم -->
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center border-2 border-primary overflow-hidden">
                  <img 
                    v-if="selectedUser.avatar" 
                    :src="getImageUrl(selectedUser.avatar)" 
                    :alt="selectedUser.name"
                    class="w-20 h-20 rounded-full object-cover"
                    @error="handleModalImageError"
                  >
                  <span v-else class="text-brand-600 font-medium text-lg">
                    {{ getUserInitials(selectedUser.name) }}
                  </span>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-primary">{{ selectedUser.name }}</h3>
                <p class="text-secondary text-sm mt-1">ID: {{ selectedUser.id }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span :class="roleBadgeClass(selectedUser.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getRoleText(selectedUser.role) }}
                  </span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    نشط
                  </span>
                </div>
              </div>
            </div>

            <!-- معلومات الاتصال -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="text-md font-semibold text-primary border-b border-primary pb-2">معلومات الاتصال</h4>
                
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center text-secondary">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-secondary">البريد الإلكتروني</div>
                      <div class="text-sm text-primary direction-ltr">{{ selectedUser.email }}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center text-secondary">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-secondary">رقم الهاتف</div>
                      <div class="text-sm text-primary">{{ selectedUser.phone || 'غير محدد' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-md font-semibold text-primary border-b border-primary pb-2">معلومات إضافية</h4>
                
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center text-secondary">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-secondary">تاريخ الانضمام</div>
                      <div class="text-sm text-primary">{{ formatDate(selectedUser.joined_at || selectedUser.created_at) }}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center text-secondary">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-secondary">آخر تحديث</div>
                      <div class="text-sm text-primary">{{ formatTimeAgo(selectedUser.updated_at || selectedUser.joined_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- السيرة الذاتية -->
            <div class="space-y-4" v-if="selectedUser.bio">
              <h4 class="text-md font-semibold text-primary border-b border-primary pb-2">السيرة الذاتية</h4>
              <p class="text-sm text-primary leading-relaxed bg-tertiary p-4 rounded-lg border border-primary">
                {{ selectedUser.bio }}
              </p>
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
            @click="editUser(selectedUser)"
            class="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-[#8FAE2F] text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            تعديل
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'

export default {
  name: 'UsersManagement',
  
  setup() {
    const userStore = useUserStore()
    
    // حالة البحث والتصفية
    const search = ref('')
    const role = ref('')
    
    // حالة الـ Modals
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showDetailsModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedUser = ref(null)
    const userToDelete = ref(null)
    const saving = ref(false)
    const deleting = ref(false)
    const showPassword = ref(false)
    const avatarInput = ref(null)
    
    // نموذج البيانات
    const form = ref({
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      bio: '',
      avatar: null,
      avatarFile: null,
      avatarPreview: null
    })

    // أخطاء التحقق
    const errors = ref({
      name: '',
      email: '',
      phone: '',
      role: '',
      password: ''
    })

    // الإشعارات
    const notification = ref({
      show: false,
      type: 'success', // success, error, info
      message: ''
    })

    // تحميل البيانات الأولية
    onMounted(() => {
      userStore.fetchUsers()
    })

    // التحقق من وجود أخطاء
    const hasErrors = computed(() => {
      return Object.values(errors.value).some(error => error !== '')
    })

    // الصفحات المرئية في الترقيم
    const visiblePages = computed(() => {
      if (!userStore.pagination) return []
      
      const pages = []
      const total = userStore.pagination.last_page
      const current = userStore.pagination.current_page
      
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

    // دوال التحقق من الصحة
    const validateField = (field) => {
      switch (field) {
        case 'name':
          if (!form.value.name.trim()) {
            errors.value.name = 'الاسم مطلوب'
          } else if (form.value.name.length < 2) {
            errors.value.name = 'الاسم يجب أن يكون على الأقل حرفين'
          } else {
            errors.value.name = ''
          }
          break
        
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!form.value.email.trim()) {
            errors.value.email = 'البريد الإلكتروني مطلوب'
          } else if (!emailRegex.test(form.value.email)) {
            errors.value.email = 'البريد الإلكتروني غير صحيح'
          } else {
            errors.value.email = ''
          }
          break
        
        case 'phone':
          if (form.value.phone && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(form.value.phone)) {
            errors.value.phone = 'رقم الهاتف غير صحيح'
          } else {
            errors.value.phone = ''
          }
          break
        
        case 'role':
          if (!form.value.role) {
            errors.value.role = 'الدور مطلوب'
          } else {
            errors.value.role = ''
          }
          break
        
        case 'password':
          if (!selectedUser.value && !form.value.password) {
            errors.value.password = 'كلمة المرور مطلوبة'
          } else if (form.value.password && form.value.password.length < 8) {
            errors.value.password = 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'
          } else {
            errors.value.password = ''
          }
          break
      }
    }

    const validateForm = () => {
      validateField('name')
      validateField('email')
      validateField('phone')
      validateField('role')
      validateField('password')
      return !hasErrors.value
    }

    // إظهار الإشعارات
    const showNotification = (type, message) => {
      notification.value = {
        show: true,
        type,
        message
      }
      setTimeout(() => {
        hideNotification()
      }, 5000)
    }

    const hideNotification = () => {
      notification.value.show = false
    }

    // البحث والتصفية
    const handleSearch = () => {
      userStore.fetchUsers({
        search: search.value,
        role: role.value
      })
    }

    const handleFilter = () => {
      userStore.fetchUsers({
        search: search.value,
        role: role.value
      })
    }

    // التنقل بين الصفحات
    const goToPage = (page) => {
      if (userStore.pagination && page >= 1 && page <= userStore.pagination.last_page) {
        userStore.fetchUsers({
          search: search.value,
          role: role.value,
          page: page,
          per_page: userStore.pagination.per_page
        })
      }
    }

    const updateItemsPerPage = (perPage) => {
      userStore.fetchUsers({
        search: search.value,
        role: role.value,
        page: 1,
        per_page: perPage
      })
    }

    // إدارة الـ Modals
    const openAddModal = () => {
      resetForm()
      showAddModal.value = true
    }

    const editUser = (user) => {
      selectedUser.value = user
      form.value = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        password: '',
        bio: user.bio || '',
        avatar: user.avatar || null,
        avatarFile: null,
        avatarPreview: user.avatar ? getImageUrl(user.avatar) : null
      }
      showEditModal.value = true
      showDetailsModal.value = false
    }

    const viewUserDetails = (user) => {
      selectedUser.value = user
      showDetailsModal.value = true
    }

    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteModal.value = true
    }

    const deleteUser = async () => {
      if (!userToDelete.value) return
      
      deleting.value = true
      try {
        await userStore.deleteUser(userToDelete.value.id)
        showNotification('success', `تم حذف المستخدم "${userToDelete.value.name}" بنجاح`)
        closeDeleteModal()
      } catch (error) {
        console.error('خطأ في حذف المستخدم:', error)
        showNotification('error', 'حدث خطأ أثناء حذف المستخدم: ' + error.message)
      } finally {
        deleting.value = false
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      resetForm()
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }

    const closeDetailsModal = () => {
      showDetailsModal.value = false
      selectedUser.value = null
    }

    const resetForm = () => {
      form.value = {
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        bio: '',
        avatar: null,
        avatarFile: null,
        avatarPreview: null
      }
      errors.value = {
        name: '',
        email: '',
        phone: '',
        role: '',
        password: ''
      }
      selectedUser.value = null
      showPassword.value = false
      if (avatarInput.value) {
        avatarInput.value.value = ''
      }
    }

    // حفظ المستخدم
    const handleSaveUser = async () => {
      if (!validateForm()) {
        showNotification('error', 'يرجى تصحيح الأخطاء في النموذج')
        return
      }

      saving.value = true
      
      try {
        const formData = new FormData()
        
        // إضافة الحقول الأساسية
        formData.append('name', form.value.name)
        formData.append('email', form.value.email)
        formData.append('role', form.value.role)
        formData.append('phone', form.value.phone || '')
        formData.append('bio', form.value.bio || '')
        
        // إضافة كلمة المرور فقط إذا كانت موجودة
        if (form.value.password) {
          formData.append('password', form.value.password)
        }
        
        // إضافة الصورة إذا كانت موجودة
        if (form.value.avatarFile) {
          formData.append('avatar', form.value.avatarFile)
        }
        
        // إذا كان هناك صورة مسبقاً وتم حذفها
        if (selectedUser.value && form.value.avatar === null && !form.value.avatarFile) {
          formData.append('remove_avatar', 'true')
        }
        
        let result
        if (selectedUser.value) {
          // استخدم _method=PUT للتحديث
          formData.append('_method', 'PUT')
          result = await userStore.updateUser(selectedUser.value.id, formData)
          showNotification('success', `تم تحديث المستخدم "${form.value.name}" بنجاح`)
        } else {
          result = await userStore.createUser(formData)
          showNotification('success', `تم إضافة المستخدم "${form.value.name}" بنجاح`)
        }
        
        // إعادة تحميل البيانات
        await userStore.fetchUsers({
          search: search.value,
          role: role.value
        })
        
        closeModal()
      } catch (error) {
        console.error('Error saving user:', error)
        showNotification('error', 'حدث خطأ أثناء حفظ البيانات: ' + error.message)
      } finally {
        saving.value = false
      }
    }

    // رفع الصورة
    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // التحقق من حجم الصورة (2MB كحد أقصى)
        if (file.size > 2 * 1024 * 1024) {
          showNotification('error', 'حجم الصورة يجب أن يكون أقل من 2MB')
          return
        }
        
        // التحقق من نوع الصورة
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          showNotification('error', 'نوع الصورة غير مدعوم. يرجى استخدام JPG, PNG, GIF أو WebP')
          return
        }
        
        form.value.avatarFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          form.value.avatarPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    // حذف الصورة
    const removeAvatar = () => {
      form.value.avatar = null
      form.value.avatarFile = null
      form.value.avatarPreview = null
      if (avatarInput.value) {
        avatarInput.value.value = ''
      }
    }

    // معالجة أخطاء الصور
    const handleImageError = (event) => {
      console.error('خطأ في تحميل صورة الجدول:', event.target.src)
      event.target.style.display = 'none'
    }

    const handleModalImageError = (event) => {
      console.error('خطأ في تحميل صورة المودال:', event.target.src)
      event.target.style.display = 'none'
    }

    // دوال مساعدة
    const getImageUrl = (path) => {
      if (!path) return null
      if (path.startsWith('http')) return path
      if (path.startsWith('storage/')) return `/${path}`
      return `/storage/${path}`
    }

    const getUserInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getRoleText = (role) => {
      const roles = {
        'Admin': 'مدير',
        'Therapist': 'معالج',
        'Client': 'عميل'
      }
      return roles[role] || role
    }

    const roleBadgeClass = (role) => {
      const classes = {
        'Admin': 'bg-purple-100 text-purple-800',
        'Therapist': 'bg-blue-100 text-blue-800',
        'Client': 'bg-gray-100 text-gray-800'
      }
      return classes[role] || 'bg-gray-100 text-gray-800'
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
      userStore,
      search,
      role,
      
      // الـ Modals
      showAddModal,
      showEditModal,
      showDetailsModal,
      showDeleteModal,
      selectedUser,
      userToDelete,
      saving,
      deleting,
      showPassword,
      avatarInput,
      
      // النموذج والأخطاء
      form,
      errors,
      notification,
      
      // البيانات المحسوبة
      visiblePages,
      hasErrors,
      
      // الدوال
      handleSearch,
      handleFilter,
      goToPage,
      updateItemsPerPage,
      openAddModal,
      editUser,
      viewUserDetails,
      confirmDeleteUser,
      deleteUser,
      closeModal,
      closeDeleteModal,
      closeDetailsModal,
      handleSaveUser,
      handleImageUpload,
      removeAvatar,
      handleImageError,
      handleModalImageError,
      validateField,
      showNotification,
      hideNotification,
      getImageUrl,
      getUserInitials,
      getRoleText,
      roleBadgeClass,
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

/* تحسينات التمرير */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>