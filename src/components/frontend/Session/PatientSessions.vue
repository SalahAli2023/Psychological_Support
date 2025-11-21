<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4 space-x-reverse">
            <h1 class="text-lg font-semibold text-gray-900">جلساتي</h1>
          </div>
          <div class="flex items-center space-x-3 space-x-reverse">
            <span class="text-gray-600 text-sm">{{ patientName }}</span>
            <div class="avatar-container">
              <img v-if="patientAvatar" :src="patientAvatar" alt="Patient" class="w-8 h-8 rounded-full">
              <div v-else class="default-avatar patient">
                <i class="fas fa-user"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-8 space-x-reverse">
          <router-link 
            to="/" 
            class="py-3 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
          >
            الرئيسية
          </router-link>
          <router-link 
            to="/sessions" 
            class="py-3 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 mr-8"
          >
            الجلسات
          </router-link>
          <router-link 
            to="/profile" 
            class="py-3  mx-6 text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
          >
            الملف الشخصي
          </router-link>
        </div>
      </div>
    </nav>

<!-- Main Content -->
<main class="max-w-7xl mx-auto px-4 py-6">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Profile Section -->
    <div class="lg:col-span-1">
      <div class="sticky top-24 space-y-4">
        <!-- Profile Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <!-- Profile Header -->
          <div class="text-center mb-4">
            <div class="avatar-container large mb-4">
              <img v-if="patient.avatar" :src="patient.avatar" alt="Patient" class="w-20 h-20 rounded-full mx-auto border-2 border-brand-500">
              <div v-else class="default-avatar patient large">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <h2 class="font-semibold text-gray-900 mb-2">{{ patient.name }}</h2>
            <p class="text-gray-500 text-sm">{{ patient.age }} سنة</p>
          </div>

          <!-- Profile Stats -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-xl font-bold text-brand-500 mb-1">{{ patient.totalSessions }}</p>
              <p class="text-gray-600 text-xs">الجلسات</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-xl font-bold text-brand-500 mb-1">{{ patient.attendanceRate }}%</p>
              <p class="text-gray-600 text-xs">الحضور</p>
            </div>
          </div>

          <!-- Progress -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">تقدم العلاج</span>
              <span class="text-sm text-brand-500">{{ patient.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: patient.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Current Therapist -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="font-medium text-gray-900 mb-4">المعالج الحالي</h4>
            <div class="flex items-center space-x-4 space-x-reverse">
              <div class="avatar-container">
                <img v-if="patient.therapist.avatar" :src="patient.therapist.avatar" :alt="patient.therapist.name" class="w-12 h-12 rounded-full">
                <div v-else class="default-avatar therapist">
                  <i class="fas fa-user-md"></i>
                </div>
              </div>
              <div class="flex-1 mr-3">
                <p class="font-medium text-gray-900 text-sm mb-2">د. عمرو عادل</p>
                <p class="text-gray-500 text-xs">العلاج المعرفي السلوكي</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-2">
          <button @click="showEditProfileModal = true" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-right hover:bg-gray-50 text-sm transition-colors flex items-center justify-between">
            <span class="flex items-center">
              <i class="fas fa-edit ml-3 text-brand-500"></i>
              تعديل الملف الشخصي
            </span>
            <i class="fas fa-chevron-left text-gray-400 text-xs"></i>
          </button>
          <button @click="showProgressModal = true" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-right hover:bg-gray-50 text-sm transition-colors flex items-center justify-between">
            <span class="flex items-center">
              <i class="fas fa-chart-line ml-3 text-brand-500"></i>
              عرض التقدم الكامل
            </span>
            <i class="fas fa-chevron-left text-gray-400 text-xs"></i>
          </button>
          <button @click="showSupportModal = true" class="w-full bg-white border border-gray-200 rounded-lg p-3 text-right hover:bg-gray-50 text-sm transition-colors flex items-center justify-between">
            <span class="flex items-center">
              <i class="fas fa-headset ml-3 text-brand-500"></i>
              التواصل مع الدعم
            </span>
            <i class="fas fa-chevron-left text-gray-400 text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Sessions Section -->
    <div class="lg:col-span-3">
      <!-- Page Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">الجلسات القادمة</h2>
        <p class="text-gray-600">إدارة وتتبع جلساتك العلاجية</p>
      </div>

      <!-- Upcoming Sessions -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-calendar-alt ml-3 text-brand-500"></i>
          الجلسات القادمة
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="session in upcomingSessions" 
            :key="session.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            :class="{ 'border-brand-500 border-2': session.status === 'active' }"
          >
            <!-- Therapist Info -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4 space-x-reverse">
                <div class="avatar-container">
                  <img v-if="session.therapist.avatar" :src="session.therapist.avatar" :alt="session.therapist.name" class="w-12 h-12 rounded-full">
                  <div v-else class="default-avatar therapist">
                    <i class="fas fa-user-md"></i>
                  </div>
                </div>
                <div class="mr-3">
                  <h4 class="font-semibold text-gray-900 mb-2">د. عمرو عادل</h4>
                  <span class="text-gray-500 text-sm">{{ session.type }}</span>
                </div>
              </div>
              <span 
                class="text-xs px-3 py-1 rounded-full font-medium"
                :class="{
                  'bg-brand-50 text-brand-700': session.status === 'active',
                  'bg-accent-50 text-accent-700': session.status === 'pending'
                }"
              >
                {{ getStatusText(session.status) }}
              </span>
            </div>

            <!-- Session Details -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center text-gray-600 text-sm">
                <i class="fas fa-clock ml-3 text-brand-500 w-4"></i>
                <span>{{ formatDate(session.date) }} - {{ session.time }}</span>
              </div>
              <div class="flex items-center text-gray-600 text-sm">
                <i class="fas fa-stopwatch ml-3 text-brand-500 w-4"></i>
                <span>{{ session.duration }} دقيقة</span>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-700 text-sm mb-6 leading-relaxed">{{ session.description }}</p>

            <!-- Join Button -->
            <button 
              v-if="session.status === 'active'"
              @click="joinSession(session)"
              class="w-full bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse"
            >
              <i class="fas fa-video"></i>
              <span>انضم إلى الجلسة</span>
            </button>

            <!-- Countdown -->
            <div v-else class="text-center py-3 bg-accent-50 rounded-lg border border-accent-200">
              <div class="text-accent-700 text-sm flex items-center justify-center space-x-2 space-x-reverse">
                <i class="fas fa-hourglass-half"></i>
                <span>تبدأ بعد: {{ getTimeRemaining(session) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Previous Sessions -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-history ml-3 text-gray-600"></i>
          الجلسات السابقة
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="session in previousSessions" 
            :key="session.id"
            class="bg-white border border-gray-200 rounded-lg p-6 opacity-75 hover:opacity-100 transition-all"
          >
            <!-- Therapist Info -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4 space-x-reverse">
                <div class="avatar-container">
                  <img v-if="session.therapist.avatar" :src="session.therapist.avatar" :alt="session.therapist.name" class="w-12 h-12 rounded-full">
                  <div v-else class="default-avatar therapist">
                    <i class="fas fa-user-md"></i>
                  </div>
                </div>
                <div class="mr-3">
                  <h4 class="font-semibold text-gray-900 mb-2">د. عمرو عادل</h4>
                  <span class="text-gray-500 text-sm">{{ session.type }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-1 space-x-reverse">
                <i 
                  v-for="star in 5" 
                  :key="star"
                  class="fas fa-star text-sm"
                  :class="star <= session.rating ? 'text-yellow-400' : 'text-gray-300'"
                ></i>
              </div>
            </div>

            <!-- Session Details -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center text-gray-600 text-sm">
                <i class="fas fa-calendar ml-3 text-brand-500 w-4"></i>
                <span>{{ formatDate(session.date) }}</span>
              </div>
            </div>

            <button 
              @click="viewSessionNotes(session)"
              class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center justify-center space-x-2 space-x-reverse"
            >
              <i class="fas fa-eye"></i>
              <span>عرض الملاحظات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

    <!-- No Sessions Message -->
    <div v-if="upcomingSessions.length === 0 && previousSessions.length === 0" 
         class="text-center py-16">
      <div class="default-avatar large empty-state mb-6">
        <i class="fas fa-calendar-times"></i>
      </div>
      <h3 class="text-gray-600 text-lg mb-3">لا توجد جلسات</h3>
      <p class="text-gray-500">لا توجد جلسات مسجلة حالياً</p>
    </div>

    <!-- Edit Profile Modal -->
     
    <div v-if="showEditProfileModal" class="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md border border-gray-200 shadow-xl">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="font-semibold text-gray-900">تعديل الملف الشخصي</h3>
          <button @click="showEditProfileModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input v-model="editProfileData.name" type="text" class="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">العمر</label>
            <input v-model="editProfileData.age" type="number" class="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input v-model="editProfileData.email" type="email" class="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input v-model="editProfileData.phone" type="tel" class="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors">
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <button @click="saveProfile" class="flex-1 bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 font-medium transition-colors">
              حفظ التغييرات
            </button>
            <button @click="showEditProfileModal = false" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl border border-gray-200 shadow-xl">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="font-semibold text-gray-900">التقدم الكامل في العلاج</h3>
          <button @click="showProgressModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-3">مستوى القلق</h4>
              <div class="h-40 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-400">
                رسم بياني للقلق
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-3">مستوى الاكتئاب</h4>
              <div class="h-40 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-400">
                رسم بياني للاكتئاب
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 class="font-medium text-gray-900 mb-3">ملخص التقدم</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <p>• تحسن ملحوظ في إدارة القلق بنسبة 40%</p>
              <p>• انخفاض في أعراض الاكتئاب بنسبة 25%</p>
              <p>• زيادة في معدل الحضور للجلسات</p>
              <p>• تحسن في جودة النوم والحياة اليومية</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Modal -->
    <div v-if="showSupportModal" class="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md border border-gray-200 shadow-xl">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="font-semibold text-gray-900">فريق الدعم الفني</h3>
          <button @click="showSupportModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-4 space-y-4">
          <div class="text-center">
            <div class="default-avatar support large mb-3 mx-auto">
              <i class="fas fa-headset"></i>
            </div>
            <h4 class="font-medium text-gray-900 mb-2">فريق الدعم متاح 24/7</h4>
            <p class="text-gray-600 text-sm">نحن هنا لمساعدتك في أي وقت</p>
          </div>
          
          <div class="space-y-3">
            <button @click="contactSupport('whatsapp')" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center space-x-2 space-x-reverse transition-colors">
              <i class="fab fa-whatsapp"></i>
              <span>واتساب</span>
            </button>
            
            <button @click="contactSupport('phone')" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center space-x-2 space-x-reverse transition-colors">
              <i class="fas fa-phone"></i>
              <span>اتصال هاتفي</span>
            </button>
            
            <button @click="contactSupport('email')" class="w-full bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 font-medium flex items-center justify-center space-x-2 space-x-reverse transition-colors">
              <i class="fas fa-envelope"></i>
              <span>بريد إلكتروني</span>
            </button>
          </div>
          
          <div class="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            <p>رقم الدعم: <span class="font-medium">9200XXXXX</span></p>
            <p>البريد الإلكتروني: <span class="font-medium">support@therapy.com</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientSessions',
  data() {
    return {
      patientName: 'أحمد محمد',
      patientAvatar: null,
      showEditProfileModal: false,
      showProgressModal: false,
      showSupportModal: false,
      editProfileData: {
        name: 'أحمد محمد',
        age: 32,
        email: 'ahmed@example.com',
        phone: '+966500000000'
      },
      patient: {
        name: 'أحمد محمد',
        age: 32,
        avatar: null,
        totalSessions: 12,
        attendanceRate: 92,
        progress: 65,
        therapist: {
          name: 'د. عمرو عادل',
          avatar: null,
          specialization: 'العلاج المعرفي السلوكي'
        }
      },
      upcomingSessions: [
        {
          id: 1,
          therapist: {
            name: 'د. عمرو عادل',
            avatar: null
          },
          type: 'جلسة فردية',
          date: '2024-01-15',
          time: '14:00',
          duration: 45,
          status: 'active',
          description: 'جلسة متابعة للعلاج المعرفي السلوكي'
        },
        {
          id: 2,
          therapist: {
            name: 'د. سارة أحمد',
            avatar: null
          },
          type: 'جلسة جماعية',
          date: '2024-01-20',
          time: '16:00',
          duration: 60,
          status: 'pending',
          description: 'جلسة دعم جماعي لإدارة القلق'
        }
      ],
      previousSessions: [
        {
          id: 3,
          therapist: {
            name: 'د. عمرو عادل',
            avatar: null
          },
          type: 'جلسة تقييم',
          date: '2024-01-08',
          rating: 4
        },
        {
          id: 4,
          therapist: {
            name: 'د. سارة أحمد',
            avatar: null
          },
          type: 'جلسة فردية',
          date: '2024-01-01',
          rating: 5
        }
      ]
    }
  },
  methods: {
    joinSession(session) {
      console.log('Joining session:', session.id)
    },
    
    viewSessionNotes(session) {
      this.$router.push(`/session-notes/${session.id}`)
    },
    
    saveProfile() {
      // حفظ بيانات الملف الشخصي
      console.log('Saving profile:', this.editProfileData)
      this.showEditProfileModal = false
    },
    
    contactSupport(method) {
      console.log('Contacting support via:', method)
      this.showSupportModal = false
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ar-SA')
    },
    
    getStatusText(status) {
      const statusMap = {
        'active': 'نشطة الآن',
        'pending': 'قيد الانتظار'
      }
      return statusMap[status]
    },
    
    getTimeRemaining(session) {
      return '2 يوم 5 ساعات'
    }
  }
}
</script>

<style>
/* Custom CSS for the color variables */
:root {
  --brand-500: #9EBF3B;
  --brand-600: #8cad35;
  --brand-50: #f0fdf4;
  --brand-700: #166534;
  --accent-500: #D6A29A;
  --accent-600: #c99188;
  --accent-50: #fdf2f2;
  --accent-200: #fbcfe8;
  --accent-700: #be185d;
}

.bg-brand-500 { background-color: var(--brand-500); }
.hover\:bg-brand-600:hover { background-color: var(--brand-600); }
.text-brand-500 { color: var(--brand-500); }
.border-brand-500 { border-color: var(--brand-500); }
.bg-brand-50 { background-color: var(--brand-50); }
.text-brand-700 { color: var(--brand-700); }

.bg-accent-50 { background-color: var(--accent-50); }
.text-accent-700 { color: var(--accent-700); }
.border-accent-200 { border-color: var(--accent-200); }

/* Default Avatar Styles */
.default-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}

.default-avatar.patient {
  background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
}

.default-avatar.therapist {
  background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
}

.default-avatar.support {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
}

.default-avatar.large {
  width: 80px;
  height: 80px;
  font-size: 2rem;
}

.default-avatar:not(.large) {
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
}

.default-avatar.empty-state {
  width: 100px;
  height: 100px;
  font-size: 3rem;
  background: #e5e7eb;
  color: #9ca3af;
  margin: 0 auto 1rem;
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container.large .default-avatar {
  width: 80px;
  height: 80px;
  font-size: 2rem;
}
</style>