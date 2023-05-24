import { defineStore } from "pinia";


export const useGraphStore = defineStore({
    id: 'graph',
    state: () => ({
        showInfoDialog: false as boolean,
        showParentDialog: false as boolean,
        newParentDialog : false as boolean,
        subSystemHistoryDialog: false as boolean,
        showAddExistingSubSystemDialog: false as boolean,
    }),
});