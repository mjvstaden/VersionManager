import { defineStore } from 'pinia';
import { Layouts } from 'v-network-graph';
import { reactive } from 'vue';
import { pocketbase } from '../lib/pocketbase';

export const useSubSystemsStore = defineStore({
  id: 'sub_systems',
  state: () => ({
    systems: [] as {id: string, name: string, children: {id: string, name: string}[], color: string }[],
    // layouts: reactive({}) as Layouts,
    names: reactive([]) as string[],
    ids: reactive([]) as string[],
    refresh: true as boolean,
    lock: false as boolean,
  }),
  actions: {
    async loadSystems() {
      // this.lock = true;
      // pocketbase.autoCancellation(false)
      // const elementsFromDB = await pocketbase.collection('sub_systems').getFullList();

      // this.systems.length = 0;
      // this.systems = [];
      // this.names.length = 0;
      // this.ids.length = 0;

      // // Get names of all the children of the systems so that we can display them in the UI
      // for (let i = 0; i < elementsFromDB.length; i++) {
      //   let childrenArr: {id: string, name: string}[] = [];
      //   let arrIndex = 0;
      //   for (let j = 0; j < elementsFromDB[i].children.length; j++) {
      //     try {
      //       const record = await pocketbase.collection('components').getOne(elementsFromDB[i].children[j]);
      //       if (record.history === false) {
      //         childrenArr[arrIndex] = {id: String(elementsFromDB[i].children[j]), name: String((await pocketbase.collection('components').getOne(elementsFromDB[i].children[j])).component_name)}
      //         arrIndex++;
      //       }
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }  
      //   this.addComponent({id: elementsFromDB[i].id, name: elementsFromDB[i].name, children: childrenArr, color: elementsFromDB[i].color});
      //   this.addSystem(elementsFromDB[i].name, elementsFromDB[i].id);
      // }
      // // this.getLayouts();
      // this.refresh = false;
      // this.lock = false;
    },

    addComponent(component: {id: string, name: string, children: {id: string, name: string}[], color: string}) {
      this.systems.push(component);
      
    },
    addSystem(name: string, id: string) {
      this.names.push(name);
      this.ids.push(id);
    },
  }
}); 