// src/composables/useLanguage.js
import { inject } from 'vue'
import { t } from '@/locales'

export function useLanguage() {
  const languageState = inject('languageState')
  
  if (!languageState) {
    throw new Error('useLanguage must be used within a component that provides languageState')
  }
  
  const { currentLanguage, toggleLanguage } = languageState
  
  // Translation function
  const translate = (key) => t(key, currentLanguage.value)
  
  return {
    currentLanguage,
    toggleLanguage,
    t: translate
  }
}