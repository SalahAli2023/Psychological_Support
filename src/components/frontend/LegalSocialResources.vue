<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <Header />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-28">
            <!-- Page Header -->
            <div class="text-center mb-16 animate-slide-up">
                <h1 class="text-4xl font-bold text-gray-800 mb-6">الموارد القانونية والاجتماعية</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    نقدم لكم مجموعة شاملة من الموارد القانونية والاجتماعية لدعم المرأة والطفل وحماية حقوقهم
                </p>
            </div>

            <!-- Resources Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <!-- Legal Resources -->
                <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.1s">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-14 h-14 bg-gray-200 bg-opacity-10 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-balance-scale text-primary-green text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">الموارد القانونية</h2>
                            <p class="text-gray-600">تشريعات وقوانين حماية المرأة والطفل</p>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- Yemeni Laws Section -->
                        <div class="bg-gradient-to-l from-primary-green/5 to-primary-pink/5 rounded-2xl p-6 border border-primary-green/20">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                                    <i class="fas fa-gavel text-white text-sm"></i>
                                </div>
                                مواد القانون اليمني
                            </h3>
                        
                            <!-- Law Categories Navigation -->
                            <div class="flex flex-wrap gap-3 mb-6">
                                <button 
                                    v-for="category in lawCategories" 
                                    :key="category"
                                    @click="selectCategory(category)"
                                    class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                    :class="selectedCategory === category 
                                        ? 'bg-primary-green text-white shadow-lg' 
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-green hover:text-primary-green'"
                                >
                                    {{ category }}
                                </button>
                            </div>

                            <!-- Laws List -->
                            <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                <div 
                                    v-for="(law, index) in filteredLaws" 
                                    :key="`${law.lawTitle}-${law.id}`"
                                    class="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-green/30 hover:shadow-md transition-all duration-300 group"
                                    :style="`animation-delay: ${index * 0.1}s`"
                                >
                                    <div class="flex justify-between items-start mb-3">
                                        <span class="text-primary-green font-bold text-lg">{{ law.number }}</span>
                                        <span class="text-primary-pink text-xs bg-primary-pink/10 px-3 py-1.5 rounded-full font-medium">{{ law.lawTitle }}</span>
                                    </div>
                                    <p class="text-gray-700 text-right leading-relaxed mb-3 text-lg">{{ law.text }}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{{ law.category }}</span>
                                        <div class="w-2 h-2 bg-primary-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- حقوق المرأة والطفل -->
                        <div class="bg-gradient-to-l from-primary-green/5 to-primary-pink/5 rounded-2xl p-6 border border-primary-green/20">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary-pink rounded-full flex items-center justify-center">
                                    <i class="fas fa-shield-alt text-white text-sm"></i>
                                </div>
                                أبرز الحقوق الخاصة بالمرأة والطفل
                            </h3>
                            <ul class="space-y-4">
                                <li v-for="(right, index) in womenChildrenRights" :key="index" 
                                    class="flex items-center gap-4 p-3 rounded-lg bg-white/50 hover:bg-white transition-all duration-300 transform hover:translate-x-2">
                                    <div class="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <span class="text-gray-700 text-right flex-1">{{ right }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Social Resources -->
                <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 animate-slide-up" style="animation-delay: 0.2s">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-14 h-14 bg-gray-200 bg-opacity-10 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-hands-helping text-primary-pink text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-2">الموارد الاجتماعية</h2>
                            <p class="text-gray-600">برامج دعم ومبادرات مجتمعية</p>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- الدعم المجتمعي -->
                        <div class="bg-gradient-to-l from-primary-pink/5 to-primary-green/5 rounded-2xl p-6 border border-primary-pink/20">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary-pink rounded-full flex items-center justify-center">
                                    <i class="fas fa-users text-white text-sm"></i>
                                </div>
                                الدعم المجتمعي
                            </h3>
                            <ul class="space-y-4">
                                <li v-for="(support, index) in communitySupport" :key="index"
                                    class="flex items-center gap-4 p-3 rounded-lg bg-white/50 hover:bg-white transition-all duration-300 transform hover:translate-x-2">
                                    <div class="w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-heart text-white text-xs"></i>
                                    </div>
                                    <span class="text-gray-700 text-right flex-1">{{ support }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- التربية الإيجابية -->
                        <div class="bg-gradient-to-l from-primary-green/5 to-primary-pink/5 rounded-2xl p-6 border border-primary-green/20">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                                    <i class="fas fa-home text-white text-sm"></i>
                                </div>
                                التربية الإيجابية
                            </h3>
                            <ul class="space-y-4">
                                <li v-for="(education, index) in positiveEducation" :key="index"
                                    class="flex items-center gap-4 p-3 rounded-lg bg-white/50 hover:bg-white transition-all duration-300 transform hover:translate-x-2">
                                    <div class="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                                        <i class="fas fa-star text-white text-xs"></i>
                                    </div>
                                    <span class="text-gray-700 text-right flex-1">{{ education }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="bg-gradient-to-r from-primary-green/10 to-primary-pink/10 rounded-2xl shadow-lg p-8 mb-16 border border-primary-green/20 animate-slide-up" style="animation-delay: 0.3s">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">خطوط المساعدة وخدمات الطوارئ</h2>
                    <p class="text-gray-600 text-lg">تواصل معنا في أي وقت للحصول على المساعدة الفورية</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Emergency Numbers -->
                    <div class="bg-white rounded-2xl p-6 text-center border-2 border-primary-green/20 hover:border-primary-green hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-phone-alt text-white text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">أرقام هواتف الطوارئ</h3>
                        <p class="text-gray-600 text-sm mb-4">خدمات الطوارئ المتاحة 24/7</p>
                        <div class="space-y-3">
                            <div class="text-primary-green font-bold text-xl hover:text-primary-pink transition-colors duration-300">911</div>
                            <div class="text-primary-green font-bold text-xl hover:text-primary-pink transition-colors duration-300">0800-123-456</div>
                        </div>
                    </div>

                    <!-- Direct Chat -->
                    <div class="bg-white rounded-2xl p-6 text-center border-2 border-primary-pink/20 hover:border-primary-pink hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div class="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-comments text-white text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">محادثة مباشرة</h3>
                        <p class="text-gray-600 text-sm mb-4">تواصل فوري مع المركز</p>
                        <button class="bg-primary-pink text-white px-8 py-3 rounded-xl hover:bg-primary-green transform hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                            ابدأ المحادثة
                        </button>
                    </div>

                    <!-- Support Lines -->
                    <div class="bg-white rounded-2xl p-6 text-center border-2 border-primary-green/20 hover:border-primary-green hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div class="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-headset text-white text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">خطوط الدعم</h3>
                        <p class="text-gray-600 text-sm mb-4">خطوط المساعدة والدعم النفسي</p>
                        <div class="space-y-3">
                            <div class="text-primary-green font-bold hover:text-primary-pink transition-colors duration-300">دعم نسائي: 0800-111-222</div>
                            <div class="text-primary-green font-bold hover:text-primary-pink transition-colors duration-300">دعم أطفال: 0800-333-444</div>
                        </div>
                    </div>

                    <!-- Contact Info -->
                    <div class="bg-white rounded-2xl p-6 text-center border-2 border-primary-pink/20 hover:border-primary-pink hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div class="w-16 h-16 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-envelope text-white text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-3">معلومات التواصل</h3>
                        <p class="text-gray-600 text-sm mb-4">البريد والتواصل العام</p>
                        <div class="space-y-3 text-sm">
                            <div class="text-primary-pink hover:text-primary-green transition-colors duration-300 cursor-pointer">info@cswc.org</div>
                            <div class="text-primary-pink hover:text-primary-green transition-colors duration-300 cursor-pointer">support@cswc.org</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Supporting Organizations -->
            <div class="bg-white rounded-2xl shadow-lg p-8 animate-slide-up" style="animation-delay: 0.4s">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">الجهات الداعمة والشركاء</h2>
                    <p class="text-gray-600 text-lg">نعمل مع شبكة من الجهات الداعمة لتقديم أفضل الخدمات</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div v-for="(org, index) in supportingOrganizations" :key="index"
                         class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
                             :class="org.bgColor">
                            <i :class="org.icon" class="text-white text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-800 text-lg">{{ org.name }}</h3>
                        <p class="text-gray-500 text-sm mt-2">{{ org.description }}</p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/frontend/layouts/Header.vue'
import Footer from '@/components/frontend/layouts/Footer.vue'
import { yemeniLaws, getLawCategories } from '@/data/yemeni-laws.js'

const selectedCategory = ref('الأسرة')
const lawCategories = ref([])

// البيانات المحلية
const womenChildrenRights = [
    'الحقوق الأساسية للمرأة في العمل والتعليم',
    'حقوق الطفل في الرعاية والحماية',
    'القوانين الخاصة بحماية المرأة من العنف',
    'التشريعات المتعلقة بالحضانة والنفقة'
]

const communitySupport = [
    'مجموعات دعم للنساء',
    'مجموعات دعم للأطفال والمراهقين',
    'دور المجتمع المدني في حماية المرأة والطفل',
    'برامج التوعية المجتمعية'
]

const positiveEducation = [
    'أساسيات الصحة النفسية للأسرة',
    'الوقاية من العنف الأسري والمجتمعي',
    'مهارات التعامل مع الضغوط اليومية',
    'التعاون بين البيت والمدرسة'
]

const supportingOrganizations = [
    {
        name: 'المستشفيات',
        icon: 'fas fa-hospital',
        bgColor: 'bg-primary-green',
        description: 'الرعاية الصحية والطبية'
    },
    {
        name: 'المحاكم',
        icon: 'fas fa-gavel',
        bgColor: 'bg-primary-pink',
        description: 'الخدمات القضائية والقانونية'
    },
    {
        name: 'الشرطة',
        icon: 'fas fa-shield-alt',
        bgColor: 'bg-primary-green',
        description: 'الحماية والأمن'
    },
    {
        name: 'المدارس',
        icon: 'fas fa-school',
        bgColor: 'bg-primary-pink',
        description: 'التعليم والتوعية'
    }
]

const filteredLaws = computed(() => {
    const allLaws = []
    Object.values(yemeniLaws).forEach(lawCategory => {
        lawCategory.articles.forEach(article => {
            if (article.category === selectedCategory.value) {
                allLaws.push({
                    ...article,
                    lawTitle: lawCategory.title
                })
            }
        })
    })
    return allLaws
})

const selectCategory = (category) => {
    selectedCategory.value = category
}

onMounted(() => {
    lawCategories.value = getLawCategories()
})
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-primary-green) #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-primary-green);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-secondary-green);
}

.animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
}

@keyframes slideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* تأثيرات hover إضافية */
.hover-lift {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>