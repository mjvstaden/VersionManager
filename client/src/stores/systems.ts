import { defineStore } from 'pinia';
import { Layouts, Nodes } from 'v-network-graph';
import { reactive } from 'vue';
import { pocketbase } from '../lib/pocketbase';
import axios from 'axios';

export const useSystemsStore = defineStore({
  id: 'systems',
  state: () => ({
    systems: [] as {id: string, name: string, children: {id: string, name: string, color: string, children: {id: string, name: string}[]}[]}[],
    subsystems: [] as string[],
    selected: "" as string,
    layouts: reactive({}) as Layouts,
    nodes: reactive({}) as Nodes,
    componentsFromDB: [] as any[],
    realTimeComponents: [] as any[],
    realTimeSubSystems: [] as any[],
    realTimeSystems: [] as any[],
    subSystemsFromDB: [] as any[],
    names: reactive([]) as string[],
    ids: reactive([]) as string[],
    refresh: true as boolean,
    lock: false as boolean,
  }),
  actions: {
    
    async realtime() {
      
      // pocketbase.collection('systems').subscribe('*',  (data: any) => {
      //   // console.log("Subscribe System Data", data);
      //   this.realTimeSystems.push(data);
      // });
      // pocketbase.collection('sub_systems').subscribe('*',  (data: any) => {
      //   // console.log("Subscribe Sub-System Data", data);
      //   this.realTimeSubSystems.push(data);
      // });
      // pocketbase.collection('components').subscribe('*',  (data: any) => {
      //   // console.log("Subscribe Component Data", data);
      //   this.realTimeComponents.push(data);
      // });
    },
    async loadUpdatestoSystem() {

    },
    async loadSystems() {
      this.lock = true;
      this.realtime();
      pocketbase.autoCancellation(false)

      const path = 'http://127.0.0.1:5000/all_data'

      // Get data from python server and store it in all_data
      const all_data = axios.get(path).then((respone) =>
      console.log(respone)
      );

      const systemsFromDB = await all_data

      // const systemsFromDB = await pocketbase.collection('systems').getFullList();
      // this.subSystemsFromDB = await pocketbase.collection('sub_systems').getFullList();
      // this.componentsFromDB = await pocketbase.collection('components').getFullList();

      this.systems.length = 0;
      this.systems = [];
      this.subsystems.length = 0;
      this.names.length = 0;
      this.ids.length = 0;

      // Get names of all the children of the systems so that we can display them in the UI
      for (let i = 0; i < systemsFromDB.length; i++) {
        let subsystems: {id: string, name: string, color: string, children: {id: string, name: string}[]}[] = [];
        let arrIndex = 0;
        for (let j = 0; j < systemsFromDB[i].children.length; j++) {
          try {
            // const record = await pocketbase.collection('sub_systems').getOne(systemsFromDB[i].children[j]);
            const sub_system = this.subSystemsFromDB.find((sub_system) => sub_system.id === systemsFromDB[i].children[j]);

            if (sub_system?.history === false) {
                let components: {id: string, name: string}[] = [];
                let index = 0;
                for (let k = 0; k < sub_system?.children.length; k++) {
                    try {
                        const component = this.componentsFromDB.find((component) => component.id === sub_system?.children[k]);
                        if (component?.history === false && component !== undefined) {
                            components[index] = {id: String(component.id), name: String(component.component_name)}
                            index++;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                subsystems[arrIndex] = {id: String(systemsFromDB[i].children[j]), name: sub_system.name, color: sub_system.color , children: components}
                arrIndex++;
            }
          } catch (error) {
            console.log(error);
          }
        } 

        this.addSubSystem({id: systemsFromDB[i].id, name: systemsFromDB[i].name, children: subsystems});
        this.addSystem(systemsFromDB[i].name, systemsFromDB[i].id);
      }
      this.getLayouts(this.systems[0].name);
      this.refresh = false;
      this.lock = false;
    },
    getSubSystems(system_name: string) {
      let index = this.systems.findIndex((element) => element.name === system_name);
      this.subsystems.length = 0;
      if (this.systems[index] !== undefined) {
        for (let i = 0; i < this.systems[index].children.length; i++) {
          this.subsystems.push(this.systems[index].children[i].name);
        }
      }
    },
    addSubSystem(system: {id: string, name: string, children: {id: string, name: string, color: string, children: {id: string, name: string}[]}[]}) {
      this.systems.push(system);
    },
    addSystem(name: string, id: string) {
      this.names.push(name);
      this.ids.push(id);
    },
    async getLayouts(name: string) {
      const system_in_row = 7;
      let max_y = 0;
      this.getSubSystems(name);
      const layouts: Layouts = {
        nodes: {},
      };
      layouts.nodes = {};
      const nodes: Nodes = {};

      let index = this.systems.findIndex((element) => element.name === name);
      let ssystem_row = 0;
      let ssystem_col = 0;
      let row_start = 0;
      
      for (let i = 0; i < this.systems[index].children.length; i++) {

        if (ssystem_col == system_in_row) {
          ssystem_col = 0;
          ssystem_row++;
          row_start = max_y;
        }
        
        const sub_system = this.subSystemsFromDB.find((sub_system) => sub_system.id === this.systems[index].children[i].id);

        let nrow = 0;
        let ncol = 0;

        for (let j = 0; j < sub_system.children.length; j++) {
          if (ncol == 3) {
            ncol = 0; 
            nrow++
          }
          if (nrow*100 > max_y) {
            max_y = nrow*100;
          }
          const component = this.componentsFromDB.find((component) => component.id === sub_system.children[j]);
          component.component_name = this.makeMultiLine(component.component_name);
          layouts.nodes[component.id] = {x: 350*ssystem_col + 80*(ncol), y: 100*nrow + (row_start) + 300*ssystem_row}; 
          nodes[component.id] = {name: component.component_name, color: sub_system.color};
          ncol++;
        }
        ssystem_col++;
      }
      this.layouts = layouts;
      this.nodes = nodes;
    },
    makeMultiLine(label: string) {
      let lineLength = 10;
      let lineChar = 0;
      for (let i = 0; i < label.length; i++) {
        lineChar++;
        if (lineChar >= lineLength) {
          if (label[i] === " " || label[i] == '-' || label[i] == '_' || label[i] == '.' || label[i] == ',') {
            label = [label.slice(0, i+1), '\n', label.slice(i+1)].join('');
            lineChar = 0;
          } 
        }
    }
    return label;
    },
  }
}); 