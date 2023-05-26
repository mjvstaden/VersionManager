import { defineStore } from "pinia";

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        valid: false,
        id: '',
        name: '',
        email: '',
        role: '',
        token: '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: any) {
            this.id = user.id;
            this.name = user.username;
            this.email = user.email;
            this.role = user.role;
        }
    }
});