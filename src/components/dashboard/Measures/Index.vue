<template>
  <div class="min-h-screen bg-gray-50" :dir="language === 'ar' ? 'rtl' : 'ltr'">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <button 
              @click="$router.back()" 
              class="p-2 rounded-lg hover:bg-gray-100 mr-4"
            >
              <i class="fas fa-arrow-right text-gray-600" v-if="language === 'ar'"></i>
              <i class="fas fa-arrow-left text-gray-600" v-else></i>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ translate('measures.title') }}
            </h1>
          </div>
          
          <div class="flex items-center space-x-4" :class="language === 'ar' ? 'space-x-reverse' : ''">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="translate('measures.searchPlaceholder')"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              >
              <i class="fas fa-search absolute left-3 top-3 text-gray-400" 
                 :class="language === 'ar' ? 'left-auto right-3' : 'left-3'"></i>
            </div>
            
            <select 
              v-model="selectedCategory" 
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ translate('measures.allCategories') }}</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ getTranslatedCategory(category) }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <i class="fas fa-clipboard-list text-lg"></i>
            </div>
            <div class="mr-4" :class="language === 'ar' ? 'mr-0 ml-4' : 'mr-4'">
              <p class="text-sm font-medium text-gray-600">{{ translate('measures.totalMeasures') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.totalMeasures }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <i class="fas fa-check-circle text-lg"></i>
            </div>
            <div class="mr-4" :class="language === 'ar' ? 'mr-0 ml-4' : 'mr-4'">
              <p class="text-sm font-medium text-gray-600">{{ translate('measures.completed') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.completed }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i class="fas fa-clock text-lg"></i>
            </div>
            <div class="mr-4" :class="language === 'ar' ? 'mr-0 ml-4' : 'mr-4'">
              <p class="text-sm font-medium text-gray-600">{{ translate('measures.inProgress') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.inProgress }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <i class="fas fa-chart-line text-lg"></i>
            </div>
            <div class="mr-4" :class="language === 'ar' ? 'mr-0 ml-4' : 'mr-4'">
              <p class="text-sm font-medium text-gray-600">{{ translate('measures.avgScore') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.averageScore }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Measures Grid -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name[language] }}
            </button>
          </nav>
        </div>

        <!-- Measures List -->
        <div class="p-6">
          <div v-if="filteredMeasures.length === 0" class="text-center py-12">
            <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ translate('measures.noMeasuresFound') }}
            </h3>
            <p class="text-gray-500">
              {{ translate('measures.tryDifferentSearch') }}
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="measure in filteredMeasures"
              :key="measure.id"
              class="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div class="p-6">
                <!-- Measure Header -->
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCategoryClass(measure.category)"
                    >
                      {{ getTranslatedCategoryName(measure.category) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2" :class="language === 'ar' ? 'space-x-reverse' : ''">
                    <span class="text-xs text-gray-500">
                      {{ measure.questions.length }} {{ translate('measures.questions') }}
                    </span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-500">
                      <i class="fas fa-clock mr-1" :class="language === 'ar' ? 'mr-0 ml-1' : 'mr-1'"></i>
                      {{ measure.time }}
                    </span>
                  </div>
                </div>

                <!-- Measure Title & Description -->
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ getTranslatedTitle(measure) }}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                  {{ getTranslatedDescription(measure) }}
                </p>

                <!-- Progress -->
                <div v-if="getMeasureProgress(measure.id)" class="mb-4">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{{ translate('measures.progress') }}</span>
                    <span>{{ getMeasureProgress(measure.id).percentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full bg-blue-600 transition-all"
                      :style="`width: ${getMeasureProgress(measure.id).percentage}%`"
                    ></div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    @click="viewMeasureDetails(measure)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    {{ translate('measures.viewDetails') }}
                    <i class="fas fa-chevron-left text-xs mr-2" v-if="language === 'ar'"></i>
                    <i class="fas fa-chevron-right text-xs ml-2" v-else></i>
                  </button>

                  <button
                    @click="startMeasure(measure)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <i class="fas fa-play mr-2" :class="language === 'ar' ? 'mr-0 ml-2' : 'mr-2'"></i>
                    {{ getMeasureProgress(measure.id) ? translate('measures.continue') : translate('measures.start') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ translate('measures.recentActivity') }}
          </h2>
        </div>
        <div class="p-6">
          <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
            {{ translate('measures.noRecentActivity') }}
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              :class="language === 'ar' ? 'space-x-reverse' : ''"
            >
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="fas fa-clipboard-check text-blue-600"></i>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">
                  {{ getTranslatedTitle(activity.measure) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(activity.date) }} • {{ activity.score }}/{{ activity.maxScore }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getScoreClass(activity.score, activity.maxScore)"
                >
                  {{ Math.round((activity.score / activity.maxScore) * 100) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Measure Modal -->
    <MeasureModal
      v-if="selectedMeasure"
      :measure="selectedMeasure"
      :test-step="testStep"
      :current-question-index="currentQuestionIndex"
      :answers="currentAnswers"
      :test-result="testResult"
      :language="language"
      @close="closeModal"
      @start-test="startTest"
      @next-question="nextQuestion"
      @previous-question="previousQuestion"
      @submit-test="submitTest"
      @retake-test="retakeTest"
      @show-other-measures="showOtherMeasures"
    />
  </div>
</template>

<script>
import { t } from '@/locales'
import MeasureModal from '@/components/frontend/measures/MeasureModal.vue'
// import { measuresData, resourcesData } from '@/data/measures'

export default {
  name: 'MeasuresDashboard',
  components: {
    MeasureModal
  },
//   setup(){
//     const measures = ref(measuresData),

//     return{
//         measures
//     }
//   },
  data() {
    return {
      language: 'ar',
      searchQuery: '',
      selectedCategory: '',
      activeTab: 'all',
      selectedMeasure: null,
      testStep: 'info',
      currentQuestionIndex: 0,
      currentAnswers: [],
      testResult: null,
      
      // Sample data - replace with actual API calls
      measures: [
        // مقياس القلق
        {
            id: 'anxiety-scale',
            title: { 
                ar: 'مقياس القلق', 
                en: 'Anxiety Scale' 
            },
            description: { 
                ar: 'مقياس يساعد في تقييم مستوى القلق والتوتر لدى الأفراد من خلال مجموعة من الأسئلة العلمية المعتمدة',
                en: 'A scientific scale to assess anxiety and stress levels through a set of validated questions'
            },
            category: 'mental_health',
            icon: 'fas fa-heartbeat',
            time: '10 دقائق',
            questions: 10,
            rating: 4.3,
            reviews: 67,
            questions: [
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالتوتر والقلق بدون سبب واضح",
                        en: "I feel tense and anxious without clear reason"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أواجه صعوبة في الاسترخاء",
                        en: "I have difficulty relaxing"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالخوف من أشياء تبدو طبيعية للآخرين",
                        en: "I feel afraid of things that seem normal to others"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أعاني من نوبات هلع مفاجئة",
                        en: "I experience sudden panic attacks"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالقلق المفرط على صحتي",
                        en: "I worry excessively about my health"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أجد صعوبة في النوم بسبب الأفكار المقلقة",
                        en: "I have trouble sleeping due to worrying thoughts"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بعدم الراحة في الأماكن المزدحمة",
                        en: "I feel uncomfortable in crowded places"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أتجنب المواقف الاجتماعية خوفاً من القلق",
                        en: "I avoid social situations for fear of anxiety"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بضيق في التنفس عندما أكون قلقاً",
                        en: "I feel shortness of breath when anxious"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أعاني من تسارع في نبضات القلب دون مجهود",
                        en: "I experience rapid heartbeat without physical exertion"
                    },
                    required: true,
                    options: [
                        { ar: "أبداً", en: "Never", value: 0 },
                        { ar: "نادراً", en: "Rarely", value: 1 },
                        { ar: "أحياناً", en: "Sometimes", value: 2 },
                        { ar: "غالباً", en: "Often", value: 3 },
                        { ar: "دائماً", en: "Always", value: 4 }
                    ],
                    category: "anxiety"
                }
            ],
            scoring: {
                calculateScore: (answers, questions) => {
                    let totalScore = 0;
                    let maxPossibleScore = 0;

                    questions.forEach((question, index) => {
                        const answer = answers[index];
                        if (answer !== undefined) {
                            const option = question.options[answer];
                            if (option && option.value !== undefined) {
                                totalScore += option.value;
                            }
                        }
                        // حساب أقصى درجة ممكنة
                        const maxOptionValue = Math.max(...question.options.map(opt => opt.value));
                        maxPossibleScore += maxOptionValue;
                    });

                    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

                    return {
                        totalScore: totalScore,
                        maxPossibleScore: maxPossibleScore,
                        percentage: percentage
                    };
                },
                interpretation: (score, language) => {
                    const anxietyLevels = {
                        low: {
                            ar: { 
                                level: 'منخفض', 
                                desc: 'مستوى القلق لديك ضمن المعدل الطبيعي. هذا مؤشر جيد على صحتك النفسية.' 
                            },
                            en: { 
                                level: 'Low', 
                                desc: 'Your anxiety level is within normal range. This is a good indicator of your mental health.' 
                            }
                        },
                        mild: {
                            ar: { 
                                level: 'خفيف', 
                                desc: 'هناك بعض علامات القلق التي تحتاج للمراقبة. قد تستفيد من تقنيات الاسترخاء.' 
                            },
                            en: { 
                                level: 'Mild', 
                                desc: 'There are some anxiety signs that need monitoring. You may benefit from relaxation techniques.' 
                            }
                        },
                        moderate: {
                            ar: { 
                                level: 'متوسط', 
                                desc: 'مستوى القلق متوسط. نوصي بممارسة الرياضة والتحدث مع مختص إذا استمرت الأعراض.' 
                            },
                            en: { 
                                level: 'Moderate', 
                                desc: 'Moderate anxiety level. We recommend exercise and consulting a specialist if symptoms persist.' 
                            }
                        },
                        severe: {
                            ar: { 
                                level: 'شديد', 
                                desc: 'مستوى القلق مرتفع ويحتاج للاستشارة المهنية. نوصي بمراجعة أخصائي صحة نفسية.' 
                            },
                            en: { 
                                level: 'Severe', 
                                desc: 'High anxiety level requiring professional consultation. We recommend seeing a mental health specialist.' 
                            }
                        }
                    };

                    let level;
                    if (score.percentage <= 25) {
                        level = anxietyLevels.low[language];
                    } else if (score.percentage <= 50) {
                        level = anxietyLevels.mild[language];
                    } else if (score.percentage <= 75) {
                        level = anxietyLevels.moderate[language];
                    } else {
                        level = anxietyLevels.severe[language];
                    }

                    return {
                        level: level.level,
                        desc: level.desc,
                        score: score.totalScore,
                        maxScore: score.maxPossibleScore,
                        percentage: score.percentage,
                        recommendations: language === 'ar' ? [
                            'ممارسة تمارين التنفس العميق يومياً',
                            'الانتظام في ممارسة الرياضة',
                            'تقليل تناول الكافيين',
                            'الحفاظ على جدول نوم منتظم',
                            'التحدث مع صديق مقرب عن المشاعر'
                        ] : [
                            'Practice deep breathing exercises daily',
                            'Regular physical exercise',
                            'Reduce caffeine intake',
                            'Maintain a regular sleep schedule',
                            'Talk to a close friend about feelings'
                        ]
                    };
                }
            }
        },

        // مقياس الاكتئاب
        {
            id: 'depression-scale',
            title: { 
                ar: 'مقياس الاكتئاب', 
                en: 'Depression Scale' 
            },
            description: { 
                ar: 'مقياس لتقييم أعراض الاكتئاب وتحديد شدتها من خلال أسئلة علمية معتمدة',
                en: 'A scale to assess depression symptoms and determine their severity through validated scientific questions'
            },
            category: 'mental_health',
            icon: 'fas fa-cloud',
            time: '15 دقائق',
            questions: 15,
            rating: 4.6,
            reviews: 89,
            questions: [
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالحزن والفراغ معظم الوقت",
                        en: "I feel sad and empty most of the time"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "فقدت الاهتمام بالأنشطة التي كنت أستمتع بها",
                        en: "I lost interest in activities I used to enjoy"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أعاني من تغيرات في الشهية والوزن",
                        en: "I experience changes in appetite and weight"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أواجه صعوبة في النوم أو أنام أكثر من المعتاد",
                        en: "I have trouble sleeping or sleep more than usual"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالتعب والإرهاق معظم الوقت",
                        en: "I feel tired and exhausted most of the time"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بعدم القيمة ولوم الذات",
                        en: "I feel worthless and blame myself"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أجد صعوبة في التركيز واتخاذ القرارات",
                        en: "I have difficulty concentrating and making decisions"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أفكر في الموت أو إيذاء النفس",
                        en: "I think about death or self-harm"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر باليأس تجاه المستقبل",
                        en: "I feel hopeless about the future"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أعاني من اضطرابات في الحركة (بطء أو هياج)",
                        en: "I experience movement disorders (slowness or agitation)"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أتجنب التواصل مع الآخرين",
                        en: "I avoid social interactions"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بعدم الرضا عن حياتي",
                        en: "I feel dissatisfied with my life"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أعاني من آلام جسدية بدون سبب طبي",
                        en: "I experience physical pains without medical cause"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "أشعر بالذنب بشكل مفرط",
                        en: "I feel excessive guilt"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                },
                {
                    type: 'multiple_choice',
                    text: {
                        ar: "فقدت الطاقة والدافعية للقيام بالمهام",
                        en: "I lost energy and motivation to do tasks"
                    },
                    required: true,
                    options: [
                        { ar: "غير صحيح", en: "Not true", value: 0 },
                        { ar: "قليلاً", en: "A little", value: 1 },
                        { ar: "معتدل", en: "Moderate", value: 2 },
                        { ar: "كثيراً", en: "A lot", value: 3 }
                    ],
                    category: "depression"
                }
            ],
            scoring: {
                calculateScore: (answers, questions) => {
                    let totalScore = 0;
                    let maxPossibleScore = 0;

                    questions.forEach((question, index) => {
                        const answer = answers[index];
                        if (answer !== undefined) {
                            const option = question.options[answer];
                            if (option && option.value !== undefined) {
                                totalScore += option.value;
                            }
                        }
                        // حساب أقصى درجة ممكنة
                        const maxOptionValue = Math.max(...question.options.map(opt => opt.value));
                        maxPossibleScore += maxOptionValue;
                    });

                    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

                    return {
                        totalScore: totalScore,
                        maxPossibleScore: maxPossibleScore,
                        percentage: percentage
                    };
                },
                interpretation: (score, language) => {
                    const depressionLevels = {
                        minimal: {
                            ar: { 
                                level: 'حد أدنى', 
                                desc: 'لا تظهر عليك أعراض اكتئاب ملحوظة. هذا مؤشر إيجابي على صحتك النفسية.' 
                            },
                            en: { 
                                level: 'Minimal', 
                                desc: 'No noticeable depression symptoms. This is a positive indicator of your mental health.' 
                            }
                        },
                        mild: {
                            ar: { 
                                level: 'خفيف', 
                                desc: 'هناك بعض أعراض الاكتئاب الخفيفة. قد تستفيد من الدعم الاجتماعي والأنشطة الإيجابية.' 
                            },
                            en: { 
                                level: 'Mild', 
                                desc: 'There are some mild depression symptoms. You may benefit from social support and positive activities.' 
                            }
                        },
                        moderate: {
                            ar: { 
                                level: 'متوسط', 
                                desc: 'أعراض اكتئاب واضحة. نوصي بالاستشارة النفسية والدعم المهني.' 
                            },
                            en: { 
                                level: 'Moderate', 
                                desc: 'Clear depression symptoms. We recommend psychological consultation and professional support.' 
                            }
                        },
                        severe: {
                            ar: { 
                                level: 'شديد', 
                                desc: 'أعراض اكتئاب شديدة. نوصي بمراجعة فورية لأخصائي الصحة النفسية.' 
                            },
                            en: { 
                                level: 'Severe', 
                                desc: 'Severe depression symptoms. Immediate consultation with a mental health specialist is recommended.' 
                            }
                        }
                    };

                    let level;
                    if (score.percentage <= 25) {
                        level = depressionLevels.minimal[language];
                    } else if (score.percentage <= 50) {
                        level = depressionLevels.mild[language];
                    } else if (score.percentage <= 75) {
                        level = depressionLevels.moderate[language];
                    } else {
                        level = depressionLevels.severe[language];
                    }

                    // إضافة تنبيه مهم إذا كانت النتيجة عالية
                    const warning = score.percentage > 75 ? (language === 'ar' 
                        ? '⚠️ نوصي بمراجعة أخصائي صحة نفسية في أقرب وقت ممكن'
                        : '⚠️ We recommend seeing a mental health specialist as soon as possible'
                    ) : '';

                    return {
                        level: level.level,
                        desc: level.desc + (warning ? `\n\n${warning}` : ''),
                        score: score.totalScore,
                        maxScore: score.maxPossibleScore,
                        percentage: score.percentage,
                        recommendations: language === 'ar' ? [
                            'التواصل مع الأصدقاء والعائلة',
                            'ممارسة النشاط البدني المنتظم',
                            'الخروج في الهواء الطلق',
                            'ممارسة الهوايات المفضلة',
                            'طلب الدعم النفسي إذا لزم الأمر'
                        ] : [
                            'Connect with friends and family',
                            'Practice regular physical activity',
                            'Spend time outdoors',
                            'Engage in favorite hobbies',
                            'Seek psychological support if needed'
                        ],
                        emergencyContact: score.percentage > 75 ? (language === 'ar' 
                            ? 'خطوط المساعدة النفسية: 920033360'
                            : 'Psychological help lines: 920033360'
                        ) : null
                    };
                }
            }
        }
      ],
      
      categories: [
        { id: 'mental_health', name: { ar: 'الصحة النفسية', en: 'Mental Health' } },
        { id: 'personality', name: { ar: 'الشخصية', en: 'Personality' } },
        { id: 'career', name: { ar: 'المهنية', en: 'Career' } },
        { id: 'relationships', name: { ar: 'العلاقات', en: 'Relationships' } }
      ],
      
      tabs: [
        { id: 'all', name: { ar: 'جميع المقاييس', en: 'All Measures' } },
        { id: 'in_progress', name: { ar: 'قيد التقدم', en: 'In Progress' } },
        { id: 'completed', name: { ar: 'مكتمل', en: 'Completed' } },
        { id: 'new', name: { ar: 'جديد', en: 'New' } }
      ],
      
      userProgress: [
        { measureId: 1, completed: false, currentQuestion: 5, answers: [0, 1, 2, 1, 0] },
        { measureId: 2, completed: true, score: 42, maxScore: 60, date: '2024-01-15' }
      ],
      
      recentActivity: [
        {
          id: 1,
          measure: {
            title: { ar: 'مقياس الاكتئاب', en: 'Depression Scale' }
          },
          date: '2024-01-15',
          score: 42,
          maxScore: 60
        }
      ]
    }
  },
  computed: {
    statistics() {
      const total = this.measures.length
      const completed = this.userProgress.filter(p => p.completed).length
      const inProgress = this.userProgress.filter(p => !p.completed && p.currentQuestion > 0).length
      const avgScore = this.userProgress.filter(p => p.completed)
        .reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / completed || 0
      
      return {
        totalMeasures: total,
        completed: completed,
        inProgress: inProgress,
        averageScore: Math.round(avgScore)
      }
    },
    
    filteredMeasures() {
      let filtered = this.measures
      
      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(measure => 
          this.getTranslatedTitle(measure).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          this.getTranslatedDescription(measure).toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(measure => measure.category === this.selectedCategory)
      }
      
      // Filter by tab
      switch (this.activeTab) {
        case 'in_progress':
          filtered = filtered.filter(measure => 
            this.userProgress.some(p => p.measureId === measure.id && !p.completed && p.currentQuestion > 0)
          )
          break
        case 'completed':
          filtered = filtered.filter(measure => 
            this.userProgress.some(p => p.measureId === measure.id && p.completed)
          )
          break
        case 'new':
          filtered = filtered.filter(measure => 
            !this.userProgress.some(p => p.measureId === measure.id)
          )
          break
      }
      
      return filtered
    }
  },
  methods: {
    translate(key) {
      return t(key, this.language)
    },
    
    getTranslatedTitle(measure) {
      return typeof measure.title === 'object' ? measure.title[this.language] : measure.title
    },
    
    getTranslatedDescription(measure) {
      return typeof measure.description === 'object' ? measure.description[this.language] : measure.description
    },
    
    getTranslatedCategory(category) {
      return category.name[this.language]
    },
    
    getTranslatedCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name[this.language] : categoryId
    },
    
    getCategoryClass(category) {
      const classes = {
        mental_health: 'bg-blue-100 text-blue-800',
        personality: 'bg-green-100 text-green-800',
        career: 'bg-purple-100 text-purple-800',
        relationships: 'bg-pink-100 text-pink-800'
      }
      return classes[category] || 'bg-gray-100 text-gray-800'
    },
    
    getScoreClass(score, maxScore) {
      const percentage = (score / maxScore) * 100
      if (percentage >= 80) return 'bg-green-100 text-green-800'
      if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    },
    
    getMeasureProgress(measureId) {
      const progress = this.userProgress.find(p => p.measureId === measureId)
      if (!progress) return null
      
      if (progress.completed) {
        return {
          percentage: 100,
          currentQuestion: progress.currentQuestion,
          completed: true
        }
      }
      
      return {
        percentage: Math.round((progress.currentQuestion / this.measures.find(m => m.id === measureId).questions.length) * 100),
        currentQuestion: progress.currentQuestion,
        completed: false
      }
    },
    
    viewMeasureDetails(measure) {
      // Navigate to measure details page or show details modal
      console.log('View details for:', measure)
    },
    
    startMeasure(measure) {
      this.selectedMeasure = measure
      const progress = this.getMeasureProgress(measure.id)
      
      if (progress && !progress.completed) {
        // Continue from where user left off
        this.currentQuestionIndex = progress.currentQuestion
        this.currentAnswers = [...this.userProgress.find(p => p.measureId === measure.id).answers]
        this.testStep = 'questions'
      } else {
        // Start new test
        this.currentQuestionIndex = 0
        this.currentAnswers = new Array(measure.questions.length).fill(undefined)
        this.testStep = 'info'
      }
    },
    
    closeModal() {
      this.selectedMeasure = null
      this.testStep = 'info'
      this.currentQuestionIndex = 0
      this.currentAnswers = []
      this.testResult = null
    },
    
    startTest() {
      this.testStep = 'questions'
    },
    
    nextQuestion() {
      if (this.currentQuestionIndex < this.selectedMeasure.questions.length - 1) {
        this.currentQuestionIndex++
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },
    
    submitTest() {
      this.testStep = 'loading'
      
      // Simulate API call
      setTimeout(() => {
        // Calculate score (mock implementation)
        const score = this.currentAnswers.reduce((sum, answer) => sum + (answer || 0), 0)
        const maxScore = this.selectedMeasure.questions.length * 4
        
        this.testResult = {
          score: score,
          maxScore: maxScore,
          interpretation: {
            level: {
              ar: 'متوسط',
              en: 'Moderate'
            },
            desc: {
              ar: 'نتيجتك تشير إلى مستوى متوسط. نوصي بمتابعة القراءة والاستشارة إذا لزم الأمر.',
              en: 'Your results indicate a moderate level. We recommend further reading and consultation if needed.'
            }
          }
        }
        
        this.testStep = 'results'
        
        // Update user progress
        this.updateUserProgress(true, score, maxScore)
      }, 2000)
    },
    
    retakeTest() {
      this.currentQuestionIndex = 0
      this.currentAnswers = new Array(this.selectedMeasure.questions.length).fill(undefined)
      this.testStep = 'questions'
      this.testResult = null
    },
    
    showOtherMeasures() {
      this.closeModal()
      // Optionally scroll to measures list
    },
    
    updateUserProgress(completed = false, score = null, maxScore = null) {
      const measureId = this.selectedMeasure.id
      const existingIndex = this.userProgress.findIndex(p => p.measureId === measureId)
      
      if (existingIndex >= 0) {
        this.userProgress[existingIndex] = {
          measureId,
          completed,
          currentQuestion: completed ? this.selectedMeasure.questions.length : this.currentQuestionIndex,
          answers: [...this.currentAnswers],
          score,
          maxScore,
          date: new Date().toISOString().split('T')[0]
        }
      } else {
        this.userProgress.push({
          measureId,
          completed,
          currentQuestion: completed ? this.selectedMeasure.questions.length : this.currentQuestionIndex,
          answers: [...this.currentAnswers],
          score,
          maxScore,
          date: new Date().toISOString().split('T')[0]
        })
      }
      
      // Add to recent activity if completed
      if (completed) {
        this.recentActivity.unshift({
          id: Date.now(),
          measure: this.selectedMeasure,
          date: new Date().toISOString().split('T')[0],
          score,
          maxScore
        })
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString(this.language === 'ar' ? 'ar-SA' : 'en-US')
    }
  }
}
</script>
<!-- <script>
import { t } from '@/locales'
import MeasureModal from '@/components/frontend/measures/MeasureModal.vue'
import { 
  measuresData, 
  getUserProgress, 
  saveUserProgress, 
  getRecentActivity, 
  saveRecentActivity 
} from '@/data/measures'

export default {
  name: 'MeasuresDashboard',
  components: {
    MeasureModal
  },
  data() {
    return {
      language: 'ar',
      searchQuery: '',
      selectedCategory: '',
      activeTab: 'all',
      selectedMeasure: null,
      testStep: 'info',
      currentQuestionIndex: 0,
      currentAnswers: [],
      testResult: null,
      
      // Data imported from external file
      measures: measuresData.measures,
      categories: measuresData.categories,
      tabs: measuresData.tabs,
      
      // User data from localStorage
      userProgress: [],
      recentActivity: []
    }
  },
  computed: {
    statistics() {
      const total = this.measures.length
      const completed = this.userProgress.filter(p => p.completed).length
      const inProgress = this.userProgress.filter(p => !p.completed && p.currentQuestion > 0).length
      const completedMeasures = this.userProgress.filter(p => p.completed)
      const avgScore = completedMeasures.length > 0 
        ? completedMeasures.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / completedMeasures.length 
        : 0
      
      return {
        totalMeasures: total,
        completed: completed,
        inProgress: inProgress,
        averageScore: Math.round(avgScore)
      }
    },
    
    filteredMeasures() {
      let filtered = this.measures
      
      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(measure => 
          this.getTranslatedTitle(measure).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          this.getTranslatedDescription(measure).toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(measure => measure.category === this.selectedCategory)
      }
      
      // Filter by tab
      switch (this.activeTab) {
        case 'in_progress':
          filtered = filtered.filter(measure => 
            this.userProgress.some(p => p.measureId === measure.id && !p.completed && p.currentQuestion > 0)
          )
          break
        case 'completed':
          filtered = filtered.filter(measure => 
            this.userProgress.some(p => p.measureId === measure.id && p.completed)
          )
          break
        case 'new':
          filtered = filtered.filter(measure => 
            !this.userProgress.some(p => p.measureId === measure.id)
          )
          break
      }
      
      return filtered
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      this.userProgress = getUserProgress()
      this.recentActivity = getRecentActivity()
    },
    
    translate(key) {
      return t(key, this.language)
    },
    
    getTranslatedTitle(measure) {
      return typeof measure.title === 'object' ? measure.title[this.language] : measure.title
    },
    
    getTranslatedDescription(measure) {
      return typeof measure.description === 'object' ? measure.description[this.language] : measure.description
    },
    
    getTranslatedCategory(category) {
      return category.name[this.language]
    },
    
    getTranslatedTab(tab) {
      return tab.name[this.language]
    },
    
    getTranslatedCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name[this.language] : categoryId
    },
    
    getCategoryIcon(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.icon : 'fas fa-question'
    },
    
    getCategoryClass(category) {
      const classes = {
        mental_health: 'bg-blue-100 text-blue-800',
        personality: 'bg-green-100 text-green-800',
        career: 'bg-purple-100 text-purple-800',
        relationships: 'bg-pink-100 text-pink-800',
        wellness: 'bg-orange-100 text-orange-800'
      }
      return classes[category] || 'bg-gray-100 text-gray-800'
    },
    
    getScoreClass(score, maxScore) {
      const percentage = (score / maxScore) * 100
      if (percentage >= 80) return 'bg-green-100 text-green-800'
      if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    },
    
    getMeasureProgress(measureId) {
      const progress = this.userProgress.find(p => p.measureId === measureId)
      if (!progress) return null
      
      if (progress.completed) {
        return {
          percentage: 100,
          currentQuestion: progress.currentQuestion,
          completed: true
        }
      }
      
      const measure = this.measures.find(m => m.id === measureId)
      return {
        percentage: Math.round((progress.currentQuestion / measure.questions.length) * 100),
        currentQuestion: progress.currentQuestion,
        completed: false
      }
    },
    
    viewMeasureDetails(measure) {
      // Navigate to measure details page or show details modal
      console.log('View details for:', measure)
    },
    
    startMeasure(measure) {
      this.selectedMeasure = measure
      const progress = this.getMeasureProgress(measure.id)
      
      if (progress && !progress.completed) {
        // Continue from where user left off
        this.currentQuestionIndex = progress.currentQuestion
        this.currentAnswers = [...this.userProgress.find(p => p.measureId === measure.id).answers]
        this.testStep = 'questions'
      } else {
        // Start new test
        this.currentQuestionIndex = 0
        this.currentAnswers = new Array(measure.questions.length).fill(undefined)
        this.testStep = 'info'
      }
    },
    
    closeModal() {
      this.selectedMeasure = null
      this.testStep = 'info'
      this.currentQuestionIndex = 0
      this.currentAnswers = []
      this.testResult = null
    },
    
    startTest() {
      this.testStep = 'questions'
    },
    
    nextQuestion() {
      if (this.currentQuestionIndex < this.selectedMeasure.questions.length - 1) {
        this.currentQuestionIndex++
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },
    
    submitTest() {
      this.testStep = 'loading'
      
      // Simulate API call
      setTimeout(() => {
        // Calculate score based on option values
        const score = this.currentAnswers.reduce((sum, answerIndex, index) => {
          if (answerIndex === undefined) return sum
          const option = this.selectedMeasure.options[answerIndex]
          return sum + (option.value || answerIndex)
        }, 0)
        
        const maxScore = this.selectedMeasure.questions.length * 
          Math.max(...this.selectedMeasure.options.map(opt => opt.value || 0))
        
        // Find interpretation
        const interpretation = this.selectedMeasure.scoring?.interpretation?.find(range => 
          score >= range.min && score <= range.max
        ) || {
          level: { ar: 'غير محدد', en: 'Undefined' },
          desc: { ar: 'لا توجد تفسيرات متاحة', en: 'No interpretations available' }
        }
        
        this.testResult = {
          score: score,
          maxScore: maxScore,
          interpretation: interpretation
        }
        
        this.testStep = 'results'
        
        // Update user progress
        this.updateUserProgress(true, score, maxScore)
      }, 2000)
    },
    
    retakeTest() {
      this.currentQuestionIndex = 0
      this.currentAnswers = new Array(this.selectedMeasure.questions.length).fill(undefined)
      this.testStep = 'questions'
      this.testResult = null
    },
    
    showOtherMeasures() {
      this.closeModal()
    },
    
    updateUserProgress(completed = false, score = null, maxScore = null) {
      const measureId = this.selectedMeasure.id
      const existingIndex = this.userProgress.findIndex(p => p.measureId === measureId)
      
      const progressData = {
        measureId,
        completed,
        currentQuestion: completed ? this.selectedMeasure.questions.length : this.currentQuestionIndex,
        answers: [...this.currentAnswers],
        score,
        maxScore,
        date: new Date().toISOString().split('T')[0]
      }
      
      if (existingIndex >= 0) {
        this.userProgress[existingIndex] = progressData
      } else {
        this.userProgress.push(progressData)
      }
      
      // Save to localStorage
      saveUserProgress(this.userProgress)
      
      // Add to recent activity if completed
      if (completed) {
        const activity = {
          id: Date.now(),
          measure: this.selectedMeasure,
          date: new Date().toISOString().split('T')[0],
          score,
          maxScore
        }
        
        this.recentActivity.unshift(activity)
        // Keep only last 10 activities
        this.recentActivity = this.recentActivity.slice(0, 10)
        saveRecentActivity(this.recentActivity)
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString(this.language === 'ar' ? 'ar-SA' : 'en-US')
    }
  }
}
</script> -->
<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>