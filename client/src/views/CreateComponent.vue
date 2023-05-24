<template>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">

    <Header></Header>
    <div class="create-home">
        <div class="left">
            <SideMenu></SideMenu>
        </div>
        <div class="create-right">
            
            <div class="create-content">
               
                <div class="form-left">
                    <h1 style="font-size: 160%; margin-top: 10px;">Create Sub System</h1>
                    <v-alert
                        icon="mdi-alert-circle"
                        type="warning"
                        v-model="alert_subsystem_name"
                        title="Sub system name"
                        text="Please enter a valid sub system name (min. 2 characters)"
                    ></v-alert>

                    <v-alert
                        icon="mdi-alert-circle"
                        type="warning"
                        v-model="alert_parent_system"
                        title="Parent system"
                        text="Please select a parent system"
                    ></v-alert>
                    <v-alert
                        icon="mdi-alert-circle"
                        type="success"
                        v-model="alert_subsystem_success"
                        title="Sub system successfully created!"
                        text=""
                    ></v-alert>
                    <div class="input-fields">
                        <div class="input-element">
                            <label class="input-label" for="subsystem-name">Sub System name:</label>
                            <input  class="input-field" type="text" v-model="subsystem_name" id="subsystem-name" name="subsystem-name" minlength="4" placeholder="min 2 characters" required>
                        </div>

                        <div class="input-element" style="margin-bottom: 60px;">
                            <label  class="input-label" for="parent-system">Assign to:</label>
                            <v-select
                                v-model="selected_parent"
                                :items="storeSystems.names"
                                color="#555728"
                                hint=""
                            ></v-select>
                        </div>

                        <div class="d-flex justify-space-around" style="width: 100%;">
                        <v-color-picker
                        justify-content="space-around"
                        align-content="center"
                        width="100%"
                        v-model="color"
                        mode="hex"
                        show-swatches
                        ></v-color-picker>
                        </div>
                        <button @click="createSubSystem()" id="btn-create-subsystem">Create</button>
                    </div>
                </div>

                <div class="form-right">
                    <h1 style="font-size: 160%; margin-top: 10px;">Create system</h1>
                    <v-alert
                        icon="mdi-alert-circle"
                        type="success"
                        v-model="alert_system_success"
                        title="System successfully created!"
                        text=""
                    ></v-alert>
                    <v-alert
                        type="warning"
                        v-model="alert_system_name"
                        title="System name"
                        text="Please enter a valid system name (min. 4 characters)"
                        dismissible
                    ></v-alert>
                    <div class="input-fields">
                        <div class="input-element">
                            <label class="input-label" for="component-name">System name:</label>
                            <input  class="input-field" type="text" v-model="sys_name" id="system-name" name="component_name" minlength="4" placeholder="min 2 characters" required>
                        </div>

                        <div class="input-element" style="margin-bottom: 100px;">
                            <label class="input-label" for="component-name">Visible to:</label>
                            <div class="checkboxes">
                                <div class="checkbox">
                                    <input type="checkbox" class="role" name="developer" value="Developer" v-model="developer"> 
                                    <label for="developer">Developers</label>
                                </div>
                                <div class="checkbox">
                                    <input type="checkbox" class="role" name="support" value="Support" v-model="support">  
                                    <label for="support" >Support</label>
                                </div>
                                <div class="checkbox">
                                    <input type="checkbox" class="role" name="sit" value="SIT" v-model="sit">          
                                    <label for="sit">SIT</label>
                                </div>     
                            </div>                 
                        </div>
                        
                            <button @click="createSystem()" id="btn-create-system">Create</button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Header from "../components/Home_Header.vue";
import SideMenu from "../components/SideMenu.vue";
import { pocketbase } from "../lib/pocketbase";
import { reactive, ref } from "vue";

