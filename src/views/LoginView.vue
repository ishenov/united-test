<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Enter Name</ion-card-title>
              </ion-card-header>

              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-input
                        v-model="username"
                        label="Enter name"
                        label-placement="floating"
                        placeholder="Enter your name"
                        required
                    ></ion-input>
                  </ion-item>
                </ion-list>

                <!-- Login Button -->
                <ion-button
                    expand="full"
                    @click="handleLogin"
                    :disabled="!isFormValid"
                >
                  Login
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/vue';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {useAuthStore} from "@/stores/authStore";

export default defineComponent({
  name: 'LoginView',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore(); // Access auth store

    // Reactive state for username input
    const username = ref('');

    /** Checks if the form is valid. */
    const isFormValid = computed(() => {
      return username.value.trim() !== '';
    });

    /** Handles login logic. */
    const handleLogin = () => {
      console.log('Logging in with:', username.value);
      authStore.setUsername(username.value); // Set username in store
      router.push('/chat'); // Redirect to chat page
    };

    return {
      username,
      isFormValid,
      handleLogin,
    };
  },
});
</script>

<style scoped>
ion-card {
  max-width: 500px;
  margin: 0 auto;
}

ion-button {
  margin-top: 20px;
}

ion-text {
  display: block;
  margin-top: 10px;
}
</style>