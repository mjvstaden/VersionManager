import { defineStore, PiniaCustomStateProperties } from 'pinia';
import { Edges } from 'v-network-graph';
import { reactive } from 'vue';
import DependencyService from '../services/DependencyService';
// import { pocketbase } from '../lib/pocketbase';

export const useDependencyStore = defineStore({
  id: 'dependencies',
  state: () => ({
    dependencies: [] as any[],
    edges: reactive({}) as Edges,
    nr_issues: 0 as number,
    refresh: true as boolean,
    lock: false as boolean,
  }),
  getters: {

  },
  actions: {
    async loadDependencies() {
        console.log('loadDependencies');
        this.lock = true;

        this.dependencies = [];

        const records = (await DependencyService.index('')).data;
        console.log("Records: ", records);

        for (let i = 0; i < records.length; i++) {   
            this.addDependency({id: records[i].id, target: records[i].target, source:  records[i].source, faulty: records[i].faulty});
        }    

        this.populateEdges();
        this.refresh = false;
        this.lock = false;
    },
    addDependency(dependency: {id: string, target: string, source: string, faulty: boolean }) {
      this.dependencies.push(dependency);
    }, 
    remove(id: string) {
      this.dependencies = this.dependencies.filter(dependency => dependency.id !== id);
    },
    populateEdges() {
      const edges: Edges = reactive({});
       
        for (let i = 0; i < this.dependencies.length; i++) {
          if (this.dependencies[i].faulty) {
            edges[i] = {id: this.dependencies[i].id, source: this.dependencies[i].source, target: this.dependencies[i].target, color: 'red', type: "arrow", width: 2};
          } else {
            edges[i] = {id: this.dependencies[i].id, source: this.dependencies[i].source, target: this.dependencies[i].target, color: 'green', type: "arrow", width: 2};
        }
      }
      this.edges = edges;
    },
  }
}); 