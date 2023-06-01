import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import router from "../router";

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
        },
        logout() {
            this.valid = false;
            this.id = '';
            this.name = '';
            this.email = '';
            this.role = '';
            this.token = '';
            router.push('/login');
        }
    }
});