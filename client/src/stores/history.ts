import { defineStore } from "pinia";
import { pocketbase } from "../lib/pocketbase";
import { useComponentStore } from "../stores/components";

export const useHistoryStore = defineStore({
    id: 'history',
    state: () => ({
        components: [] as {id: string, name: string, parent_system: string, software_version: string, updated: string, updated_by: string}[],
    }),
    // getters: {
    //   doubleCount: (state) => state.count * 2
    // },
    actions: {
        async loadComponentHistory() {
            
           
            this.components.length = 0;
            pocketbase.autoCancellation(false)
            const componentsFromDB = await pocketbase.collection('components').getFullList({sort: '-updated'});
            const systemNames = await pocketbase.collection('sub_systems').getFullList({fields: 'id, name'});
            const usernames = await pocketbase.collection('users').getFullList({fields: 'id, username'});

            componentsFromDB.forEach(async(component) => {
                let parent_name = systemNames.find((system) => system.id === component.parent_system)?.name || 'Unknown';
                let username = usernames.find((user) => user.id === component.user)?.username || 'Unknown';
                let date = component.updated.substring(0, 16);
                this.addComponent({id: component.id, name: component.component_name, parent_system: parent_name, software_version: component.software_version, updated: date, updated_by: username, action: component.action});
            });
        },
        addComponent(component: {id: string, name: string, parent_system: string, software_version: string, updated: string, updated_by: string, action: string}) {
            this.components.push(component);
        },
    },
});

