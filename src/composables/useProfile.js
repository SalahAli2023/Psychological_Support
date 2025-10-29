import { ref } from 'vue'
import { useNotifications } from './useNotifications'

export const useProfile = () => {
  const { showSuccess, showError } = useNotifications()
  const user = ref(null)

  const login = async (credentials) => {
    try {
      // محاكاة عملية تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const storedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '[]')
      const userCredential = storedCredentials.find(
        cred => (cred.email === credentials.email || cred.username === credentials.email) && 
                cred.password === credentials.password
      )
      
      if (userCredential) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        user.value = users.find(u => u.email === userCredential.email || u.username === userCredential.username)
        
        localStorage.setItem('currentUser', JSON.stringify(user.value))
        showSuccess('تم تسجيل الدخول بنجاح!')
        return true
      } else {
        showError('بيانات الدخول غير صحيحة')
        return false
      }
    } catch (error) {
      showError('حدث خطأ أثناء تسجيل الدخول')
      return false
    }
  }

  return {
    user,
    login
  }
}