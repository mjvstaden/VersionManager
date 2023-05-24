<template>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">

    <Header></Header>
    <div class="history_home">
        <div class="left">
            <SideMenu></SideMenu>
        </div>
        <div class="history-right">
            <div class="content">
               <div class="toolbar">
                <v-btn
                    class="white--text"
                    @click="datesDialog = true"
                    >Select Dates</v-btn>
                    <v-btn
                    class="white--text"
                    @click="categoryDialog = true"
                    >Select category</v-btn>
                   
               </div>
               
                <template>
                    <v-dialog v-model="datesDialog" max-width="500px">
                        <v-card>
                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >Select dates 
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="datesDialog = false"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>
                            <Datepicker v-model="date" />
                        </v-card>
                    </v-dialog>
                </template>

                <template>
                    <v-dialog v-model="categoryDialog" max-width="500px">
                        <v-card>
                            <v-card-title style="display: flex; justify-content: space-between; align-items: center;">
                            <span 
                                style="float: left;"
                                class="text-h5"
                                >Select Category 
                            </span>
                            <v-btn
                                icon="mdi-close"
                                style="margin-left: 10px; float: right;"
                                color="blue darken"
                                variant="text"
                                @click="datesDialog = false"
                            >
                            <v-tooltip
                                open-delay="100"
                                activator="parent"
                                location="top"
                            >Close</v-tooltip>
                            <v-icon style="size: 40px;">mdi-close</v-icon>
                            </v-btn>
                            </v-card-title>
                            <Datepicker v-model="date" />
                        </v-card>
                    </v-dialog>
                </template>
 
 
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
                    :items="storeHistory.components"
                    :search="search"
                    hide-default-footer
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    >

                </v-data-table>
               
                </v-card>

                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Header from "../components/Home_Header.vue";
import SideMenu from "../components/SideMenu.vue";
import { VDataTable } from 'vuetify/labs/VDataTable';
import { pocketbase } from "../lib/pocketbase";
import { reactive, ref } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

    export default {
        name: "History",
        data() {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 100,
                search: '',
                headers: [
                    {
                    align: 'start',
                    sortable: false,
                    },
                    { title: 'ID', key: 'id', align: 'start'},
                    { title: 'Component Name', key: 'name', sortable: true ,align: 'start' },
                    { title: 'Parent System', key: 'parent_system', align: 'start' },
                    { title: 'Software Version', key: 'software_version', align: 'start' },
                    { title: 'Last Updated', key: 'updated', align: 'start'},
                    { title: 'Updated By', key: 'updated_by', align: 'start'},
                    { title: 'Actions', key: 'action', align: 'start' },
                ],
                components: [
                    
                ],
            };
        },
        components: {
            Header,
            SideMenu,
            VDataTable,
            VueDatePicker 
        }
    }
</script>

<script setup lang="ts">
import { useUserStore } from "../stores/user.js";
import { useComponentStore } from "../stores/components";
import { useHistoryStore } from "../stores/history";
import router from "../router";

if (pocketbase.authStore.model?.role !== "Developer" && pocketbase.authStore.model?.role !== "Support") {
   router.push("/dashboard");
}

let dates = reactive([]);
let datesDialog = ref(false);
let categoryDialog = ref(false);
const date = ref();

const storeComponents = useComponentStore();
const storeUser = useUserStore();
const storeHistory = useHistoryStore();

storeHistory.loadComponentHistory();

</script>

<style>
.history_home{
    display: flex;
    flex-direction: row;
    min-height: 93vh;
    height: 100%;
}

.history-right{
    background-color: #F9F9F9;
    width: 100%;
    border-left: 1px solid;
    min-height: 100%;
    height: 100%;
    padding-bottom: 40px;
    padding-top: 40px;
    padding-right: 10px;
}



</style>