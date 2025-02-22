<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
        ref="contentRef"
        :scroll-events="true"
        class="ion-padding"
    >
      <div class="messages-container">
        <div class="date-divider">Today</div>
        <div
            v-for="message in messages"
            :key="message.id"
            :class="[
            'message-wrapper',
            'animate-message',
            message.user === username ? 'my-message' : 'other-message'
          ]"
        >
          <div class="message-content">
            <span class="user-name">
              {{ message.user }}
            </span>
            <ion-card>
              <ion-card-content>
                {{ message.message }}
                <div class="message-metadata">
                  <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-item lines="none" class="message-input">
          <ion-input
              v-model="newMessage"
              placeholder="Type a message..."
              class="custom-input"
              @keyup.enter="sendMessage"
          />
          <ion-button
              slot="end"
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="send-button"
          >
            <ion-icon :icon="sendOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, computed} from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonInput,
  IonButton
} from '@ionic/vue';
import { SignalRService } from '@/services/signalr.service';
import { ChatMessage } from '@/types/chat.types';
import { v4 as uuidv4 } from 'uuid';
import {useAuthStore} from "@/stores/authStore";
import router from "@/router";
import {attachOutline, send, sendOutline} from 'ionicons/icons';

export default defineComponent({
  name: 'ChatRoom',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonInput,
    IonButton
  },
  setup() {
    const signalRService = new SignalRService();
    const messages = ref<ChatMessage[]>([]);
    const newMessage = ref('');
    const contentRef = ref();

    const authStore = useAuthStore();
    const username = computed(() => authStore.username); // Get username from store

    /** Scrolls chat to the bottom. */
    const scrollToBottom = () => {
      if (contentRef.value) {
        contentRef.value.$el.scrollToBottom(300);
      }
    };

    /** Sends a new message. */
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        await signalRService.sendMessage(username.value, newMessage.value);
        newMessage.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    /**
     * Formats time as "HH:MM".
     * @param date - The message timestamp.
     * @returns Formatted time string.
     */
    const formatTime = (date: Date): string => {
      return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    onMounted(async () => {
      if (!username.value) {
        await router.push('/');
      } else {
        console.log(username.value)
      }

      await signalRService.startConnection();

      signalRService.onReceiveMessage((user: string, message: string) => {
        messages.value.push({
          id: uuidv4(),
          user,
          message,
          timestamp: new Date()
        });
        scrollToBottom();
      });
    });

    return {
      username,
      messages,
      newMessage,
      contentRef,
      sendMessage,
      formatTime,
      send,
      sendOutline,
      attachOutline,
    };
  }
});
</script>

<style scoped>
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
}

.date-divider {
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  margin: 16px 0;
  position: relative;
}

.date-divider::before,
.date-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: var(--ion-color-medium);
  opacity: 0.3;
}

.date-divider::before {
  left: 0;
}

.date-divider::after {
  right: 0;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 4px 0;
  max-width: 85%;
}

.message-wrapper.my-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-wrapper.other-message {
  margin-right: auto;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-left: 12px;
}

.my-message ion-card {
  --background: var(--ion-color-primary);
  --color: var(--ion-color-primary-contrast);
  margin-left: auto;
}

.other-message ion-card {
  --background: var(--ion-color-light);
}

ion-card {
  margin: 0;
  box-shadow: none;
  border-radius: 18px;
}

.message-metadata {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-input {
  --background: var(--ion-color-light);
  border-radius: 24px;
  margin: 8px;
}

.custom-input {
  --padding-start: 8px;
  --padding-end: 8px;
  --background: transparent;
}

.send-button {
  --border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0;
}

.animate-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>