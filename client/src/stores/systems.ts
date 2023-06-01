import { defineStore } from 'pinia';
import { Layouts, Nodes } from 'v-network-graph';
import { reactive } from 'vue';
import axios from 'axios';
import AuthenticationService from '../services/AuthenticationService';
import SystemsService from '../services/SystemsService';
import SubSystemService from '../services/SubSystemService';
import ComponentService from '../services/ComponentService';

export const useSystemsStore = defineStore({
  id: 'systems',
  state: () => ({
    systems: [] as any[],
    subsystems: [] as string[],
    selectedId: "" as string,
    selectedName: "" as string,
    layouts: reactive({}) as Layouts,
    nodes: reactive({}) as Nodes,
    componentsFromDB: [] as any[],
    subSystemsFromDB: [] as any[],
    subSystemNames: [] as string[],
    systemNames: [] as string[],
    ids: reactive([]) as string[],
    refresh: true as boolean,
    lock: false as boolean,
  }),
  actions: {
    async loadSystems() {
      this.lock = true;

      this.systems.length = 0;
      this.systems = [];
      this.subsystems.length = 0;
      this.subSystemNames.length = 0;
      this.ids.length = 0;

      try {
        const res = await SystemsService.index("");
        this.systems = res.data;
        for (let i = 0; i < this.systems.length; i++) {
          this.systems[i].subsystems = (await SystemsService.getChildren(this.systems[i].id)).data;
          for (let j = 0; j < this.systems[i].subsystems.length; j++) {
            this.systems[i].subsystems[j].components = (await SubSystemService.getChildren(this.systems[i].subsystems[j].id)).data;
          }
        }
      } catch (error) {
        console.log(error);
      }
        
      this.subSystemsFromDB = (await SubSystemService.index("")).data;
      this.componentsFromDB = (await ComponentService.index("")).data;
      this.selectedId = this.systems[0].id;
      this.selectedName = this.systems[0].name;

      this.getLayouts(this.systems[0].id);

      this.getSubSystemNames(this.systems[0].id);
      this.getSystemNames();

      this.refresh = false;
      this.lock = false;
    },
    async refreshSubSystems() {
      this.subsystems.length = 0;
      this.subSystemNames.length = 0;

      for (let i = 0; i < this.systems.length; i++) {
        this.systems[i].subsystems = (await SystemsService.getChildren(this.systems[i].id)).data;
      }

      this.subSystemsFromDB = (await SubSystemService.index("")).data;
      this.getSubSystemNames(this.systems[0].id);
    },
    async getSubSystems(system_id: string) {
      this.subsystems.length = 0;
      this.subsystems = (await SystemsService.getChildren(system_id)).data;
    },
    async getSubSystemNames(system_id: string) {
      this.subSystemNames.length = 0;
      let children = (await SystemsService.getChildren(system_id)).data;
      this.subSystemNames = children.map((child: any) => child.name);
    },
    async getSystemNames() {
      this.systemNames.length = 0;
      this.systemNames = this.systems.map((system: any) => system.name);
    },
    async getLayouts(system_id: string) {
      const system_in_row = 7;
      let max_y = 0;
      let ssystem_row = 0;
      let ssystem_col = 0;
      let row_start = 0;

      const layouts: Layouts = {
        nodes: {},
      };
      layouts.nodes = {};
      const nodes: Nodes = {};

      this.getSubSystems(system_id);

      const subsystems = (await SystemsService.getChildren(system_id)).data;
     
      for (let i = 0; i < subsystems.length; i++) {
        
        if (ssystem_col == system_in_row) {
          ssystem_col = 0;
          ssystem_row++;
          row_start = max_y;
        }
  
        let nrow = 0;
        let ncol = 0;

        const components = (await SubSystemService.getChildren(subsystems[i].id)).data;
        for (let j = 0; j < components.length; j++) {
          if (ncol == 3) {
            ncol = 0; 
            nrow++
          }
          if (nrow*100 > max_y) {
            max_y = nrow*100;
          }
          
          components[j].name = this.makeMultiLine(components[j].name);
          layouts.nodes[components[j].id] = {x: 350*ssystem_col + 80*(ncol), y: 100*nrow + (row_start) + 300*ssystem_row}; 
          nodes[components[j].id] = {name: components[j].name, color: subsystems[i].color};
          ncol++;
        }
        ssystem_col++;
      }
      this.layouts = layouts;
      this.nodes = nodes;
    },
    makeMultiLine(label: string) {
      let lineLength = 12;
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