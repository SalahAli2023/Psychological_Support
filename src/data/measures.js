
export const measuresData = [
            // ========== مقياس القلق  ==========
            {
                id: 'anxiety',
                title: 'anxietyScale',
                description: { 
                    ar: 'مقياس معتمد عالمياً لتقييم أعراض القلق العام وشدتها خلال الأسبوعين الماضيين',
                    en: 'Internationally certified scale to assess general anxiety symptoms and their severity over the past two weeks'
                },
                category: 'women',
                icon: 'fas fa-heartbeat',
                questions: 7,
                time: '3-5',
                rating: 4,
                reviews: 128,
                questions: [
                    { ar: "خلال الأسبوعين الماضيين، كم مرة شعرت بالتوتر أو القلق أو التوتر الشديد؟", en: "Over the last two weeks, how often have you felt nervous, anxious, or on edge?" },
                    { ar: "كم مرة وجدت صعوبة في التوقف عن القلق أو السيطرة عليه؟", en: "How often have you been unable to stop or control worrying?" },
                    { ar: "كم مرة قلقك تسبب في صعوبة في التركيز على ما تفعله؟", en: "How often have you had trouble relaxing?" },
                    { ar: "كم مرة شعرت بصعوبة في الاسترخاء؟", en: "How often have you been so restless that it's hard to sit still?" },
                    { ar: "كم مرة شعرت بعدم الراحة لدرجة أنك تجلس بهدوء كان صعباً؟", en: "How often have you become easily annoyed or irritable?" },
                    { ar: "كم مرة أصبحت منزعجاً أو غاضباً بسهولة؟", en: "How often have you felt afraid as if something awful might happen?" },
                    { ar: "كم مرة شعرت بالخوف كما لو أن شيئاً فظيعاً قد يحدث؟", en: "How often have you felt afraid as if something awful might happen?" }
                ],
                options: [
                    { ar: "أبداً", en: "Not at all" },
                    { ar: "عدة أيام", en: "Several days" },
                    { ar: "أكثر من نصف الأيام", en: "More than half the days" },
                    { ar: "تقريباً كل يوم", en: "Nearly every day" }
                ],
                scores: [0, 1, 2, 3],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'قلق طفيف أو معدوم', desc: 'مستوى قلقك ضمن المعدل الطبيعي. هذا مؤشر جيد على صحتك النفسية.' },
                            { level: 'قلق بسيط', desc: 'تعاني من مستوى بسيط من القلق. قد يكون مفيداً تعلم تقنيات إدارة القلق.' },
                            { level: 'قلق متوسط', desc: 'القلق المتوسط قد يؤثر على جودة حياتك. ننصح بمناقشة النتائج مع أخصائي نفسي.' },
                            { level: 'قلق شديد', desc: 'مستوى القلق شديد ويحتاج إلى تدخل فوري. ننصح بمراجعة أخصائي نفسي بأسرع وقت.' }
                        ],
                        en: [
                            { level: 'Minimal or No Anxiety', desc: 'Your anxiety level is within the normal range. This is a good indicator of your mental health.' },
                            { level: 'Mild Anxiety', desc: 'You experience mild anxiety. It might be helpful to learn anxiety management techniques.' },
                            { level: 'Moderate Anxiety', desc: 'Moderate anxiety may affect your quality of life. We recommend discussing results with a psychologist.' },
                            { level: 'Severe Anxiety', desc: 'Anxiety level is severe and requires immediate intervention. We recommend seeing a psychologist as soon as possible.' }
                        ]
                    };
                    
                    if (score <= 4) return results[lang][0];
                    if (score <= 9) return results[lang][1];
                    if (score <= 14) return results[lang][2];
                    return results[lang][3];
                }
            },
            
            // ========== مقياس الاكتئاب  ==========
            {
                id: 'depression',
                title: 'depressionScale',
                description: { 
                    ar: 'تقييم لمشاعر الحزن والاكتئاب ومدى تأثيرها على حياتك اليومية',
                    en: 'Assessment of sadness and depression feelings and their impact on your daily life'
                },
                category: 'women',
                icon: 'fas fa-cloud',
                questions: 9,
                time: '4-6',
                rating: 4,
                reviews: 156,
                questions: [
                    { ar: "قلة الاهتمام أو المتعة في doing things", en: "Little interest or pleasure in doing things" },
                    { ar: "الشعور بالحزن أو الاكتئاب أو اليأس", en: "Feeling down, depressed, or hopeless" },
                    { ar: "صعوبة في النوم أو النوم أكثر من اللازم", en: "Trouble falling or staying asleep, or sleeping too much" },
                    { ar: "الشعور بالتعب أو قلة الطاقة", en: "Feeling tired or having little energy" },
                    { ar: "قلة الشهية أو الإفراط في الأكل", en: "Poor appetite or overeating" },
                    { ar: "الشعور بعدم الرضا عن النفس", en: "Feeling bad about yourself" },
                    { ar: "صعوبة في التركيز", en: "Trouble concentrating on things" },
                    { ar: "التحدث أو التحرك ببطء شديد", en: "Moving or speaking so slowly that other people could have noticed" },
                    { ar: "أفكار حول إيذاء النفس", en: "Thoughts that you would be better off dead" }
                ],
                options: [
                    { ar: "أبداً", en: "Not at all" },
                    { ar: "عدة أيام", en: "Several days" },
                    { ar: "أكثر من نصف الأيام", en: "More than half the days" },
                    { ar: "تقريباً كل يوم", en: "Nearly every day" }
                ],
                scores: [0, 1, 2, 3],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'اكتئاب طفيف أو معدوم', desc: 'مستوى الاكتئاب ضمن المعدل الطبيعي.' },
                            { level: 'اكتئاب بسيط', desc: 'تعاني من مستوى بسيط من الاكتئاب. قد تحتاج لمتابعة حالتك.' },
                            { level: 'اكتئاب متوسط', desc: 'الاكتئاب المتوسط يؤثر على حياتك. ننصح باستشارة أخصائي.' },
                            { level: 'اكتئاب شديد متوسط', desc: 'مستوى الاكتئاب شديد ويحتاج لتدخل فوري.' },
                            { level: 'اكتئاب شديد جداً', desc: 'مستوى الاكتئاب شديد جداً ويتطلب رعاية فورية.' }
                        ],
                        en: [
                            { level: 'Minimal Depression', desc: 'Depression level is within normal range.' },
                            { level: 'Mild Depression', desc: 'You experience mild depression. You may need to monitor your condition.' },
                            { level: 'Moderate Depression', desc: 'Moderate depression affects your life. We recommend consulting a specialist.' },
                            { level: 'Moderately Severe Depression', desc: 'Depression level is severe and requires immediate intervention.' },
                            { level: 'Severe Depression', desc: 'Depression level is very severe and requires immediate care.' }
                        ]
                    };
                    
                    if (score <= 4) return results[lang][0];
                    if (score <= 9) return results[lang][1];
                    if (score <= 14) return results[lang][2];
                    if (score <= 19) return results[lang][3];
                    return results[lang][4];
                }
            },

            // ========== مقياس الضغوط النفسية ==========
            {
                id: 'psychological-stress',
                title: 'stressScale',
                description: { 
                    ar: 'تقييم مستوى الضغوط والتوتر النفسي الذي تتعرض له في الحياة اليومية', 
                    en: 'Assessment of psychological stress and tension levels in daily life'
                },
                category: 'women',
                icon: 'fas fa-weight',
                questions: 10,
                time: '5-7',
                rating: 4,
                reviews: 92,
                questions: [
                    { 
                        ar: "أشعر أنني غير قادر على السيطرة على الأمور المهمة في حياتي", 
                        en: "I feel unable to control important things in my life" 
                    },
                    { 
                        ar: "أشعر بالتوتر والضيق النفسي معظم الوقت", 
                        en: "I feel nervous and psychologically distressed most of the time" 
                    },
                    { 
                        ar: "أشعر بالثقة حول قدرتي على التعامل مع المشاكل الشخصية", 
                        en: "I feel confident about my ability to handle personal problems" 
                    },
                    { 
                        ar: "أشعر أن الأمور تسير في طريقها كما أخطط", 
                        en: "I feel things are going my way as I plan" 
                    },
                    { 
                        ar: "أشعر أن المسؤوليات تتراكم ولا أستطيع التعامل معها", 
                        en: "I feel responsibilities are piling up and I cannot handle them" 
                    },
                    { 
                        ar: "أشعر أنني أستطيع التحكم في الانفعالات في حياتي", 
                        en: "I feel I can control the irritations in my life" 
                    },
                    { 
                        ar: "أجد نفسي أفكر باستمرار في الأمور التي علي إنجازها", 
                        en: "I find myself constantly thinking about things I need to accomplish" 
                    },
                    { 
                        ar: "أستطيع التحكم في المضايقات اليومية بشكل جيد", 
                        en: "I can handle daily hassles well" 
                    },
                    { 
                        ar: "أشعر أنني أسيطر على حياتي بشكل كامل", 
                        en: "I feel I am in complete control of my life" 
                    },
                    { 
                        ar: "أشعر بالغضب بسبب أمور خارجة عن إرادتي", 
                        en: "I feel angry about things outside my control" 
                    }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { 
                                level: 'ضغوط نفسية منخفضة', 
                                desc: 'مستوى الضغوط النفسية الذي تتعرض له منخفض ومقبول. هذا مؤشر جيد على صحتك النفسية.' 
                            },
                            { 
                                level: 'ضغوط نفسية متوسطة', 
                                desc: 'تعاني من مستوى متوسط من الضغوط النفسية. حاول تطوير استراتيجيات إدارة التوتر.' 
                            },
                            { 
                                level: 'ضغوط نفسية عالية', 
                                desc: 'مستوى الضغوط النفسية مرتفع ويحتاج لاستراتيجيات فعالة للتعامل معه. ننصح بطلب الدعم.' 
                            },
                            { 
                                level: 'ضغوط نفسية شديدة', 
                                desc: 'مستوى الضغوط النفسية شديد ويتطلب تدخلاً فورياً. ننصح بمراجعة أخصائي نفسي.' 
                            }
                        ],
                        en: [
                            { 
                                level: 'Low Psychological Stress', 
                                desc: 'The level of psychological stress you are exposed to is low and acceptable. This is a good indicator of your mental health.' 
                            },
                            { 
                                level: 'Moderate Psychological Stress', 
                                desc: 'You experience moderate levels of psychological stress. Try to develop stress management strategies.' 
                            },
                            { 
                                level: 'High Psychological Stress', 
                                desc: 'Psychological stress level is high and requires effective coping strategies. We recommend seeking support.' 
                            },
                            { 
                                level: 'Severe Psychological Stress', 
                                desc: 'Psychological stress level is severe and requires immediate intervention. We recommend consulting a psychologist.' 
                            }
                        ]
                    };
                    
                    if (score <= 13) return results[lang][0];
                    if (score <= 26) return results[lang][1];
                    if (score <= 35) return results[lang][2];
                    return results[lang][3];
                }
            },

            // ========== مقياس جودة الحياة ==========
            {
                id: 'quality-of-life',
                title: 'qualityOfLifeScale',
                description: { 
                    ar: 'قياس مستوى الرضا عن مختلف جوانب الحياة وتحديد مجالات التحسين', 
                    en: 'Measuring satisfaction levels with various life aspects and identifying improvement areas'
                },
                category: 'women',
                icon: 'fas fa-home',
                questions: 8,
                time: '6-8',
                rating: 4,
                reviews: 87,
                questions: [
                    { 
                        ar: "ما مدى رضاك عن صحتك الجسدية؟", 
                        en: "How satisfied are you with your physical health?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن صحتك النفسية والعاطفية؟", 
                        en: "How satisfied are you with your mental and emotional health?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن علاقاتك الاجتماعية والأسرية؟", 
                        en: "How satisfied are you with your social and family relationships?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن وضعك المالي واستقرارك الاقتصادي؟", 
                        en: "How satisfied are you with your financial situation and economic stability?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن عملك أو دراستك؟", 
                        en: "How satisfied are you with your work or studies?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن وقت فراغك والأنشطة الترفيهية؟", 
                        en: "How satisfied are you with your leisure time and recreational activities?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن بيئتك المعيشية والسكنية؟", 
                        en: "How satisfied are you with your living and housing environment?" 
                    },
                    { 
                        ar: "ما مدى رضاك عن حياتك بشكل عام؟", 
                        en: "How satisfied are you with your life in general?" 
                    }
                ],
                options: [
                    { ar: "غير راضٍ تماماً", en: "Very dissatisfied" },
                    { ar: "غير راضٍ", en: "Dissatisfied" },
                    { ar: "محايد", en: "Neutral" },
                    { ar: "راضٍ", en: "Satisfied" },
                    { ar: "راضٍ تماماً", en: "Very satisfied" }
                ],
                scores: [1, 2, 3, 4, 5],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { 
                                level: 'جودة حياة ممتازة', 
                                desc: 'مستوى رضاك عن حياتك ممتاز. تمتلك توازناً جيداً في مختلف جوانب الحياة.' 
                            },
                            { 
                                level: 'جودة حياة جيدة', 
                                desc: 'مستوى رضاك جيد ولكن هناك بعض المجالات التي يمكن تحسينها لرفع جودة الحياة.' 
                            },
                            { 
                                level: 'جودة حياة متوسطة', 
                                desc: 'هناك عدة مجالات في حياتك تحتاج للاهتمام والتحسين لرفع مستوى الرضا العام.' 
                            },
                            { 
                                level: 'جودة حياة تحتاج تحسين', 
                                desc: 'هناك مجالات متعددة في حياتك تحتاج للاهتمام الفوري والتحسين.' 
                            }
                        ],
                        en: [
                            { 
                                level: 'Excellent Quality of Life', 
                                desc: 'Your life satisfaction level is excellent. You have a good balance in various aspects of life.' 
                            },
                            { 
                                level: 'Good Quality of Life', 
                                desc: 'Your satisfaction level is good but there are some areas that can be improved to enhance quality of life.' 
                            },
                            { 
                                level: 'Moderate Quality of Life', 
                                desc: 'There are several areas in your life that need attention and improvement to raise overall satisfaction.' 
                            },
                            { 
                                level: 'Quality of Life Needs Improvement', 
                                desc: 'There are multiple areas in your life that need immediate attention and improvement.' 
                            }
                        ]
                    };
                    
                    if (score >= 35) return results[lang][0];
                    if (score >= 25) return results[lang][1];
                    if (score >= 15) return results[lang][2];
                    return results[lang][3];
                }
            },

            // ========== مقياس تقدير الذات ==========
            {
                id: 'self-esteem',
                title: 'selfEsteemScale',
                description: { 
                    ar: 'تقييم مستوى الثقة بالنفس وتقدير الذات من خلال مقياس علمي معتمد', 
                    en: 'Assessment of self-confidence and self-esteem through a certified scientific scale'
                },
                category: 'women',
                icon: 'fas fa-star',
                questions: 10,
                time: '5-7',
                rating: 4,
                reviews: 103,
                questions: [
                    { 
                        ar: "أشعر أنني شخص ذو قيمة، على الأقل مساو للآخرين", 
                        en: "I feel that I am a person of worth, at least on an equal plane with others" 
                    },
                    { 
                        ar: "أشعر أن لدي عدداً من الصفات الحسنة", 
                        en: "I feel that I have a number of good qualities" 
                    },
                    { 
                        ar: "أميل إلى الشعور بأنني فاشل", 
                        en: "I am inclined to feel that I am a failure" 
                    },
                    { 
                        ar: "أستطيع أن أفعل الأشياء بنفس كفاءة معظم الناس", 
                        en: "I can do things as well as most other people" 
                    },
                    { 
                        ar: "أشعر أنه ليس لدي الكثير لأفتخر به", 
                        en: "I feel I do not have much to be proud of" 
                    },
                    { 
                        ar: "أتخذ موقفاً إيجابياً تجاه نفسي", 
                        en: "I take a positive attitude toward myself" 
                    },
                    { 
                        ar: "أنا راضٍ عن نفسي بشكل عام", 
                        en: "On the whole, I am satisfied with myself" 
                    },
                    { 
                        ar: "أتمنى أن أكون قادراً على احترام نفسي أكثر", 
                        en: "I wish I could have more respect for myself" 
                    },
                    { 
                        ar: "أشعر أحياناً أنني لا أصلح لشيء", 
                        en: "I certainly feel useless at times" 
                    },
                    { 
                        ar: "أعتقد أنني شخص غير كفء في بعض الأحيان", 
                        en: "At times I think I am no good at all" 
                    }
                ],
                options: [
                    { ar: "غير موافق بشدة", en: "Strongly disagree" },
                    { ar: "غير موافق", en: "Disagree" },
                    { ar: "موافق", en: "Agree" },
                    { ar: "موافق بشدة", en: "Strongly agree" }
                ],
                // الأسئلة 3، 5، 8، 9، 10 عكسية (reverse scored)
                scores: (questionIndex) => {
                    const reverseQuestions = [2, 4, 7, 8, 9]; // indices of reverse-scored questions
                    return reverseQuestions.includes(questionIndex) ? [3, 2, 1, 0] : [0, 1, 2, 3];
                },
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { 
                                level: 'تقدير ذات مرتفع', 
                                desc: 'تمتلك تقديراً ذاتياً صحياً ومستوى ممتازاً من الثقة بالنفس. هذا يساعدك في مواجهة تحديات الحياة.' 
                            },
                            { 
                                level: 'تقدير ذات متوسط', 
                                desc: 'مستوى تقدير الذات مقبول ولكن يمكن تحسينه. العمل على تعزيز الثقة بالنفس سيفيدك.' 
                            },
                            { 
                                level: 'تقدير ذات منخفض', 
                                desc: 'مستوى تقدير الذات منخفض ويحتاج للعمل على تعزيز الثقة بالنفس وتطوير صورة ذاتية إيجابية.' 
                            },
                            { 
                                level: 'تقدير ذات منخفض جداً', 
                                desc: 'هناك حاجة ملحة للعمل على تعزيز تقدير الذات والثقة بالنفس. ننصح بطلب الدعم المهني.' 
                            }
                        ],
                        en: [
                            { 
                                level: 'High Self-Esteem', 
                                desc: 'You have healthy self-esteem and an excellent level of self-confidence. This helps you face life challenges.' 
                            },
                            { 
                                level: 'Moderate Self-Esteem', 
                                desc: 'Self-esteem level is acceptable but can be improved. Working on boosting self-confidence will benefit you.' 
                            },
                            { 
                                level: 'Low Self-Esteem', 
                                desc: 'Self-esteem level is low and needs work to boost self-confidence and develop a positive self-image.' 
                            },
                            { 
                                level: 'Very Low Self-Esteem', 
                                desc: 'There is an urgent need to work on enhancing self-esteem and self-confidence. We recommend seeking professional support.' 
                            }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    if (score >= 10) return results[lang][2];
                    return results[lang][3];
                }
            },
            
            // ========== مقياس فرط النشاط ونقص الانتباه ==========
            {
                id: 'child-adhd',
                title: 'adhdScale',
                description: { 
                    ar: 'تقييم أعراض فرط النشاط ونقص الانتباه لدى الأطفال',
                    en: 'Assessment of hyperactivity and attention deficit symptoms in children'
                },
                category: 'children',
                icon: 'fas fa-running',
                questions: 8,
                time: '4-6',
                rating: 4,
                reviews: 64,
                questions: [
                    { ar: "هل يجد الطفل صعوبة في البقاء جالساً؟", en: "Does the child have difficulty staying seated?" },
                    { ar: "هل يتشتت انتباه الطفل بسهولة؟", en: "Is the child easily distracted?" },
                    { ar: "هل يجد الطفل صعوبة في انتظار دوره؟", en: "Does the child have difficulty waiting for their turn?" },
                    { ar: "هل يتحدث الطفل بشكل مفرط؟", en: "Does the child talk excessively?" },
                    { ar: "هل يجد الطفل صعوبة في اتباع التعليمات؟", en: "Does the child have difficulty following instructions?" },
                    { ar: "هل يفقد الطفل أشياءه بشكل متكرر؟", en: "Does the child frequently lose things?" },
                    { ar: "هل يتحرك الطفل بشكل دائم؟", en: "Is the child constantly moving?" },
                    { ar: "هل يقاطع الطفل الآخرين؟", en: "Does the child interrupt others?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" }
                ],
                scores: [0, 1, 2, 3],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'أعراض طفيفة', desc: 'الأعراض ضمن المعدل الطبيعي.' },
                            { level: 'أعراض متوسطة', desc: 'هناك مؤشرات على وجود أعراض تحتاج للمراقبة.' },
                            { level: 'أعراض واضحة', desc: 'هناك مؤشرات واضحة تحتاج لتقييم متخصص.' }
                        ],
                        en: [
                            { level: 'Mild Symptoms', desc: 'Symptoms are within normal range.' },
                            { level: 'Moderate Symptoms', desc: 'There are indicators that need monitoring.' },
                            { level: 'Clear Symptoms', desc: 'There are clear indicators that need specialist evaluation.' }
                        ]
                    };
                    
                    if (score <= 8) return results[lang][0];
                    if (score <= 16) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس اكتئاب الأطفال ==========
            {
                id: 'child-depression',
                title: 'childDepressionScale',
                description: { 
                    ar: 'تقييم مشاعر الحزن والاكتئاب لدى الأطفال والمراهقين',
                    en: 'Assessment of sadness and depression feelings in children and adolescents'
                },
                category: 'children',
                icon: 'fas fa-sad-tear',
                questions: 8,
                time: '4-5',
                rating: 4,
                reviews: 58,
                questions: [
                    { ar: "كم مرة يشعر الطفل بالحزن أو البكاء؟", en: "How often does the child feel sad or cry?" },
                    { ar: "كم مرة يشعر بعدم الرغبة في اللعب أو مقابلة الأصدقاء؟", en: "How often does the child feel unwilling to play or meet friends?" },
                    { ar: "كم مرة يشعر بالتعب والإرهاق؟", en: "How often does the child feel tired and exhausted?" },
                    { ar: "كم مرة يشعر بعدم الرغبة في تناول الطعام؟", en: "How often does the child feel unwilling to eat?" },
                    { ar: "كم مرة يشعر بصعوبة في النوم؟", en: "How often does the child have difficulty sleeping?" },
                    { ar: "كم مرة يشعر بعدم الرضا عن نفسه؟", en: "How often does the child feel dissatisfied with themselves?" },
                    { ar: "كم مرة يشعر بصعوبة في التركيز؟", en: "How often does the child have difficulty concentrating?" },
                    { ar: "كم مرة يشعر بأن لا أحد يحبه؟", en: "How often does the child feel that no one loves them?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "قليلاً", en: "A little" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "كثيراً", en: "Often" }
                ],
                scores: [0, 1, 2, 3],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'معدل طبيعي', desc: 'مشاعر الطفل ضمن المعدل الطبيعي.' },
                            { level: 'اكتئاب بسيط', desc: 'الطفل يعاني من مشاعر اكتئاب بسيطة تحتاج للمراقبة.' },
                            { level: 'اكتئاب واضح', desc: 'هناك علامات واضحة للاكتئاب تحتاج لتدخل مختص.' }
                        ],
                        en: [
                            { level: 'Normal Range', desc: 'The child feelings are within normal range.' },
                            { level: 'Mild Depression', desc: 'The child experiences mild depressive feelings that need monitoring.' },
                            { level: 'Clear Depression', desc: 'There are clear signs of depression that need specialist intervention.' }
                        ]
                    };
                    
                    if (score <= 8) return results[lang][0];
                    if (score <= 16) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس الكفاءة الاجتماعية ==========
            {
                id: 'social-competence',
                title: 'socialCompetenceScale',
                description: { 
                    ar: 'تقييم المهارات الاجتماعية والقدرة على التفاعل مع الآخرين',
                    en: 'Assessment of social skills and ability to interact with others'
                },
                category: 'children',
                icon: 'fas fa-users',
                questions: 8,
                time: '4-6',
                rating: 4,
                reviews: 45,
                questions: [
                    { ar: "كم مرة يبدأ الطفل المحادثات مع الآخرين؟", en: "How often does the child start conversations with others?" },
                    { ar: "كم مرة يشارك الطفل في الأنشطة الجماعية؟", en: "How often does the child participate in group activities?" },
                    { ar: "كم مرة يساعد الطفل الآخرين؟", en: "How often does the child help others?" },
                    { ar: "كم مرة يعبر الطفل عن مشاعره بشكل مناسب؟", en: "How often does the child express feelings appropriately?" },
                    { ar: "كم مرة يحل الطفل النزاعات بطريقة سلمية؟", en: "How often does the child resolve conflicts peacefully?" },
                    { ar: "كم مرة يظهر الطفل التعاطف مع الآخرين؟", en: "How often does the child show empathy towards others?" },
                    { ar: "كم مرة يتبع الطفل القواعد الاجتماعية؟", en: "How often does the child follow social rules?" },
                    { ar: "كم مرة يتعاون الطفل مع الآخرين؟", en: "How often does the child cooperate with others?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'كفاءة عالية', desc: 'المهارات الاجتماعية ممتازة.' },
                            { level: 'كفاءة متوسطة', desc: 'المهارات الاجتماعية جيدة ولكن يمكن تطويرها.' },
                            { level: 'كفاءة منخفضة', desc: 'هناك حاجة لتطوير المهارات الاجتماعية.' }
                        ],
                        en: [
                            { level: 'High Competence', desc: 'Social skills are excellent.' },
                            { level: 'Moderate Competence', desc: 'Social skills are good but can be developed.' },
                            { level: 'Low Competence', desc: 'There is a need to develop social skills.' }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    return results[lang][2];
                }
            },

            // ========== مقياس اضطرابات الشخصية ==========
            {
                id: 'personality-disorders',
                title: 'personalityDisordersScale',
                description: { 
                    ar: 'مقياس متقدم لتقييم أنماط الشخصية والاضطرابات المحتملة',
                    en: 'Advanced scale to assess personality patterns and potential disorders'
                },
                category: 'children',
                icon: 'fas fa-user-md',
                questions: 12,
                time: '10-12',
                rating: 4,
                reviews: 76,
                questions: [
                    { ar: "هل تواجه صعوبة في الحفاظ على علاقات مستقرة؟", en: "Do you have difficulty maintaining stable relationships?" },
                    { ar: "هل تعاني من تقلبات مزاجية حادة؟", en: "Do you experience severe mood swings?" },
                    { ar: "هل تشعر بعدم الاستقرار في هويتك الشخصية؟", en: "Do you feel unstable in your personal identity?" },
                    { ar: "هل تواجه صعوبة في السيطرة على الغضب؟", en: "Do you have difficulty controlling anger?" },
                    { ar: "هل تعاني من الخوف من الهجر؟", en: "Do you suffer from fear of abandonment?" },
                    { ar: "هل تشعر بالفراغ الداخلي؟", en: "Do you feel empty inside?" },
                    { ar: "هل تواجه صعوبة في الثقة بالآخرين؟", en: "Do you have difficulty trusting others?" },
                    { ar: "هل تعاني من الشك في نوايا الآخرين؟", en: "Do you suffer from suspicion of others intentions?" },
                    { ar: "هل تشعر بعدم الارتياح في المواقف الاجتماعية؟", en: "Do you feel uncomfortable in social situations?" },
                    { ar: "هل تواجه صعوبة في اتخاذ القرارات؟", en: "Do you have difficulty making decisions?" },
                    { ar: "هل تعاني من الحساسية المفرطة للنقد؟", en: "Are you overly sensitive to criticism?" },
                    { ar: "هل تشعر بالحاجة الدائمة للاهتمام؟", en: "Do you constantly feel the need for attention?" }
                ],
                options: [
                    { ar: "لا ينطبق أبداً", en: "Never applies" },
                    { ar: "ينطبق نادراً", en: "Rarely applies" },
                    { ar: "ينطبق أحياناً", en: "Sometimes applies" },
                    { ar: "ينطبق غالباً", en: "Often applies" },
                    { ar: "ينطبق دائماً", en: "Always applies" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'نمط شخصي طبيعي', desc: 'لا توجد مؤشرات واضحة لاضطرابات الشخصية.' },
                            { level: 'سمات شخصية تحتاج مراقبة', desc: 'هناك بعض السمات التي تحتاج للمتابعة.' },
                            { level: 'احتمال وجود اضطراب شخصي', desc: 'هناك مؤشرات لاضطراب شخصي تحتاج لتقييم متخصص.' }
                        ],
                        en: [
                            { level: 'Normal Personality Pattern', desc: 'No clear indicators of personality disorders.' },
                            { level: 'Personality Traits Need Monitoring', desc: 'There are some traits that need follow-up.' },
                            { level: 'Possible Personality Disorder', desc: 'There are indicators of personality disorder that need specialist evaluation.' }
                        ]
                    };
                    
                    if (score <= 18) return results[lang][0];
                    if (score <= 30) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس الذكاء العاطفي ==========
            {
                id: 'emotional-intelligence',
                title: 'emotionalIntelligenceScale',
                description: { 
                    ar: 'تقييم القدرة على فهم وإدارة المشاعر والعواطف',
                    en: 'Assessment of the ability to understand and manage emotions and feelings'
                },
                category: 'children',
                icon: 'fas fa-brain',
                questions: 10,
                time: '8-10',
                rating: 4,
                reviews: 89,
                questions: [
                    { ar: "هل يمكنك التعرف على مشاعرك بدقة؟", en: "Can you accurately identify your emotions?" },
                    { ar: "هل يمكنك التحكم في مشاعرك عند الغضب؟", en: "Can you control your emotions when angry?" },
                    { ar: "هل تفهم مشاعر الآخرين بسهولة؟", en: "Do you easily understand others emotions?" },
                    { ar: "هل تستطيع التعاطف مع الآخرين؟", en: "Can you empathize with others?" },
                    { ar: "هل تستطيع تحفيز نفسك عند الفشل؟", en: "Can you motivate yourself after failure?" },
                    { ar: "هل تستطيع بناء علاقات جيدة مع الآخرين؟", en: "Can you build good relationships with others?" },
                    { ar: "هل تستطيع حل النزاعات بشكل بناء؟", en: "Can you resolve conflicts constructively?" },
                    { ar: "هل تتعامل مع الضغوط بشكل فعال؟", en: "Do you handle stress effectively?" },
                    { ar: "هل تستطيع التكيف مع التغيرات؟", en: "Can you adapt to changes?" },
                    { ar: "هل تتحمل المسؤولية عن مشاعرك؟", en: "Do you take responsibility for your emotions?" }
                ],
                options: [
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'ذكاء عاطفي مرتفع', desc: 'تمتلك مهارات عالية في الذكاء العاطفي.' },
                            { level: 'ذكاء عاطفي متوسط', desc: 'مهارات الذكاء العاطفي جيدة ولكن يمكن تطويرها.' },
                            { level: 'ذكاء عاطفي يحتاج تطوير', desc: 'هناك حاجة لتطوير مهارات الذكاء العاطفي.' }
                        ],
                        en: [
                            { level: 'High Emotional Intelligence', desc: 'You have high emotional intelligence skills.' },
                            { level: 'Moderate Emotional Intelligence', desc: 'Emotional intelligence skills are good but can be developed.' },
                            { level: 'Emotional Intelligence Needs Development', desc: 'There is a need to develop emotional intelligence skills.' }
                        ]
                    };
                    
                    if (score >= 30) return results[lang][0];
                    if (score >= 20) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس العنف الأسري ==========
            {
                id: 'domestic-violence',
                title: 'domesticViolenceScale',
                description: { 
                    ar: 'تقييم التعرض للعنف الأسري وتأثيره على الصحة النفسية',
                    en: 'Assessment of exposure to domestic violence and its impact on mental health'
                },
                category: 'women',
                icon: 'fas fa-shield-alt',
                questions: 8,
                time: '5-7',
                rating: 4,
                reviews: 52,
                questions: [
                    { ar: "هل تعرضت للإهانة أو السب من قبل أحد أفراد أسرتك؟", en: "Have you been insulted or cursed by a family member?" },
                    { ar: "هل تعرضت للتهديد أو التخويف؟", en: "Have you been threatened or intimidated?" },
                    { ar: "هل تعرضت للعزل عن الأهل والأصدقاء؟", en: "Have you been isolated from family and friends?" },
                    { ar: "هل تعرضت للحرمان من الموارد المالية؟", en: "Have you been deprived of financial resources?" },
                    { ar: "هل تعرضت للإيذاء الجسدي؟", en: "Have you been physically abused?" },
                    { ar: "هل تعرضت للإكراه على ممارسة العلاقة الزوجية؟", en: "Have you been coerced into marital relations?" },
                    { ar: "هل تعرضت للتحكم في قراراتك الشخصية؟", en: "Have you been controlled in your personal decisions?" },
                    { ar: "هل تعرضت للمضايقات أو التحرش؟", en: "Have you been harassed or molested?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'لا يوجد عنف أسري', desc: 'لم تتعرض للعنف الأسري. هذا مؤشر جيد على بيئة أسرية آمنة.' },
                            { level: 'عنف أسري بسيط', desc: 'تعرضت لبعض أشكال العنف الأسري البسيطة. قد تحتاج لدعم.' },
                            { level: 'عنف أسري متوسط', desc: 'تعرضت لمستوى متوسط من العنف الأسري. ننصح بطلب المساعدة المتخصصة.' },
                            { level: 'عنف أسري شديد', desc: 'تعرضت لمستوى شديد من العنف الأسري. ننصح بطلب المساعدة الفورية.' }
                        ],
                        en: [
                            { level: 'No Domestic Violence', desc: 'You have not been exposed to domestic violence. This is a good indicator of a safe family environment.' },
                            { level: 'Mild Domestic Violence', desc: 'You have been exposed to some forms of mild domestic violence. You may need support.' },
                            { level: 'Moderate Domestic Violence', desc: 'You have been exposed to a moderate level of domestic violence. We recommend seeking specialized help.' },
                            { level: 'Severe Domestic Violence', desc: 'You have been exposed to a severe level of domestic violence. We recommend seeking immediate help.' }
                        ]
                    };
                    
                    if (score <= 8) return results[lang][0];
                    if (score <= 16) return results[lang][1];
                    if (score <= 24) return results[lang][2];
                    return results[lang][3];
                }
            },
            
            // ========== مقياس الصدمات النفسية ==========
            {
                id: 'trauma',
                title: { ar: 'مقياس الصدمات النفسية', en: 'Psychological Trauma Scale' },
                description: { 
                    ar: 'تقييم التعرض للصدمات النفسية وتأثيرها على الحالة النفسية',
                    en: 'Assessment of exposure to psychological trauma and its impact on mental state'
                },
                category: 'women',
                icon: 'fas fa-first-aid',
                questions: 8,
                time: '6-8',
                rating: 4,
                reviews: 67,
                questions: [
                    { ar: "هل تعرضت لحدث صادم في الماضي؟", en: "Have you experienced a traumatic event in the past?" },
                    { ar: "هل تعاني من ذكريات متكررة عن الحدث؟", en: "Do you suffer from recurring memories of the event?" },
                    { ar: "هل تعاني من كوابيس متعلقة بالحدث؟", en: "Do you have nightmares related to the event?" },
                    { ar: "هل تشعر بالضيق عند تذكر الحدث؟", en: "Do you feel distressed when remembering the event?" },
                    { ar: "هل تتجنب التفكير في الحدث؟", en: "Do you avoid thinking about the event?" },
                    { ar: "هل فقدت الاهتمام بالأنشطة التي كنت تستمتع بها؟", en: "Have you lost interest in activities you used to enjoy?" },
                    { ar: "هل تشعر بالانعزال عن الآخرين؟", en: "Do you feel isolated from others?" },
                    { ar: "هل تواجه صعوبة في النوم أو التركيز؟", en: "Do you have difficulty sleeping or concentrating?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'تأثير طفيف', desc: 'التعرض للصدمة لم يؤثر بشكل كبير على حياتك.' },
                            { level: 'تأثير متوسط', desc: 'هناك تأثير واضح للصدمة على حياتك. قد تحتاج للدعم.' },
                            { level: 'تأثير شديد', desc: 'التعرض للصدمة أثر بشكل كبير على حياتك. ننصح بمراجعة أخصائي.' }
                        ],
                        en: [
                            { level: 'Mild Impact', desc: 'Exposure to trauma has not significantly affected your life.' },
                            { level: 'Moderate Impact', desc: 'There is a clear impact of trauma on your life. You may need support.' },
                            { level: 'Severe Impact', desc: 'Exposure to trauma has significantly affected your life. We recommend seeing a specialist.' }
                        ]
                    };
                    
                    if (score <= 8) return results[lang][0];
                    if (score <= 16) return results[lang][1];
                    return results[lang][2];
                }
            },

            // ========== مقياس التواصل الأسري ==========
            {
                id: 'family-communication',
                title: { ar: 'مقياس التواصل الأسري', en: 'Family Communication Scale' },
                description: { 
                    ar: 'تقييم جودة التواصل والتفاعلات within العائلة',
                    en: 'Assessment of communication quality and interactions within the family'
                },
                category: 'women',
                icon: 'fas fa-home-heart',
                questions: 8,
                time: '5-7',
                rating: 4,
                reviews: 78,
                questions: [
                    { ar: "هل تتحدث مع أفراد عائلتك عن مشاعرك بحرية؟", en: "Do you freely talk about your feelings with family members?" },
                    { ar: "هل يستمع أفراد العائلة لبعضهم البعض باهتمام؟", en: "Do family members listen to each other attentively?" },
                    { ar: "هل تحل المشكلات العائلية بالحوار والتفاهم؟", en: "Are family problems solved through dialogue and understanding?" },
                    { ar: "هل تشعر بالراحة في التعبير عن آرائك في المنزل؟", en: "Do you feel comfortable expressing your opinions at home?" },
                    { ar: "هل يظهر أفراد العائلة الاحترام والتقدير لبعضهم؟", en: "Do family members show respect and appreciation for each other?" },
                    { ar: "هل تشارك العائلة في أنشطة ووقت ممتع معاً؟", en: "Does the family share activities and enjoyable time together?" },
                    { ar: "هل تدعم العائلة بعضها في الأوقات الصعبة؟", en: "Does the family support each other during difficult times?" },
                    { ar: "هل تشعر أن التواصل في عائلتك إيجابي وفعال؟", en: "Do you feel that communication in your family is positive and effective?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'تواصل ممتاز', desc: 'جودة التواصل الأسري ممتازة. استمروا في هذا النمط الإيجابي.' },
                            { level: 'تواصل جيد', desc: 'التواصل الأسري جيد ولكن هناك مجالات للتحسين.' },
                            { level: 'تواصل يحتاج تحسين', desc: 'هناك حاجة لتحسين مهارات التواصل within العائلة.' }
                        ],
                        en: [
                            { level: 'Excellent Communication', desc: 'Family communication quality is excellent. Continue this positive pattern.' },
                            { level: 'Good Communication', desc: 'Family communication is good but there are areas for improvement.' },
                            { level: 'Communication Needs Improvement', desc: 'There is a need to improve communication skills within the family.' }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس ضغوط تربية الأطفال ==========
            {
                id: 'parenting-stress',
                title: { ar: 'مقياس ضغوط تربية الأطفال', en: 'Parenting Stress Scale' },
                description: { 
                    ar: 'تقييم مستوى الضغوط والتحديات في تربية الأطفال',
                    en: 'Assessment of stress levels and challenges in parenting'
                },
                category: 'women',
                icon: 'fas fa-baby',
                questions: 10,
                time: '6-8',
                rating: 4,
                reviews: 89,
                questions: [
                    { ar: "هل تشعر بالإرهاق من متطلبات تربية الأطفال؟", en: "Do you feel overwhelmed by parenting demands?" },
                    { ar: "هل تواجه صعوبة في تحقيق التوازن between العمل والعائلة؟", en: "Do you have difficulty balancing work and family?" },
                    { ar: "هل تشعر بالقلق المستمر regarding مستقبل أطفالك؟", en: "Do you feel constant anxiety about your children future?" },
                    { ar: "هل تواجه تحديات في التعامل with السلوكيات الصعبة للأطفال؟", en: "Do you face challenges dealing with children difficult behaviors?" },
                    { ar: "هل تشعر بعدم الكفاءة في دورك كوالد/ة؟", en: "Do you feel incompetent in your role as a parent?" },
                    { ar: "هل يؤثر التوتر في التربية on صحتك النفسية؟", en: "Does parenting stress affect your mental health?" },
                    { ar: "هل تجد صعوبة في تخصيص وقت لنفسك؟", en: "Do you find it difficult to allocate time for yourself?" },
                    { ar: "هل تشعر بالعزلة في رحلة التربية؟", en: "Do you feel isolated in your parenting journey?" },
                    { ar: "هل تواجه صعوبات مالية تؤثر on التربية؟", en: "Do you face financial difficulties that affect parenting?" },
                    { ar: "هل تشعر أنك تحصل on الدعم الكافي في التربية؟", en: "Do you feel you receive adequate support in parenting?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'ضغوط منخفضة', desc: 'مستوى الضغوط في التربية منخفض ومقبول.' },
                            { level: 'ضغوط متوسطة', desc: 'هناك ضغوط متوسطة في التربية تحتاج للاهتمام.' },
                            { level: 'ضغوط عالية', desc: 'مستوى الضغوط في التربية مرتفع ويحتاج لدعم فوري.' }
                        ],
                        en: [
                            { level: 'Low Stress', desc: 'Parenting stress level is low and acceptable.' },
                            { level: 'Moderate Stress', desc: 'There are moderate parenting stresses that need attention.' },
                            { level: 'High Stress', desc: 'Parenting stress level is high and requires immediate support.' }
                        ]
                    };
                    
                    if (score <= 15) return results[lang][0];
                    if (score <= 30) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس الدافعية الدراسية ==========
            {
                id: 'academic-motivation',
                title: { ar: 'مقياس الدافعية الدراسية', en: 'Academic Motivation Scale' },
                description: { 
                    ar: 'تقييم مستوى الحافز والرغبة في التعلم والتحصيل الدراسي',
                    en: 'Assessment of motivation level and desire for learning and academic achievement'
                },
                category: 'children',
                icon: 'fas fa-graduation-cap',
                questions: 8,
                time: '4-6',
                rating: 4,
                reviews: 72,
                questions: [
                    { ar: "هل تشعر بالحماس للذهاب إلى المدرسة؟", en: "Do you feel enthusiastic about going to school?" },
                    { ar: "هل تستمتع بتعلم مواضيع جديدة؟", en: "Do you enjoy learning new subjects?" },
                    { ar: "هل تبذل جهداً إضافياً في واجباتك المدرسية؟", en: "Do you put extra effort into your school assignments?" },
                    { ar: "هل تحب المشاركة في الأنشطة الصفية؟", en: "Do you like participating in classroom activities?" },
                    { ar: "هل تضع أهدافاً دراسية لنفسك؟", en: "Do you set academic goals for yourself?" },
                    { ar: "هل تشعر بالفخر when تحقق نتائج جيدة؟", en: "Do you feel proud when you achieve good results?" },
                    { ar: "هل تبحث عن معلومات إضافية outside المنهج الدراسي؟", en: "Do you seek additional information outside the curriculum?" },
                    { ar: "هل تحلم بمستقبل أكاديمي ومهني ناجح؟", en: "Do you dream of a successful academic and professional future?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'دافعية عالية', desc: 'مستوى الدافعية الدراسية ممتاز. استمر في هذا الحماس.' },
                            { level: 'دافعية متوسطة', desc: 'الدافعية الدراسية جيدة ولكن يمكن تعزيزها أكثر.' },
                            { level: 'دافعية منخفضة', desc: 'هناك حاجة لتعزيز الدافعية towards الدراسة والتعلم.' }
                        ],
                        en: [
                            { level: 'High Motivation', desc: 'Academic motivation level is excellent. Continue this enthusiasm.' },
                            { level: 'Moderate Motivation', desc: 'Academic motivation is good but can be further enhanced.' },
                            { level: 'Low Motivation', desc: 'There is a need to enhance motivation towards studying and learning.' }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    return results[lang][2];
                }
            },    
            
            // ========== مقياس الضغوط المهنية ==========
            {
                id: 'work-stress',
                title: { ar: 'مقياس الضغوط المهنية', en: 'Professional Stress Scale' },
                description: { 
                    ar: 'تقييم مستوى الضغوط والتحديات في بيئة العمل',
                    en: 'Assessment of stress levels and challenges in the work environment'
                },
                category: 'women',
                icon: 'fas fa-briefcase',
                questions: 10,
                time: '6-8',
                rating: 4,
                reviews: 94,
                questions: [
                    { ar: "هل تشعر بضغط كبير due to عبء العمل؟", en: "Do you feel great pressure due to workload?" },
                    { ar: "هل تواجه صعوبة في تحقيق التوازن between العمل والحياة الشخصية؟", en: "Do you have difficulty balancing work and personal life?" },
                    { ar: "هل تشعر بعدم الأمان الوظيفي؟", en: "Do you feel job insecurity?" },
                    { ar: "هل تواجه تحديات في العلاقات with زملاء العمل؟", en: "Do you face challenges in relationships with colleagues?" },
                    { ar: "هل تشعر بعدم التقدير في عملك؟", en: "Do you feel unappreciated at work?" },
                    { ar: "هل تؤثر ضغوط العمل on صحتك النفسية؟", en: "Does work stress affect your mental health?" },
                    { ar: "هل تواجه صعوبة في تلبية توقعات الرؤساء؟", en: "Do you have difficulty meeting supervisors expectations?" },
                    { ar: "هل تشعر بالإرهاق due to ساعات العمل الطويلة؟", en: "Do you feel exhausted due to long working hours?" },
                    { ar: "هل تواجه صعوبات في التكيف with التغيرات التنظيمية؟", en: "Do you have difficulties adapting to organizational changes?" },
                    { ar: "هل تشعر أنك تحصل on دعم كافي في العمل؟", en: "Do you feel you receive adequate support at work?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'ضغوط مهنية منخفضة', desc: 'مستوى الضغوط المهنية مقبول ومنخفض.' },
                            { level: 'ضغوط مهنية متوسطة', desc: 'هناك ضغوط مهنية متوسطة تحتاج للتعامل معها.' },
                            { level: 'ضغوط مهنية عالية', desc: 'مستوى الضغوط المهنية مرتفع ويحتاج لتدخل.' }
                        ],
                        en: [
                            { level: 'Low Professional Stress', desc: 'Professional stress level is acceptable and low.' },
                            { level: 'Moderate Professional Stress', desc: 'There are moderate professional stresses that need to be addressed.' },
                            { level: 'High Professional Stress', desc: 'Professional stress level is high and requires intervention.' }
                        ]
                    };
                    
                    if (score <= 15) return results[lang][0];
                    if (score <= 30) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس مهارات التكيف ==========
            {
                id: 'coping-skills',
                title: { ar: 'مقياس مهارات التكيف', en: 'Coping Skills Scale' },
                description: { 
                    ar: 'تقييم استراتيجيات التعامل مع الضغوط والتحديات',
                    en: 'Assessment of strategies for dealing with stresses and challenges'
                },
                category: 'women',
                icon: 'fas fa-shield-virus',
                questions: 8,
                time: '5-7',
                rating: 4,
                reviews: 81,
                questions: [
                    { ar: "هل تبحث عن الدعم الاجتماعي when تواجه مشكلات؟", en: "Do you seek social support when facing problems?" },
                    { ar: "هل تستخدم تقنيات الاسترخاء للتعامل with التوتر؟", en: "Do you use relaxation techniques to deal with stress?" },
                    { ar: "هل تحلل المشكلات بهدوء before اتخاذ القرارات؟", en: "Do you analyze problems calmly before making decisions?" },
                    { ar: "هل تمارس الرياضة أو الأنشطة البدنية للتعامل with الضغوط؟", en: "Do you exercise or engage in physical activities to deal with stress?" },
                    { ar: "هل تستطيع التعبير عن مشاعرك بطريقة صحية؟", en: "Can you express your feelings in a healthy way?" },
                    { ar: "هل تضع أهدافاً واقعية يمكن تحقيقها؟", en: "Do you set realistic achievable goals?" },
                    { ar: "هل تستطيع إدارة وقتك بشكل فعال؟", en: "Can you manage your time effectively?" },
                    { ar: "هل تبحث عن حلول إبداعية للمشكلات؟", en: "Do you seek creative solutions to problems?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'مهارات تكيف ممتازة', desc: 'تمتلك استراتيجيات فعالة للتعامل مع الضغوط.' },
                            { level: 'مهارات تكيف جيدة', desc: 'مهارات التكيف جيدة ولكن يمكن تطويرها أكثر.' },
                            { level: 'مهارات تكيف تحتاج تطوير', desc: 'هناك حاجة لتعلم استراتيجيات أفضل للتعامل مع الضغوط.' }
                        ],
                        en: [
                            { level: 'Excellent Coping Skills', desc: 'You have effective strategies for dealing with stress.' },
                            { level: 'Good Coping Skills', desc: 'Coping skills are good but can be further developed.' },
                            { level: 'Coping Skills Need Development', desc: 'There is a need to learn better strategies for dealing with stress.' }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    return results[lang][2];
                }
            },
            
            // ========== مقياس تنظيم الانفعالات ==========
            {
                id: 'emotional-regulation',
                title: { ar: 'مقياس تنظيم الانفعالات', en: 'Emotional Regulation Scale' },
                description: { 
                    ar: 'تقييم القدرة على إدارة المشاعر والتحكم في الانفعالات',
                    en: 'Assessment of the ability to manage emotions and control impulses'
                },
                category: 'women',
                icon: 'fas fa-balance-scale',
                questions: 8,
                time: '5-7',
                rating: 4,
                reviews: 76,
                questions: [
                    { ar: "هل تستطيع التحكم في غضبك في المواقف الصعبة؟", en: "Can you control your anger in difficult situations?" },
                    { ar: "هل تأخذ وقتاً للتفكير before الرد في النقاشات الحادة؟", en: "Do you take time to think before responding in heated discussions?" },
                    { ar: "هل تستطيع تهدئة نفسك when تشعر بالتوتر؟", en: "Can you calm yourself when you feel stressed?" },
                    { ar: "هل تعبر عن مشاعرك بطريقة مناسبة؟", en: "Do you express your feelings in an appropriate way?" },
                    { ar: "هل تتجنب اتخاذ قرارات مهمة when تكون منفعلاً؟", en: "Do you avoid making important decisions when emotional?" },
                    { ar: "هل تستطيع تحويل المشاعر السلبية to طاقة إيجابية؟", en: "Can you transform negative emotions into positive energy?" },
                    { ar: "هل تتعرف على مشاعرك مبكراً before أن تتفاقم؟", en: "Do you recognize your emotions early before they escalate?" },
                    { ar: "هل تستخدم تقنيات للسيطرة on الانفعالات المفاجئة؟", en: "Do you use techniques to control sudden impulses?" }
                ],
                options: [
                    { ar: "أبداً", en: "Never" },
                    { ar: "نادراً", en: "Rarely" },
                    { ar: "أحياناً", en: "Sometimes" },
                    { ar: "غالباً", en: "Often" },
                    { ar: "دائماً", en: "Always" }
                ],
                scores: [0, 1, 2, 3, 4],
                interpretation: (score, lang) => {
                    const results = {
                        ar: [
                            { level: 'تنظيم انفعالي ممتاز', desc: 'قدرتك على إدارة المشاعر والانفعالات ممتازة.' },
                            { level: 'تنظيم انفعالي جيد', desc: 'قدرتك على تنظيم الانفعالات جيدة ولكن يمكن تحسينها.' },
                            { level: 'تنظيم انفعالي يحتاج تحسين', desc: 'هناك حاجة لتحسين مهارات إدارة المشاعر والانفعالات.' }
                        ],
                        en: [
                            { level: 'Excellent Emotional Regulation', desc: 'Your ability to manage emotions and impulses is excellent.' },
                            { level: 'Good Emotional Regulation', desc: 'Your emotional regulation ability is good but can be improved.' },
                            { level: 'Emotional Regulation Needs Improvement', desc: 'There is a need to improve emotion and impulse management skills.' }
                        ]
                    };
                    
                    if (score >= 25) return results[lang][0];
                    if (score >= 15) return results[lang][1];
                    return results[lang][2];
                }
            }
        ];
// تصنيفات المقاييس

export const resourcesData = [
    {
        id: 1,
        title: 'فهم القلق وكيفية التعامل معه',
        excerpt: 'مقال شامل عن أسباب القلق وأعراضه واستراتيجيات فعالة للتعامل معه.',
        image: 'https://picsum.photos/seed/anxiety-article/400/200.jpg',
        link: '#'
    },
    {
        id: 2,
        title: 'تقنيات الاسترخاء العميق',
        excerpt: 'تعلم تقنيات الاسترخاء المختلفة مثل التنفس العميق والتأمل واليوغا.',
        image: 'https://picsum.photos/seed/relaxation-techniques/400/200.jpg',
        link: '#'
    },
    {
        id: 3,
        title: 'بناء الثقة بالنفس',
        excerpt: 'دليل عملي لزيادة الثقة بالنفس وتقدير الذات من خلال تمارين بسيطة.',
        image: 'https://picsum.photos/seed/self-confidence/400/200.jpg',
        link: '#'
    }
];

export const menuItemsData = [
    { id: 'home', link: '#' },
    { id: 'measures', link: '#' },
    { id: 'sessions', link: '#' },
    { id: 'library', link: '#' },
    { id: 'courses', link: '#' },
    { id: 'contact', link: '#' }
];

export const filtersData = [
    { id: 'allMeasures' },
    { id: 'forWomen' },
    { id: 'forChildren' },
];

export const quickLinksData = [
    { id: 'home', url: '#' },
    { id: 'measures', url: '#' },
    { id: 'sessions', url: '#' },
    { id: 'library', url: '#' },
    { id: 'aboutUs', url: '#' }
];

export const titles = {
    home: 'الرئيسية',
    measures: 'المقاييس',
    sessions: 'الجلسات',
    library: 'المكتبة',
    courses: 'الدورات',
    contact: 'اتصل بنا',
    aboutUs: 'من نحن',
    allMeasures: 'جميع المقاييس',
    forWomen: 'للمرأة',
    forChildren: 'للطفل',
    forSpecialists: 'للمختصين'
};

export const categoryTitles = {
    women: { ar: 'للمرأة', en: 'For Women' },
    children: { ar: 'للأطفال', en: 'For Children' },
}

export const categoriesData = [
    {
        id: 'all',
        title: 'كل المقاييس',
        description: 'استعرض جميع المقاييس النفسية المتاحة في المنصة',
        icon: 'fas fa-layer-group',
        filter: 'allMeasures',
        color: 'bg-gradient-to-l from-primary-green to-primary-pink'
    },
    {
        id: 'women',
        title: 'للمرأة',
        description: 'مقاييس متخصصة لصحة المرأة النفسية والتربوية',
        icon: 'fas fa-female',
        filter: 'forWomen',
        color: 'bg-gradient-to-l from-primary-green to-primary-pink'
    },
    {
        id: 'children',
        title: 'للطفل',
        description: 'مقاييس مصممة خصيصاً للأطفال والمراهقين لتقييم النمو والمهارات',
        icon: 'fas fa-child',
        filter: 'forChildren',
        color: 'bg-gradient-to-l from-primary-green to-primary-pink'
    }
];