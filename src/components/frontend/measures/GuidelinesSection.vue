<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="guidelines-section rounded-2xl p-8 max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4 text-gray-800">إرشادات هامة قبل البدء</h2>
          <p class="text-gray-600">لضمان الحصول على نتائج دقيقة وموثوقة</p>
        </div>
        
        <ul class="guidelines-list space-y-4 text-gray-700 text-lg">
          <li>اختر وقتًا تكون فيه في حالة استرخاء وتركيز</li>
          <li>أجب بصدق ودون تردد، فلا توجد إجابات صحيحة أو خاطئة</li>
          <li>اقرأ كل سؤال بعناية قبل الإجابة</li>
          <li>لا تستغرق وقتًا طويلاً في التفكير في كل سؤال</li>
          <li>تأكد من أنك في بيئة هادئة ومناسبة</li>
          <li>هذه النتائج لأغراض توجيهية ولا تغني عن استشارة المختص</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GuidelinesSection'
}
</script>

<style scoped>
.guidelines-section {
  background: rgba(158, 191, 59, 0.05);
  border-right: 4px solid #9EBF3B;
}

.guidelines-list li {
  position: relative;
  padding-right: 30px;
}

.guidelines-list li::before {
  content: '✓';
  position: absolute;
  right: 0;
  top: 0;
  color: #9EBF3B;
  font-weight: bold;
}
</style>