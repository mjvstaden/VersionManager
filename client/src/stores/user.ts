import { defineStore } from "pinia";


export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        valid: false,
        id: '',
        name: '',
        email: '',
        role: '',
    }),
});