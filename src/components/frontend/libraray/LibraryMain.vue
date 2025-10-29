<template>
  <div class="min-h-screen bg-white">
    <Header />
    
    <!-- Hero Section للمكتبة -->
    <Hero
      title="مكتبة "
      highlight="الموارد النفسية"
      subtitle="استكشف مجموعة واسعة من الكتب، المقالات، والأدلة العلمية في مجال الصحة النفسية والدعم الذاتي"
      :buttons="heroButtons"
      :floatingShapes="true"
    />

    <!-- محتوى المكتبة -->
    <main class="py-16">
      <div class="container mx-auto px-4">
        
        <!-- شريط البحث والتصفية -->
        <div class="search-filter-container mb-12">
          <div class="search-filter-bar">
            <!-- محرك البحث -->
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="ابحث في المكتبة..."
                class="search-input"
              />
            </div>

            <!-- القائمة المنسدلة للتصنيفات -->
            <div class="dropdown-container">
              <div class="dropdown-trigger" @click="toggleDropdown">
                <span>
                  <i :class="['fas', activeCategoryIcon]"></i>
                  {{ activeCategoryName }}
                </span>
                <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: isDropdownOpen }"></i>
              </div>
              
              <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
                <div
                  v-for="category in libraryCategories"
                  :key="category.id"
                  @click="handleCategoryChange(category.id)"
                  :class="['dropdown-item', { active: selectedCategory === category.id }]"
                >
                  <i :class="['fas', category.icon]"></i>
                  {{ category.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- إحصائيات سريعة -->
        <div class="stats-section mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- بطاقة الإحصائيات 1 -->
            <div class="stats-card-professional group" data-color="green">
              <div class="stats-icon-wrapper">
                <i class="fas fa-book stats-icon-clean"></i>
                <div class="stats-pulse-effect-clean"></div>
              </div>
              <div class="stats-content">
                <h3 class="stats-number">{{ libraryStats.totalItems }}</h3>
                <p class="stats-label">مورد متاح</p>
                <div class="stats-tag">
                  <span>الأكثر طلباً</span>
                </div>
              </div>
              <div class="stats-decoration">
                <div class="stats-dot stats-dot-1"></div>
                <div class="stats-dot stats-dot-2"></div>
                <div class="stats-dot stats-dot-3"></div>
              </div>
            </div>

            <!-- بطاقة الإحصائيات 2 -->
            <div class="stats-card-professional group" data-color="pink">
              <div class="stats-icon-wrapper">
                <i class="fas fa-book-open stats-icon-clean"></i>
                <div class="stats-pulse-effect-clean"></div>
              </div>
              <div class="stats-content">
                <h3 class="stats-number">{{ libraryStats.books }}</h3>
                <p class="stats-label">كتاب</p>
                <div class="stats-tag">
                  <span>متنوع</span>
                </div>
              </div>
              <div class="stats-decoration">
                <div class="stats-dot stats-dot-1"></div>
                <div class="stats-dot stats-dot-2"></div>
                <div class="stats-dot stats-dot-3"></div>
              </div>
            </div>

            <!-- بطاقة الإحصائيات 3 -->
            <div class="stats-card-professional group" data-color="green">
              <div class="stats-icon-wrapper">
                <i class="fas fa-file-alt stats-icon-clean"></i>
                <div class="stats-pulse-effect-clean"></div>
              </div>
              <div class="stats-content">
                <h3 class="stats-number">{{ libraryStats.articles }}</h3>
                <p class="stats-label">مقال علمي</p>
                <div class="stats-tag">
                  <span>أكاديمي</span>
                </div>
              </div>
              <div class="stats-decoration">
                <div class="stats-dot stats-dot-1"></div>
                <div class="stats-dot stats-dot-2"></div>
                <div class="stats-dot stats-dot-3"></div>
              </div>
            </div>

            <!-- بطاقة الإحصائيات 4 -->
            <div class="stats-card-professional group" data-color="pink">
              <div class="stats-icon-wrapper">
                <i class="fas fa-download stats-icon-clean"></i>
                <div class="stats-pulse-effect-clean"></div>
              </div>
              <div class="stats-content">
                <h3 class="stats-number">{{ libraryStats.downloads }}+</h3>
                <p class="stats-label">تحميل</p>
                <div class="stats-tag">
                  <span>متصاعد</span>
                </div>
              </div>
              <div class="stats-decoration">
                <div class="stats-dot stats-dot-1"></div>
                <div class="stats-dot stats-dot-2"></div>
                <div class="stats-dot stats-dot-3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- عرض الموارد -->
        <div class="articles-container">
          <div v-if="filteredItems.length > 0" class="articles-grid">
            <LibraryCard
              v-for="item in paginatedItems"
              :key="item.id"
              :item="item"
              @download="handleDownload"
              @preview="handlePreview"
            />
          </div>

          <!-- لا توجد نتائج -->
          <div v-else class="no-results">
            <i class="fas fa-search"></i>
            <h3 class="text-2xl font-bold text-gray-700 mb-4">لم نعثر على نتائج</h3>
            <p class="text-gray-600 text-lg">جرب استخدام كلمات بحث مختلفة أو تغيير الفلاتر</p>
          </div>
        </div>

        <!-- الترقيم -->
        <div v-if="filteredItems.length > 0" class="pagination-container">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="filteredItems.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/frontend/layouts/Header.vue'
import Footer from '@/components/frontend/layouts/Footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import LibraryCard from './LibraryCard.vue'
import Pagination from '../article/Pagination.vue'
import { libraryData, categories, libraryStats } from './libraryData.js'

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const isDropdownOpen = ref(false)

const heroButtons = [
  {
    text: 'استكشاف المكتبة',
    icon: 'fas fa-search',
    primary: true
  },
  {
    text: 'كيفية الاستخدام',
    icon: 'fas fa-question-circle',
    primary: false
  }
]

const libraryCategories = [
  { id: '', name: 'جميع الموارد', icon: 'fa-list' },
  { id: 'anxiety', name: 'القلق والتوتر', icon: 'fa-brain' },
  { id: 'depression', name: 'الاكتئاب', icon: 'fa-cloud' },
  { id: 'relationships', name: 'العلاقات', icon: 'fa-heart' },
  { id: 'self-development', name: 'التنمية الذاتية', icon: 'fa-user-graduate' },
  { id: 'parenting', name: 'تربية الأطفال', icon: 'fa-baby' },
  { id: 'trauma', name: 'الصدمات', icon: 'fa-first-aid' },
  { id: 'addiction', name: 'الإدمان', icon: 'fa-ban' },
  { id: 'work-stress', name: 'ضغوط العمل', icon: 'fa-briefcase' }
]

// العناصر المصفاة
const filteredItems = computed(() => {
  let filtered = libraryData

  // تصفية حسب البحث
  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // تصفية حسب الفئة
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }

  return filtered
})

// العناصر المعروضة في الصفحة الحالية
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredItems.value.slice(startIndex, endIndex)
})

