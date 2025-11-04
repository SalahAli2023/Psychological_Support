<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Header -->
        <Header :language="currentLanguage" />

        <!-- Main Content -->
        <main class="flex-1 container mx-auto px-4 py-28">
            <div class="max-w-8xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <!-- Left Side - Registration Form -->
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <RegistrationForm 
                        :is-page="true"
                            :language="currentLanguage"
                        @registration-success="handleRegistrationSuccess"
                        />
                    </div>

                    <!-- Right Side - Image/Content -->
                    <div class="hidden lg:block ">
                        <div class="bg-gradient-to-br from-primary-green to-green-400 rounded-2xl p-20 text-white">
                            <div class="text-center mb-12">
                                <h2 class="text-4xl font-bold mb-6">{{ translate('registrationPage.hero.title') }}</h2>
                                <p class="text-xl opacity-90 leading-relaxed">
                                {{ translate('registrationPage.hero.description') }}
                                </p>
                            </div>
                        
                            <div class="space-y-8">
                                <div class="flex items-center space-x-4" :class="isRTL ? 'space-x-reverse' : ''">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-chart-bar text-2xl"></i>
                                </div>
                                <div :class="isRTL ? 'text-right' : 'text-left'">
                                    <h3 class="text-xl font-bold mb-2">{{ translate('registrationPage.features.metrics.title') }}</h3>
                                    <p class="opacity-90">{{ translate('registrationPage.features.metrics.description') }}</p>
                                </div>
                                </div>
                                
                                <div class="flex items-center space-x-4" :class="isRTL ? 'space-x-reverse' : ''">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-book-open text-2xl"></i>
                                </div>
                                <div :class="isRTL ? 'text-right' : 'text-left'">
                                    <h3 class="text-xl font-bold mb-2">{{ translate('registrationPage.features.content.title') }}</h3>
                                    <p class="opacity-90">{{ translate('registrationPage.features.content.description') }}</p>
                                </div>
                                </div>
                                
                                <div class="flex items-center space-x-4" :class="isRTL ? 'space-x-reverse' : ''">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-users text-2xl"></i>
                                </div>
                                <div :class="isRTL ? 'text-right' : 'text-left'">
                                    <h3 class="text-xl font-bold mb-2">{{ translate('registrationPage.features.community.title') }}</h3>
                                    <p class="opacity-90">{{ translate('registrationPage.features.community.description') }}</p>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <Footer :language="currentLanguage" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/locales'
import Header from '@/components/frontend/layouts/Header.vue'
import Footer from '@/components/frontend/layouts/Footer.vue'
import RegistrationForm from '@/components/frontend/auth/RegistrationForm.vue'

const router = useRouter()

// يمكنك جلب اللغة من الـ store أو من localStorage
const currentLanguage = ref('ar') // أو 'en'

// Check if current language is RTL
const isRTL = computed(() => {
    return currentLanguage.value === 'ar'
})

// Translation function
const translate = (key) => {
    return t(key, currentLanguage.value)
}

// دالة لتغيير اللغة (يمكن ربطها بزر في الـ Header)
const changeLanguage = (lang) => {
    currentLanguage.value = lang
    // يمكنك أيضاً حفظ اللغة في localStorage هنا
    localStorage.setItem('preferred-language', lang)
}

const handleRegistrationSuccess = () => {
    router.push('/')
}
</script>