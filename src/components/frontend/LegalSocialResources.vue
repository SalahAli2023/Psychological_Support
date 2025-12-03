<template>
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <Header :language="currentLanguage" />

        <!-- Hero Section -->
        <Hero 
            :title="translate('resourcesPage.title')"
            :subtitle="translate('resourcesPage.description')"
            :buttons="heroButtons"
        />

        <!-- Main Content -->
        <main class="container mx-auto px-4 md:px-6 lg:px-8">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-green"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p class="text-red-700 mb-3 text-base">{{ error }}</p>
                <button @click="fetchData" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-base">
                    إعادة المحاولة
                </button>
            </div>

            <!-- Main Content -->
            <div v-else class="space-y-8">
                <!-- Legal Resources Section -->
                <div class="bg-gray-50 rounded-lg p-4 md:p-6">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ translate('resourcesPage.legalResources.title') }}</h2>
                        <p class="text-gray-600 text-lg">{{ translate('resourcesPage.legalResources.description') }}</p>
                    </div>

                    <!-- Search and Filter -->
                    <div class="mb-4 space-y-3">
                        <div class="flex flex-col md:flex-row gap-3">
                            <div class="flex-1">
                                <input
                                    v-model="legalSearch"
                                    type="text"
                                    :placeholder="translate('resourcesPage.searchPlaceholder')"
                                    class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary-green text-base"
                                />
                            </div>
                            <select
                                v-model="selectedLawType"
                                class="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary-green text-base"
                            >
                                <option value="">{{ translate('resourcesPage.allTypes') }}</option>
                                <option v-for="type in lawTypes" :key="type" :value="type">
                                    {{ type }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Categories -->
                    <div class="mb-4">
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="category in categories"
                                :key="category.id"
                                @click="selectCategory(category.id)"
                                class="px-4 py-2 rounded text-base transition-colors"
                                :class="selectedCategoryId === category.id
                                    ? 'bg-primary-green text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'"
                            >
                                {{ category.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Laws List -->
                    <div class="space-y-4">
                        <div
                            v-for="resource in filteredLegalResources"
                            :key="resource.id"
                            class="bg-white rounded p-4 border border-gray-200 hover:border-primary-green transition-colors"
                        >
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-primary-green font-bold text-lg">
                                    {{ resource.article_number }}
                                </span>
                                <span class="text-primary-pink text-sm bg-primary-pink/10 px-3 py-1 rounded">
                                    {{ resource.law_type }}
                                </span>
                            </div>
                            <p class="text-gray-700 mb-3 text-base line-clamp-2">
                                {{ resource.text }}
                            </p>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-500">
                                    {{ resource.category?.name }}
                                </span>
                                <button
                                    @click="toggleResourceDetails(resource.id)"
                                    class="text-primary-green hover:text-primary-pink transition-colors text-base"
                                >
                                    {{ expandedResources.includes(resource.id) ? 'إخفاء' : 'تفاصيل' }}
                                </button>
                            </div>
                            
                            <!-- Expanded Details -->
                            <div v-if="expandedResources.includes(resource.id)" class="mt-3 pt-3 border-t border-gray-200">
                                <div class="space-y-3 text-base text-gray-600">
                                    <div>
                                        <strong class="text-primary-green">النص العربي:</strong>
                                        <p class="mt-2">{{ resource.text_ar }}</p>
                                    </div>
                                    <div>
                                        <strong class="text-primary-green">English Text:</strong>
                                        <p class="mt-2">{{ resource.text_en }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredLegalResources.length === 0" class="text-center py-6 text-gray-500 text-lg">
                        <p>لا توجد نتائج مطابقة للبحث</p>
                    </div>

                    <!-- Pagination -->
                    <div v-if="legalResources.meta && legalResources.meta.last_page > 1" class="mt-6 flex justify-center">
                        <div class="flex gap-2">
                            <button
                                @click="loadMoreLegalResources('prev')"
                                :disabled="!legalResources.meta.prev_page_url"
                                class="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                            >
                                السابق
                            </button>
                            <span class="px-4 py-2 text-gray-600 text-base">
                                {{ legalResources.meta.current_page }} / {{ legalResources.meta.last_page }}
                            </span>
                            <button
                                @click="loadMoreLegalResources('next')"
                                :disabled="!legalResources.meta.next_page_url"
                                class="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Social Resources -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Emergency Contacts -->
                    <div class="bg-white rounded p-6 border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ translate('resourcesPage.emergencyContacts.title') }}</h3>
                        <div class="space-y-4">
                            <div class="text-center p-4 bg-gray-50 rounded">
                                <p class="font-semibold text-gray-800 text-lg">الطوارئ العامة</p>
                                <p class="text-primary-green font-bold text-xl">911</p>
                            </div>
                            <div class="text-center p-4 bg-gray-50 rounded">
                                <p class="font-semibold text-gray-800 text-lg">الدعم النفسي</p>
                                <p class="text-primary-pink font-bold text-xl">0800-123-456</p>
                            </div>
                        </div>
                    </div>

                    <!-- Support Organizations -->
                    <div class="bg-white rounded p-6 border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ translate('resourcesPage.supportingOrganizations.title') }}</h3>
                        <div class="space-y-3">
                            <div v-for="org in supportingOrganizations" :key="org.name" 
                                 class="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                <div class="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center flex-shrink-0">
                                    <i :class="org.icon" class="text-white text-base"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-base">{{ getTranslatedOrganization(org.name) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rights & Support -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Women & Children Rights -->
                    <div class="bg-white rounded p-6 border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ translate('resourcesPage.womenChildrenRights.title') }}</h3>
                        <ul class="space-y-3">
                            <li v-for="right in womenChildrenRights" :key="right" 
                                class="flex items-center gap-3 text-gray-700 text-base">
                                <i class="fas fa-check text-primary-green text-base"></i>
                                <span>{{ getTranslatedRight(right) }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Community Support -->
                    <div class="bg-white rounded p-6 border border-gray-200">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ translate('resourcesPage.communitySupport.title') }}</h3>
                        <ul class="space-y-3">
                            <li v-for="support in communitySupport" :key="support" 
                                class="flex items-center gap-3 text-gray-700 text-base">
                                <i class="fas fa-check text-primary-green text-base"></i>
                                <span>{{ getTranslatedSupport(support) }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-gray-50 rounded p-6">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ translate('resourcesPage.quickActions.title') }}</h2>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                            v-for="action in quickActions" 
                            :key="action.text"
                            @click="handleQuickAction(action.action)"
                            class="bg-white rounded p-4 text-center border border-gray-200 hover:border-primary-green transition-colors"
                        >
                            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                 :class="action.bgColor">
                                <i :class="action.icon" class="text-white text-lg"></i>
                            </div>
                            <h3 class="font-semibold text-gray-800 text-base">{{ action.text }}</h3>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <Footer :language="currentLanguage" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslations } from '@/composables/useTranslations'
import Header from '@/components/frontend/layouts/Header.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import Footer from '@/components/frontend/layouts/Footer.vue'

const router = useRouter()
const { translate } = useTranslations()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Reactive data
const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'ar')
const loading = ref(false)
const error = ref(null)

// Legal resources data
const legalResources = ref({ data: [], meta: null })
const categories = ref([])
const selectedCategoryId = ref(null)
const selectedLawType = ref('')
const legalSearch = ref('')
const expandedResources = ref([])

// Social resources data
const supportingOrganizations = ref([
    { name: 'hospitals', icon: 'fas fa-hospital' },
    { name: 'courts', icon: 'fas fa-gavel' },
    { name: 'police', icon: 'fas fa-shield-alt' },
    { name: 'schools', icon: 'fas fa-school' }
])

const womenChildrenRights = ref(['right1', 'right2', 'right3', 'right4'])
const communitySupport = ref(['support1', 'support2', 'support3', 'support4'])

// Quick Actions
const quickActions = ref([
    {
        text: 'الدردشة المباشرة',
        icon: 'fas fa-comments',
        bgColor: 'bg-primary-pink',
        action: 'chat'
    },
    {
        text: 'التواصل مع محامي',
        icon: 'fas fa-gavel',
        bgColor: 'bg-primary-green',
        action: 'lawyer'
    },
    {
        text: 'الدعم النفسي',
        icon: 'fas fa-heart',
        bgColor: 'bg-primary-pink',
        action: 'support'
    },
    {
        text: 'التواصل معنا',
        icon: 'fas fa-envelope',
        bgColor: 'bg-primary-green',
        action: 'contact'
    }
])

// Hero buttons
const heroButtons = computed(() => [
    { 
        text: translate('buttons.startJourney'), 
        primary: true,
        action: () => router.push('/get-help')
    },
    { 
        text: translate('buttons.learnMore'), 
        primary: false,
        action: () => router.push('/about')
    }
])

// Computed properties
const lawTypes = computed(() => {
    return [...new Set(legalResources.value.data.map(resource => resource.law_type))]
})

const filteredLegalResources = computed(() => {
    let resources = legalResources.value.data

    if (selectedCategoryId.value) {
        resources = resources.filter(resource => resource.category_id === selectedCategoryId.value)
    }

    if (selectedLawType.value) {
        resources = resources.filter(resource => resource.law_type === selectedLawType.value)
    }

    if (legalSearch.value) {
        const searchTerm = legalSearch.value.toLowerCase()
        resources = resources.filter(resource => 
            resource.text.toLowerCase().includes(searchTerm) ||
            resource.article_number.toLowerCase().includes(searchTerm) ||
            (resource.text_ar && resource.text_ar.toLowerCase().includes(searchTerm))
        )
    }

    return resources
})

// Methods
const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
        await Promise.all([
            fetchLegalResources(),
            fetchCategories()
        ])
    } catch (err) {
        error.value = 'فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.'
        console.error('Error fetching data:', err)
    } finally {
        loading.value = false
    }
}

