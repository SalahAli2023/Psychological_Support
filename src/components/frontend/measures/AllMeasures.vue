<template>
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">جميع المقاييس المتاحة</h2>
            
            <div v-if="measures.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="measure in measures" 
                    :key="measure.id"
                    class="test-card bg-white rounded-xl shadow-lg p-6 cursor-pointer"
                    @click="$emit('measure-click', measure)"
                >
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-primary-green/20 flex items-center justify-center ml-3">
                            <i :class="measure.icon" class="text-primary-green text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">{{ measure.title }}</h3>
                            <span class="text-xs px-2 py-1 rounded-full mt-1 inline-block" :class="getCategoryClass(measure.category)">
                                {{ getCategoryTitle(measure.category) }}
                            </span>
                        </div>
                    </div>
                    
                    <p class="text-gray-600 mb-4 text-sm">{{ measure.description }}</p>
                    
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <div class="flex items-center">
                            <i class="fas fa-question-circle ml-1"></i>
                            <span>{{ measure.questions.length }} أسئلة</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock ml-1"></i>
                            <span>{{ measure.time }} دقائق</span>
                        </div>
                    </div>
                    
                    <div class="mt-4 flex justify-between items-center">
                        <!-- نجوم التقييم المعدلة -->
                        <div class="flex items-center">
                            <div class="stars-container">
                                <i 
                                    v-for="i in 5" 
                                    :key="i" 
                                    class="fas fa-star text-lg" 
                                    :class="i <= measure.rating ? 'star' : 'star empty'"
                                ></i>
                            </div>
                            <span class="text-xs text-gray-500 mr-1">({{ measure.reviews }})</span>
                        </div>
                        <button class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm">
                        ابدأ التقييم
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- رسالة عدم وجود نتائج -->
            <div v-else class="text-center py-12">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على نتائج</h3>
                <p class="text-gray-500">حاول استخدام مصطلحات بحث مختلفة أو تصفح جميع الفئات</p>
            </div>
        </div>
    </section>
</template>

<script>
import { categoryTitles } from '@/data/measures'

export default {
    name: 'AllMeasures',
    props: {
        measures: {
            type: Array,
            default: () => []
        },
        activeFilter: {
            type: String,
            default: 'allMeasures'
        }
    },
    emits: ['measure-click'],
    setup() {
        const getCategoryClass = (category) => {
            const classes = {
                'women': 'bg-blue-100 text-blue-800',
                'children': 'bg-green-100 text-green-800',
                'specialists': 'bg-purple-100 text-purple-800'
            }
            return classes[category] || ''
        }

        const getCategoryTitle = (category) => {
            return categoryTitles[category] || category
        }

        return {
            getCategoryClass,
            getCategoryTitle
        }
    }
}
</script>

<style scoped>
.test-card {
    transition: all 0.3s ease;
    border-right: 4px solid #D6A29A;
}

.test-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* تنسيق نجوم التقييم */
.stars-container {
    display: flex;
    gap: 2px;
}

.star {
    background: linear-gradient(135deg, #9EBF3B, #D6A29A);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.star.empty {
    background: #E5E7EB;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>