<template>

    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">
    <!-- <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"> -->

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous"/>

  <!-- <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet"> -->

    <Header></Header>
    <div class="update_home">
        <div class="left">
            <SideMenu></SideMenu>
        </div>
        <div class="update_right">
            
            <div class="content">
                <!-- <h1>Update component</h1> -->
                <!-- <i class="fa-caret-down" style="font-size:60px; margin-right: 10px;"></i>
                <i class="fa fa-caret-down" style="font-size:60px;"></i> -->
                <v-card>
                <v-card-title class="search_input">
                    <v-text-field
                    class="search_input"
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :items-per-page="itemsPerPage"
                    :headers="headers"
                    :items="storeComponents.components"
                    :search="search"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    >
                    <template class="action-items" v-slot:item.actions="{ item }">
                    
                    <v-icon class="icon_update" @click="editItem(item.value)">mdi-pencil</v-icon>
                    <v-icon class="icon_delete" @click="deleteItem(item.value)">mdi-delete</v-icon>

                    </template>
                </v-data-table>
                <template>
                    <!-- <v-pagination
                        v-model="page"
                        :length="pageCount"
                        next-icon='mdi-chevron-right'
                        prev-icon='fas fa-angle-left'
                    ></v-pagination> -->
                </template>

                    <template>
                        <v-dialog v-model="dialogDelete" max-width="560px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this component?</v-card-title>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Delete</v-btn>
                                <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>


                    <template>
                        <v-dialog
                        v-model="dialog"
                        max-width="500px"
                        >

            <v-card>
                <v-alert
                    color="warning"
                    title="Component name"
                    dismissible dark
                    v-model="alertName"
                    text="Please enter a valid name (at least 4 characters) or leave field empty to keep it unchanged."
                ></v-alert>
                <v-alert
                    color="warning"
                    title="Softeware info"
                    v-model="alertSoftware"
                    text="Please make sure the software info you entered is at least 4 characters or leave field empty to keep it unchanged."
                ></v-alert>

                <v-card-title>
                <span class="text-h5">Edit details</span>
                </v-card-title>

                <v-card-text>
                <v-container class="edit_container">
                    <v-row>
                
                        <v-text-field
                        v-model="editedItem.name"
                        label="Component name"
                        ></v-text-field>
                  
                    </v-row>
                    <v-row>
                        <v-select
                            class="parent_select"
                            v-model="editedItem.parent"
                            :items="parent_systems"
                            label="Parent system"
                        ></v-select>
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="editedItem.software"
                            label="Software info"
                        ></v-text-field>

                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="save"
                >
                    Save
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

                    </template>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Header from "../components/Home_Header.vue";
