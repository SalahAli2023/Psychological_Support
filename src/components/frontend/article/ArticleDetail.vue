
<template>
  <div class="bg-white">
    <!-- الهيدر -->
    <Header />
    
    <!-- محتوى تفاصيل المقالة -->
    <ArticleDetailContent :article-id="articleId" />
    
    <!-- الفوتر -->
    <Footer />
  </div>
</template>

<script>
import ArticleDetailContent from './ArticleDetailContent.vue'
import Header from '@/components/frontend/layouts/Header.vue'  
import Footer from '@/components/frontend/layouts/Footer.vue'  

export default {
  name: 'ArticleDetail',
  components: {
    ArticleDetailContent,
    Header,
    Footer
  },
  data() {
    return {
      articleId: this.$route.params.id
    }
  }
}

</script>