let parent_nodes: {id: string, name: string}[] = [];
let child_nodes:{id: string, name: string}[] = [];
let parent_comp_names: string[] = reactive([]);
let child_comp_names: string[] = reactive([]);
let parent_comp_ids: string[] = [];
let child_comp_ids: string[] = [];

    export default {
        name: "CreateComponent",
        data() {
            return {

                // New system data
                sys_name: "",
                developer: false,
                support: false,
                sit: false,
                roles: [],

                // New subsystem data
                subsystem_name: "",
                selected_parent: "",
                color: "",

                // Other data
             

                // Display data 
                parent_comp_names: parent_comp_names,
                child_comp_names: child_comp_names,

                // Alerts
                alert_subsystem_name: false,
                alert_parent_system: false,
                alert_system_name: false,
                alert_subsystem_success: false,
                alert_system_success: false,
                
            }
        },
       methods: {
            async createSubSystem() {
                if (this.subsystem_name.trim().length < 2) {
                    this.alert_subsystem_name = true;
                    return;
                } else 
                    this.alert_subsystem_name = false;

                let parent_id = this.$pinia.state.value.systems.systems.find((system: any) => system.name == this.selected_parent).id;
                let parent_name = this.$pinia.state.value.systems.systems.find((system: any) => system.name == this.selected_parent).name;

                    const data = {
                        "name": this.subsystem_name,
                        "children": [],
                        "color": this.color,
                        "parent": [parent_id],
                        "history": false
                    };

                const new_subSystem = await pocketbase.collection('sub_systems').create(data);

                // Update system children in pocketbase
                let children = this.$pinia.state.value.systems.systems.find((system: any) => system.name == this.selected_parent).children.map((child: any) => child.id);
                console.log(children);
                children.push(new_subSystem.id);
                console.log(children);

                const new_data = {
                    "name": parent_name,
                    "children": children
                }

                console.log(new_data)

                await pocketbase.collection('systems').update(parent_id, new_data);

                this.$pinia.state.value.systems.subSystemsFromDB.push(new_subSystem);
                this.$pinia.state.value.systems.systems.find((system: any) => system.name == this.selected_parent).children.push({name: new_subSystem.name, id: new_subSystem.id, color: new_subSystem.color, children: new_subSystem.children});
                this.$pinia.state.value.systems.subsystems.push(new_subSystem.name);
                
                this.alert_subsystem_success = true;
                var intervalId = setInterval(() => {
                    if (this.alert_subsystem_success == false) {
                        clearInterval(intervalId);
                    } else {
                        this.alert_subsystem_success = false;
                    }
                }, 2000)
            },

            // async createComponent() {

            //     parent_comp_ids.length = 0;
            //     child_comp_ids.length = 0;

            //     for (let i = 0; i < this.parent_node_list.length; i++) {
            //         const parent = await pocketbase.collection('components').getFirstListItem(`component_name = "${this.parent_node_list[i]}"`);
            //         parent_comp_ids.push(parent.id);
            //     }

            //     for (let i = 0; i < this.child_node_list.length; i++) {
            //         const child = await pocketbase.collection('components').getFirstListItem(`component_name = "${this.child_node_list[i]}"`);
            //         child_comp_ids.push(child.id);
            //     }
                
            //   },
            //   onSelectParent() {
            //     let found: boolean = false;
            //     if (parent_nodes.filter((node) => node.id === this.selected_parent_node.id).length > 0) {
            //         parent_nodes = parent_nodes.filter((node) => node.id !== this.selected_parent_node.id);
            //         found = true;
            //     }
            //     if (!found) {
            //         parent_nodes.push({id: this.selected_parent_node.id, name: this.selected_parent_node.name});
            //     }

            //     parent_comp_names.length = 0;
            //     parent_comp_ids.length = 0;
            //     parent_comp_ids = parent_nodes.map((node) => node.id);
            //     parent_comp_names = parent_nodes.map((node) => node.name);

            //   },
            //   onSelectChild() {
            //     let found: boolean = false;
            //     if (child_nodes.indexOf(this.selected_child_node) !== -1) {
            //         child_nodes.splice(child_nodes.indexOf(this.selected_child_node), 1);
            //         found = true;
            //     }
            //     if (!found) {
            //         child_nodes.push(this.selected_child_node);
            //     }
            //     child_comp_names.length = 0;
            //     child_comp_ids.length = 0;
            //     child_comp_ids = child_nodes.map((node) => node.id);
            //     child_comp_names = child_nodes.map((node) => node.name);
            //   },
              async createSystem() {

                if (this.sys_name.trim().length <= 3) {
                    this.alert_system_name = true;
                    return;
                } else 
                    this.alert_system_name = false;

                const data = {
                    "name": this.sys_name,
                    "children": [],
                };

                const new_system = await pocketbase.collection('systems').create(data);
                this.$pinia.state.value.sub_systems.refresh = true;

                this.alert_system_success = true;
                var intervalId = setInterval(() => {
                    if (this.alert_system_success == false) {
                        clearInterval(intervalId);
                    } else {
                        this.alert_system_success = false;
                    }
                }, 3000)

                if (this.developer) {
                    const users = await pocketbase.collection('users').getFullList({
                        filter: 'role = "Developer"'
                    });
                    users.forEach(element => {
                        element.assigned_systems.push(new_system.id);
                        pocketbase.collection('users').update(element.id, element);
                    });
                }

                if (this.support) {
                    const users = await pocketbase.collection('users').getFullList({
                        filter: `role = "Support"`,
                    });
                    users.forEach(element => {
                        element.assigned_systems.push(new_system.id);
                        pocketbase.collection('users').update(element.id, element);
                    });

                }

                if (this.sit) {
                    const users = await pocketbase.collection('users').getFullList({
                        filter: `role = "SIT"`
                    });
                    users.forEach(element => {
                        element.assigned_systems.push(new_system.id);
                        pocketbase.collection('users').update(element.id, element);
                    });
                }

                // Update the system list
                this.$pinia.state.value.systems.names.push(new_system.name);
              }
       },
        components: {
            Header,
            SideMenu,
        }
    }