import SideMenu from "../components/SideMenu.vue";
import { VDataTable } from 'vuetify/labs/VDataTable'
import { pocketbase } from "../lib/pocketbase";
import { reactive } from "vue";

    export default {
        data() {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                dialog: false,
                dialogDelete: false,

                alertName: false,
                alertSoftware: false, 

                search: '',
                headers: [
                    {
                    align: 'start',
                    sortable: false,
                    },
                    { title: 'ID', key: 'id', align: 'start'},
                    { title: 'Component Name', key: 'name', sortable: true ,align: 'start' },
                    { title: 'Parent System', key: 'parent', align: 'start' },
                    { title: 'Software Version', key: 'software', align: 'start' },
                    { title: 'Actions', key: 'actions', sortable: false, align: 'start' },
                ],
                components: [
                    
                ],
                editedIndex: -1,
                parent_systems: [],
                editedItem: reactive({
                    id: '',
                    name: '',
                    parent : '',
                    software: '',
                }),
                defaultItem: {
                    name: '',
                    parent : 0,
                    software: 0,
                },
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Component' : 'Edit Item'
            },
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            dialogDelete (val) {
                val || this.closeDelete()
            },
        },
        methods: {
            editItem (id: string) {
                this.parent_systems = this.$pinia.state.value.sub_systems.systems.map((item: any) => item.name);
                this.editedItem.id = id;
                this.dialog = true
            },

            deleteItem (id: string) {
                this.dialogDelete = true
                this.editedItem.id = id;
            },

            async deleteItemConfirm () {
                const record = await pocketbase.collection('components').getOne(this.editedItem.id);

                // Delete dependencies
                const dependencies = await pocketbase.collection('dependencies').getFullList({filter:`target="${record.id}" || source="${record.id}"`});
                for (let i = 0; i < dependencies.length; i++) {
                    await pocketbase.collection('dependencies').delete(dependencies[i].id);
                }

                // Update parent system 
                const parent = await pocketbase.collection('sub_systems').getOne(record.parent_system);
                const parent_data = {
                    "name": parent.name,
                    "children": parent.children.filter((item: any) => item !== record.id),
                }
                await pocketbase.collection('sub_systems').update(parent.id, parent_data);

                // Delete component
                await pocketbase.collection('components').delete(this.editedItem.id);

                // Update store 
                this.$pinia.state.value.components.components = this.$pinia.state.value.components.components.filter((item: any) => item.id !== this.editedItem.id);

                this.$pinia.state.value.sub_systems.refresh = true;
                this.$pinia.state.value.components.refresh = true;
                this.$pinia.state.value.dependencies.refresh = true;

                this.closeDelete()
            },

            close () {
                this.dialog = false
                this.editedItem.id = "";
                this.editedItem.name = "";
                this.editedItem.parent = "";
                this.editedItem.software = "";
                this.alertName = false;
                this.alertSoftware = false;
                this.editedIndex = -1   
            },

            closeDelete () {
                this.dialogDelete = false
                this.editedIndex = -1
            },

            async save () {

                const record = await pocketbase.collection('components').getOne(this.editedItem.id);   

                const parent_original = await pocketbase.collection('sub_systems').getOne(record.parent_system);

                let name = this.editedItem.name.trim();
                let software = this.editedItem.software.trim();
                let parent = this.editedItem.parent;

                if (name.length > 0 && name.length <= 3) {
                    this.alertName = true;
                    return;
                } else 
                    this.alertName = false;

                if (software.trim().length > 0 && software.trim().length <= 3) {
                    this.alertSoftware = true;
                    return;
                } else 
                    this.alertSoftware = false;

                if (name.length == 0) {
                    name = record.component_name
                }
                if (software.length == 0) {
                    software = record.software_version
                }
                let parent_system_id ="";
                if (parent == "") {
                    parent_system_id = record.parent_system
                } else {
                    // Remove from current system 
                    const parent_data = {
                        "name": parent_original.name,
                        "children": parent_original.children.filter((item: any) => item !== record.id),
                    }
                    await pocketbase.collection('sub_systems').update(parent_original.id, parent_data);

                    // Add to new system
                    const new_parent_system = (await pocketbase.collection('sub_systems').getFirstListItem(`name="${this.editedItem.parent}"`));
                    parent_system_id = new_parent_system.id;
                    const new_children = new_parent_system.children.concat(record.id);

                    const new_parent_data = {
                        "name": new_parent_system.name,
                        "children":new_children,
                    }
                    await pocketbase.collection('sub_systems').update(new_parent_system.id, new_parent_data);

                }

                // Data to update component database record
                const data = {
                    "component_name": name,
                    "parent_system": parent_system_id,
                    "software_version": software
                };

                // request to update database record
                const updated_record = await pocketbase.collection('components').update(record.id, data);
                this.$pinia.state.value.components.refresh = true;
                
                // Update Pinia store
                const parent_db = await pocketbase.collection('sub_systems').getOne(parent_system_id);
                for (let i = 0; i < this.$pinia.state.value.components.components.length; i++) {
                    if (this.$pinia.state.value.components.components[i].id == this.editedItem.id) {
                        this.$pinia.state.value.components.components[i].name = name;
                        this.$pinia.state.value.components.components[i].parent = parent_db.name;
                        this.$pinia.state.value.components.components[i].software = software;
                    }
                }
                this.$pinia.state.value.sub_systems.refresh = true;

                // Update parent system
                const parent_data = 
                this.close()
            },
        },
        components: {
            Header,
            SideMenu,
            VDataTable
        },
        defaults: {
            VDataTable: {
                fixedHeader: true,
                noDataText: 'Results not found',
            }
        }
    }
</script>


<script setup lang="ts">
import { useComponentStore } from "../stores/components";
import { useSubSystemsStore } from "../stores/subSystems.js";
import { useSystemsStore } from "../stores/systems";

const storeComponents = useComponentStore();
const storeSubSystems = useSubSystemsStore();
const storeSystems = useSystemsStore();

if (storeSystems.refresh && storeSystems.lock == false) {
    storeSystems.loadSystems();
}
if (storeComponents.refresh) {
    storeComponents.loadComponents();
}

if (storeSubSystems.refresh) {
    storeSubSystems.loadSystems();
}

</script>
<style>

.update_home {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 95vh;
    width: 100vw;
}

.action-icons {
    display: flex;
    align-items: center;
    flex-direction: row;
    min-width: 80px;
    width: 100%;
}

.update_right {
    background-color: #F9F9F9;
    width: 100%;
    border-left: 1px solid;
    min-height: 95vh;
    height: 100%;
    padding-bottom: 40px;
}

.parent_select {
    height: 90px;
}

.search_input {
    margin-left: -8px;
    margin-top: -4px;
    width: 110%;
    background-color: white;
}

.icon_update {
    width: 20px;
    height: 20px;
    /* margin-left: 10px; */
    margin-right: 5px;
    cursor: pointer;
}
.icon_delete {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.v-data-table-footer {
    margin-top: 10px;
    padding-top: 10px;
    border-top: solid 1px grey;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.v-data-table-footer span {
    width: 100%;
    ;
}

</style>