const fetchLegalResources = async (page = 1) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: '10',
            locale: currentLanguage.value
        })

        if (selectedCategoryId.value) {
            params.append('category_id', selectedCategoryId.value)
        }

        if (selectedLawType.value) {
            params.append('law_type', selectedLawType.value)
        }

        if (legalSearch.value) {
            params.append('search', legalSearch.value)
        }

        const response = await fetch(`${API_BASE_URL}/legal-resources?${params}`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': currentLanguage.value
            }
        })
        
        if (!response.ok) throw new Error('Network response was not ok')
        
        legalResources.value = await response.json()
    } catch (err) {
        console.error('Error fetching legal resources:', err)
        throw new Error('Failed to fetch legal resources')
    }
}

const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/legal-resource-categories`, {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': currentLanguage.value
            }
        })
        
        if (!response.ok) throw new Error('Network response was not ok')
        
        categories.value = await response.json()
    } catch (err) {
        console.error('Error fetching categories:', err)
        throw new Error('Failed to fetch categories')
    }
}

const selectCategory = (categoryId) => {
    selectedCategoryId.value = selectedCategoryId.value === categoryId ? null : categoryId
    fetchLegalResources(1)
}

const toggleResourceDetails = (resourceId) => {
    const index = expandedResources.value.indexOf(resourceId)
    if (index > -1) {
        expandedResources.value.splice(index, 1)
    } else {
        expandedResources.value.push(resourceId)
    }
}

const loadMoreLegalResources = (direction) => {
    const currentPage = legalResources.value.meta?.current_page || 1
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1
    fetchLegalResources(newPage)
}

const handleQuickAction = (action) => {
    switch (action) {
        case 'chat':
            window.open('/chat', '_blank')
            break
        case 'lawyer':
            router.push('/legal-consultation')
            break
        case 'support':
            router.push('/psychological-support')
            break
        case 'contact':
            router.push('/contact')
            break
    }
}

// Translation methods
const getTranslatedRight = (key) => {
    const translation = translate(`resourcesPage.womenChildrenRights.list.${key}`)
    return typeof translation === 'object' ? translation[currentLanguage.value] : translation
}

const getTranslatedSupport = (key) => {
    const translation = translate(`resourcesPage.communitySupport.list.${key}`)
    return typeof translation === 'object' ? translation[currentLanguage.value] : translation
}

const getTranslatedOrganization = (key) => {
    const translation = translate(`resourcesPage.supportingOrganizations.list.${key}`)
    return typeof translation === 'object' ? translation[currentLanguage.value] : translation
}

// Watchers
watch([selectedLawType, legalSearch], () => {
    fetchLegalResources(1)
})

watch(currentLanguage, () => {
    fetchData()
})

// Event listener for language changes
const handleLanguageChange = (event) => {
    currentLanguage.value = event.detail.language
}

// Lifecycle
onMounted(() => {
    window.addEventListener('languageChanged', handleLanguageChange)
    fetchData()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>