</script>

<script setup lang="ts">
import { useComponentStore } from "../stores/components.js";
import { useSubSystemsStore } from "../stores/subSystems.js";
import { useSystemsStore } from "../stores/systems.js";

const storeComponents = useComponentStore();
const storeSubSystems = useSubSystemsStore();
const storeSystems = useSystemsStore();

if (storeSystems.refresh && storeSystems.lock == false) {
    storeSystems.loadSystems();
}
if (storeComponents.refresh && storeComponents.lock == false) {
    storeComponents.loadComponents();
}

if (storeSubSystems.refresh && storeSubSystems.lock == false) {
    storeSubSystems.loadSystems();
}


</script>

<style>

.checkboxes {
    display: flex;
    flex-direction: column;
    align-content: left;
    justify-content: left;
    left: 0;
    width: 100%;
    margin-top: 10px;
}

.checkbox {
    display: flex;
    flex-direction: row;
    align-items: baseline;
}

.checkbox label {
    margin-left: 10px;
    margin-top: 5px;
}

.create-content {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    height: 100%;
}
.role {
width: 20px;
}

.create-home {
    display: flex;
    flex-direction: row;
    height: 100%;
}

.create-right {
    display: flex;
    align-items: left;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #F9F9F9;
    width: 100%;
    border-left: 1px solid;
    height: 100%;
}

.form-right {
    width: 40%;
    height:100%;
    min-width: 360px;
    max-width: 900px;
    margin-top: 5vh;
    margin-left: 5vw;
    margin-right: 5vw;
    align-items: left;
    background-color: white;
    padding-top: 20px;
    padding-bottom: 30px;
}

.form-left {
    min-width: 360px;
    width: 40%;
    max-width: 520px;
    max-width: 900px;
    margin-top: 5vh;
    margin-left: 5vw;
    align-items: center;
    background-color: white;
    padding-top: 20px;
    padding-bottom: 30px;
    height: 100%;
}
.create-component-header {
    width: 100%;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 2rem;
}
.input-field {
    height: 48px;
    margin-bottom: 0px;
    background-color: #F1F1F1;
}

.input-element {
    height: 50px;
    font-size: 80%;
    margin-bottom: 40px;
    align-content: left;
    text-align: left;
}

.input-element input[type="checkbox"] {
    height: 10px;
    font-size: 80%;
    align-content: left;
    text-align: left;
    float: left;
    
}


.v-color-picker-edit__input {
    margin-right: -30px
}

.input-fields {
    margin-left: 5vw;
    margin-right: 5vw;
    margin-top: 20px;
}

.selected {
    margin-top: 0;
    margin-bottom: 0px;
}

v-color-picker {
    margin-top: 30px;
    margin-bottom: 0px;
}


#btn-create-subsystem {
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 7px 7px ;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    max-width: none;
    background-color: #707328;
    color: #fff;
    cursor: pointer;
    width: 100%;
}

#btn-create-component:hover {
    background-color: #717328c7;
}

#btn-create-system {
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 7px 7px ;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    max-width: none;
    background-color: #707328;
    color: #fff;
    cursor: pointer;
    width: 100%;
}

#btn-create-system:hover {
    background-color: #717328c7;
}


@media screen and (max-width: 1750px) and (min-width: 1200px) {
    /* h1 {
        font-size: 200%;
    } */
    .input-fields {
        margin-left: 4vw;
        margin-right:4vw;
    }  
}

@media screen and (max-width: 1200px) and (min-width: 800px) {
    /* h1 {
        font-size: 100%;
    } */
    .input-fields {
        margin-left: 4vw;
        margin-right:4vw;
    }  
}


</style>