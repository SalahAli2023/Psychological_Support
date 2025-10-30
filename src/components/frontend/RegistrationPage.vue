<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Header -->
        <Header />

        <!-- Main Content -->
        <main class="flex-1 container mx-auto px-4 py-28">
            <div class="max-w-8xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <!-- Left Side - Registration Form -->
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <RegistrationForm 
                        :is-page="true"
                        @registration-success="handleRegistrationSuccess"
                        />
                    </div>

                    <!-- Right Side - Image/Content -->
                    <div class="hidden lg:block ">
                        <div class="bg-gradient-to-br from-primary-green to-green-400 rounded-2xl p-20 text-white">
                            <div class="text-center mb-12">
                                <h2 class="text-4xl font-bold mb-6">رحلتك نحو الصحة النفسية تبدأ من هنا</h2>
                                <p class="text-xl opacity-90 leading-relaxed">
                                انضم إلى آلاف الأشخاص الذين بدأوا رحلتهم في فهم وتحسين صحتهم النفسية مع نفساني
                                </p>
                            </div>
                        
                            <div class="space-y-8">
                                <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-chart-bar text-2xl"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2">مقاييس نفسية دقيقة</h3>
                                    <p class="opacity-90">اختبر صحتك النفسية بمقاييس معتمدة علمياً</p>
                                </div>
                                </div>
                                
                                <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-book-open text-2xl"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2">محتوى علمي موثوق</h3>
                                    <p class="opacity-90">احصل على مقالات ومصادر موثوقة في الصحة النفسية</p>
                                </div>
                                </div>
                                
                                <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-users text-2xl"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold mb-2">مجتمع داعم</h3>
                                    <p class="opacity-90">انضم إلى مجتمع يهتم بالصحة النفسية والتنمية الذاتية</p>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/frontend/layouts/Header.vue'
import Footer from '@/components/frontend/layouts/Footer.vue'
import RegistrationForm from '@/components/frontend/auth/RegistrationForm.vue'

const router = useRouter()

const handleRegistrationSuccess = () => {
    router.push('/')
}
</script>