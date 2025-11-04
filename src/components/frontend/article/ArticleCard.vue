<template>
  <div class="article-card">
    <!-- Image -->
    <div class="image-container">
      <img
        :src="article.image"
        :alt="article.title"
      />
    </div>
     <div class="badge">
        <!-- <i class="fas fa-tag"></i> -->
        {{ article.badge }}
      </div>

    <!-- Content -->
    <div class="article-content">


      <!-- Title -->
      <h3 class="article-title mb-3">{{ article.title }}</h3>

      <!-- Excerpt -->
      <p class="article-excerpt mb-4">{{ article.excerpt }}</p>

      <!-- Author and Read More -->
      <div class="article-footer">
        <div class="author-info">
          <div class="author-details">
            <div class="author-name-container">
              <i class="fas fa-user author-icon"></i>
              <span class="author-name">{{ article.author.name }}</span>
            </div>
            <span class="article-meta">
              <i class="fas fa-calendar-alt"></i>
              {{ article.date }}
            </span>
          </div>
        </div>
        <button class="read-more-btn" @click="$emit('read-more', article.id)">
          <span>{{ readMoreText }}</span>
          <!-- <i class="fas fa-arrow-left"></i> -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  emits: ['read-more'],
  setup() {
    const { translate } = useTranslations()
    
    const readMoreText = translate('buttons.readMore')
    
    return {
      readMoreText
    }
  }
}
</script>