// إجمالي عدد الصفحات
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

// معلومات الفئة النشطة
const activeCategoryName = computed(() => {
  const category = libraryCategories.find(cat => cat.id === selectedCategory.value)
  return category ? category.name : 'جميع الموارد'
})

const activeCategoryIcon = computed(() => {
  const category = libraryCategories.find(cat => cat.id === selectedCategory.value)
  return category ? category.icon : 'fa-list'
})

const handleCategoryChange = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  isDropdownOpen.value = false
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleDownload = (item) => {
  console.log('تحميل:', item.title)
  // هنا يمكن إضافة منطق التحميل الفعلي
}

const handlePreview = (item) => {
  console.log('معاينة:', item.title)
  // هنا يمكن إضافة منطق المعاينة
}

onMounted(() => {
  // إغلاق القائمة المنسدلة عند النقر خارجها
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      isDropdownOpen.value = false
    }
  })
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* تصميم الإحصائيات المحترف */
.stats-section {
  position: relative;
}

.stats-card-professional {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* الخط العلوي حسب اللون */
.stats-card-professional[data-color="green"]::before {
  background: #9EBF3B;
}

.stats-card-professional[data-color="pink"]::before {
  background: #D6A29A;
}

.stats-card-professional::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stats-card-professional:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stats-card-professional[data-color="green"]:hover {
  border-color: #9EBF3B;
}

.stats-card-professional[data-color="pink"]:hover {
  border-color: #D6A29A;
}

.stats-card-professional:hover::before {
  transform: scaleX(1);
}

.stats-icon-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 1.5rem;
  justify-content: center;
  align-items: center;
}

/* الأيقونة - لون أساسي حسب data-color */
.stats-card-professional[data-color="green"] .stats-icon-clean {
  color: #9EBF3B;
}

.stats-card-professional[data-color="pink"] .stats-icon-clean {
  color: #D6A29A;
}

.stats-icon-clean {
  font-size: 3.5rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 2;
}

.stats-card-professional[data-color="green"] .stats-icon-clean {
  filter: drop-shadow(0 4px 12px rgba(158, 191, 59, 0.3));
}

.stats-card-professional[data-color="pink"] .stats-icon-clean {
  filter: drop-shadow(0 4px 12px rgba(214, 162, 154, 0.3));
}

/* تغيير اللون عند التمرير */
.stats-card-professional[data-color="green"]:hover .stats-icon-clean {
  color: #D6A29A;
  filter: drop-shadow(0 8px 20px rgba(214, 162, 154, 0.4));
}

