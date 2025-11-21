<template>
  <div class="min-h-screen bg-black">
    <!-- Video Layout -->
    <div class="video-layout">
      <!-- Main Video Area -->
      <div class="video-area">
        <!-- Patient Video (Main) -->
        <div class="main-video">
          <video ref="patientVideo" autoplay class="video-element"></video>
          <div class="video-overlay">
            <span class="participant-name">أنت</span>
            <div class="video-status">
              <i class="fas fa-microphone" :class="{ 'text-red-500': !audioEnabled }"></i>
              <i class="fas fa-video" :class="{ 'text-red-500': !videoEnabled }"></i>
            </div>
          </div>
        </div>

        <!-- Therapist Video (Picture-in-Picture) -->
        <div class="pip-video">
          <video ref="therapistVideo" autoplay muted class="video-element"></video>
          <div class="video-overlay">
            <span class="participant-name">{{ therapist.name }}</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-bar">
        <button 
          @click="toggleAudio"
          class="control-btn"
          :class="audioEnabled ? 'bg-gray-600' : 'bg-red-600'"
        >
          <i class="fas" :class="audioEnabled ? 'fa-microphone' : 'fa-microphone-slash'"></i>
        </button>
        
        <button 
          @click="toggleVideo"
          class="control-btn"
          :class="videoEnabled ? 'bg-gray-600' : 'bg-red-600'"
        >
          <i class="fas" :class="videoEnabled ? 'fa-video' : 'fa-video-slash'"></i>
        </button>
        
        <button @click="endSession" class="control-btn bg-red-600 hover:bg-red-700">
          <i class="fas fa-phone-slash"></i>
        </button>
        
        <button @click="toggleChat" class="control-btn" :class="showChat ? 'bg-blue-600' : 'bg-gray-600'">
          <i class="fas fa-comment"></i>
        </button>
      </div>
    </div>

    <!-- Chat Panel -->
    <div v-if="showChat" class="chat-panel">
      <div class="chat-header">
        <h3 class="text-white">الدردشة</h3>
        <button @click="toggleChat" class="text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="chat-messages">
        <div 
          v-for="message in chatMessages" 
          :key="message.id"
          class="message"
          :class="message.sender === 'therapist' ? 'message-therapist' : 'message-patient'"
        >
          <div class="message-content">
            {{ message.text }}
          </div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
      
      <div class="chat-input">
        <input 
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="اكتب رسالتك..."
          class="message-input"
        >
        <button @click="sendMessage" class="send-btn">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <!-- Session Info -->
    <div class="session-info">
      <div class="info-item">
        <i class="fas fa-clock"></i>
        <span>{{ timeRemaining }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-user-md"></i>
        <span>{{ therapist.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoSession',
  data() {
    return {
      audioEnabled: true,
      videoEnabled: true,
      showChat: false,
      timeRemaining: '45:00',
      newMessage: '',
      therapist: {
        name: 'د. عمرو عادل'
      },
      chatMessages: [
        {
          id: 1,
          sender: 'therapist',
          text: 'مرحبًا، كيف تشعر اليوم؟',
          time: '14:05'
        }
      ]
    }
  },
  mounted() {
    this.initializeSession()
    this.startSessionTimer()
  },
  methods: {
    initializeSession() {
      // Initialize video session
      this.startVideo()
      this.startAudio()
    },
    
    startVideo() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.$refs.patientVideo.srcObject = stream
        })
        .catch(error => {
          console.error('Error accessing camera:', error)
        })
    },
    
    startAudio() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Audio stream would be handled by your video conferencing library
        })
        .catch(error => {
          console.error('Error accessing microphone:', error)
        })
    },
    
    toggleAudio() {
      this.audioEnabled = !this.audioEnabled
      // Implement actual audio toggle logic
    },
    
    toggleVideo() {
      this.videoEnabled = !this.videoEnabled
      // Implement actual video toggle logic
    },
    
    toggleChat() {
      this.showChat = !this.showChat
    },
    
    sendMessage() {
      if (this.newMessage.trim()) {
        this.chatMessages.push({
          id: Date.now(),
          sender: 'patient',
          text: this.newMessage,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        })
        this.newMessage = ''
      }
    },
    
    startSessionTimer() {
      let minutes = 45
      let seconds = 0
      
      const timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer)
            this.endSession()
            return
          }
          minutes--
          seconds = 59
        } else {
          seconds--
        }
        
        this.timeRemaining = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }, 1000)
    },
    
    endSession() {
      if (confirm('هل تريد إنهاء الجلسة؟')) {
        // Implement session end logic
        this.$router.push('/sessions')
      }
    }
  }
}
</script>

<style scoped>
.video-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.video-area {
  flex: 1;
  position: relative;
  background: #000;
}

.main-video {
  width: 100%;
  height: 100%;
  position: relative;
}

.pip-video {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 200px;
  height: 150px;
  border: 2px solid white;
  border-radius: 8px;
  overflow: hidden;
  background: #333;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-status {
  display: flex;
  gap: 0.5rem;
}

.controls-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.8);
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover {
  transform: scale(1.1);
}

.chat-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 350px;
  background: white;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e2e8f0;
}

.chat-header {
  padding: 1rem;
  background: #1f2937;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f8fafc;
}

.message {
  margin-bottom: 1rem;
}

.message-patient {
  text-align: left;
}

.message-therapist {
  text-align: right;
}

.message-content {
  padding: 0.75rem;
  border-radius: 1rem;
  display: inline-block;
  max-width: 80%;
}

.message-patient .message-content {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-therapist .message-content {
  background: #e5e7eb;
  color: #374151;
  border-bottom-left-radius: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}

.message-input:focus {
  border-color: #3b82f6;
}

.send-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0 1rem;
  cursor: pointer;
}

.send-btn:hover {
  background: #2563eb;
}

.session-info {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .pip-video {
    width: 120px;
    height: 90px;
  }
  
  .chat-panel {
    width: 100%;
  }
  
  .controls-bar {
    padding: 0.5rem;
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
  }
}
</style>