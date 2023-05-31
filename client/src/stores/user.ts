import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        valid: useLocalStorage('valid', false),
        id: useLocalStorage('id', ''),
        name: useLocalStorage('name', ''),
        email: useLocalStorage('email', ''),
        role: useLocalStorage('role', ''),
        token: useLocalStorage('token', ''),
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: any) {
            this.valid = true;
            this.id = user.id;
            this.name = user.username;
            this.email = user.email;
            this.role = user.role;
        }
    }
});