.stats-card-professional[data-color="pink"]:hover .stats-icon-clean {
  color: #9EBF3B;
  filter: drop-shadow(0 8px 20px rgba(158, 191, 59, 0.4));
}

.stats-card-professional:hover .stats-icon-clean {
  transform: scale(1.3) rotate(5deg);
}

/* تأثير النبض - لون أساسي */
.stats-card-professional[data-color="green"] .stats-pulse-effect-clean {
  background: #9EBF3B;
}

.stats-card-professional[data-color="pink"] .stats-pulse-effect-clean {
  background: #D6A29A;
}

.stats-pulse-effect-clean {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0.08;
  animation: pulse-clean 2s infinite;
  z-index: 1;
}

@keyframes pulse-clean {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.08;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.03;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.08;
  }
}

.stats-content {
  position: relative;
  z-index: 2;
}

/* الأرقام - لون أساسي */
.stats-card-professional[data-color="green"] .stats-number {
  color: #9EBF3B;
}

.stats-card-professional[data-color="pink"] .stats-number {
  color: #D6A29A;
}

.stats-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1;
  transition: color 0.3s ease;
}

/* تغيير لون الأرقام عند التمرير */
.stats-card-professional[data-color="green"]:hover .stats-number {
  color: #D6A29A;
}

.stats-card-professional[data-color="pink"]:hover .stats-number {
  color: #9EBF3B;
}

.stats-label {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* التاغ - لون أساسي */
.stats-card-professional[data-color="green"] .stats-tag span {
  color: #9EBF3B;
}

.stats-card-professional[data-color="pink"] .stats-tag span {
  color: #D6A29A;
}

.stats-tag {
  display: inline-flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.stats-tag span {
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* تغيير لون التاغ عند التمرير */
.stats-card-professional[data-color="green"]:hover .stats-tag span {
  color: #D6A29A;
}

.stats-card-professional[data-color="pink"]:hover .stats-tag span {
  color: #9EBF3B;
}

.stats-card-professional:hover .stats-tag {
  border-color: currentColor;
}

.stats-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

/* النقاط - لون أساسي */
.stats-card-professional[data-color="green"] .stats-dot {
  background: #9EBF3B;
}

.stats-card-professional[data-color="pink"] .stats-dot {
  background: #D6A29A;
}

.stats-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: background 0.3s ease;
}

/* تغيير لون النقاط عند التمرير */
.stats-card-professional[data-color="green"]:hover .stats-dot {
  background: #D6A29A;
}

.stats-card-professional[data-color="pink"]:hover .stats-dot {
  background: #9EBF3B;
}

.stats-dot-1 {
  top: 20%;
  left: 15%;
  animation: float 3s ease-in-out infinite;
}

.stats-dot-2 {
  top: 60%;
  right: 20%;
  animation: float 3s ease-in-out 1s infinite;
}

.stats-dot-3 {
  bottom: 30%;
  left: 25%;
  animation: float 3s ease-in-out 2s infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1);
    opacity: 0.3;
  }
}

.stats-card-professional:hover .stats-dot {
  animation-duration: 2s;
}

/* تأثيرات إضافية للتفاعل */
.stats-card-professional::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stats-card-professional[data-color="green"]::after {
  background: radial-gradient(circle, rgba(158, 191, 59, 0.1) 0%, transparent 70%);
}

.stats-card-professional[data-color="pink"]::after {
  background: radial-gradient(circle, rgba(214, 162, 154, 0.1) 0%, transparent 70%);
}

.stats-card-professional:hover::after {
  opacity: 1;
}

/* تأثير ظل للأيقونة عند التمرير */
.stats-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 0;
}

.stats-card-professional[data-color="green"] .stats-icon-wrapper::before {
  background: radial-gradient(circle, rgba(158, 191, 59, 0.2) 0%, transparent 70%);
}

.stats-card-professional[data-color="pink"] .stats-icon-wrapper::before {
  background: radial-gradient(circle, rgba(214, 162, 154, 0.2) 0%, transparent 70%);
}

.stats-card-professional:hover .stats-icon-wrapper::before {
  opacity: 1;
  width: 80px;
  height: 80px;
}

/* تصميم متجاوب */
@media (max-width: 768px) {
  .stats-card-professional {
    padding: 1.5rem;
  }
  
  .stats-icon-clean {
    font-size: 2.8rem;
  }
  
  .stats-number {
    font-size: 2.5rem;
  }
  
  .stats-pulse-effect-clean {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .stats-card-professional {
    padding: 1.2rem;
  }
  
  .stats-icon-clean {
    font-size: 2.5rem;
  }
  
  .stats-number {
    font-size: 2.2rem;
  }
  
  .stats-tag {
    padding: 0.375rem 0.75rem;
  }
  
  .stats-tag span {
    font-size: 0.8rem;
  }
}
</style>