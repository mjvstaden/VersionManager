import { defineStore, PiniaCustomStateProperties } from 'pinia';
import { Nodes } from 'v-network-graph';
import { reactive } from 'vue';
// import { pocketbase } from '../lib/pocketbase';

export const useComponentStore = defineStore({
  id: 'components',
  state: () => ({
    components: [] as {id: string, name: string, parent_name: string, parent_id: string, version: string, color: string}[],
    // nodes: reactive({}) as Nodes,
    nr_new: 0 as number,
    nr_edited : 0 as number,
    names: reactive([]) as string[],
    ids: reactive([]) as string[],
    refresh: true as boolean,
    lock: false as boolean,
    system_colors: [] as {id: string, color: string}[],
  }),
  getters: {

  },
  actions: {
    async loadComponents() {
      // this.lock = true;
      // pocketbase.autoCancellation(false)
      // const allComponents = await pocketbase.collection('components').getFullList().then();      

      // const parentsFromDB = await pocketbase.collection('sub_systems').getFullList();
      // const usersFromDB = await pocketbase.collection('users').getFullList();
      // this.components = [];
      // this.names.length = 0;
      // this.ids.length = 0;

      // const elementsFromDB = allComponents.filter((element) => element.history === false);

      // // Get the names of all the components that the current component is dependent on so that we can display them in the UI
      // for (let i = 0; i < elementsFromDB.length; i++) {
       
      //   const parent = parentsFromDB.find((element) => element.id === elementsFromDB[i].parent_system);
      //   this.addComponent({id: elementsFromDB[i].id, name: elementsFromDB[i].component_name, parent_name: parent?.name, parent_id: parent?.id || "", version: elementsFromDB[i]?.version, color: this.system_colors.find((element) => element.id === elementsFromDB[i].parent_system)?.color ?? 'black'});
      // }
      // const date = new Date();
      // date.setDate(date.getDate() - 7);
      // var date_str = "";
      // var month = String(date.getMonth() + 1);
      // var day = String(date.getDate());

      // if (month.length <= 1) {
      //   month = "0" + month;
      // }
      // if (day.length <= 1) {
      //   day = "0" + day
      // }
      
      // date_str = date.getFullYear() + "-" + month + "-" + day + " 00:00:00";

      // this.nr_new = allComponents.filter((element) => element.created >= date_str && element.action === "created").length;
      // this.nr_edited = allComponents.filter((element) => element.created >= date_str && element.action === "edited").length;
      // // this.populateNodes("default");
      // this.refresh = false;
      // this.lock = false;
    },
    addComponent(component: {id: string, name: string, parent_name: string, parent_id: string, version: string, color: string}) {
      this.components.push(component);
      this.names.push(component.name);
      this.ids.push(component.id);
    },
  }
}); 