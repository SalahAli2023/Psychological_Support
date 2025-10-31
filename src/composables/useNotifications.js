import { ref } from 'vue'

export const useNotifications = () => {
    const showSuccess = (message) => {
        // تنفيذ عرض إشعار النجاح
        console.log('Success:', message)
        // يمكن استخدام مكتبة مثل Toast أو SweetAlert
        alert(`✅ ${message}`)
    }

    const showError = (message) => {
        // تنفيذ عرض إشعار الخطأ
        console.error('Error:', message)
        alert(`❌ ${message}`)
    }

    return {
        showSuccess,
        showError
    }
}