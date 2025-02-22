import { defineStore } from 'pinia';

/**
 * Store for managing authentication state.
 * Stores the username and provides methods to update and retrieve it.
 */
export const useAuthStore = defineStore('auth', {
    state: () => ({
        /**
         * The username (or email) of the authenticated user.
         */
        username: '',
    }),
    actions: {
        /**
         * Updates the username.
         * @param newUsername - The new username to set.
         */
        setUsername(newUsername: string) {
            this.username = newUsername;
        },
    },
    getters: {
        /**
         * Returns the current username.
         */
        getUsername: (state) => state.username,
    },
});