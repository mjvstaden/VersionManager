<template>
    <Header></Header>
    <div class="dash_home">
        <div class="left">
            <SideMenu></SideMenu>
        </div>
        <div class="right">
            <div class="content">
                <h1 class="dashboard-heading">Dashboard</h1>
                <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">

                <div class="dashboard-container">
                    <!-- <DashboardCard icon="error" :number= storeDependencies.nr_issues  message="Known dependency issues" ></DashboardCard>
                    <DashboardCard icon="update" :number=storeComponents.nr_edited message="Components updated in the last 7 days"></DashboardCard>
                    <DashboardCard icon="added" :number=storeComponents.nr_new message="New components added in the last 7 days"></DashboardCard> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Header from "../components/Home_Header.vue";
import SideMenu from "../components/SideMenu.vue";
import DashboardCard from "../components/DashboardCard.vue";
import { mapActions } from 'pinia';
// import {useSystemsStore} from "../stores/systems";
import router from "../router";

    export default {
        name: "Home",
        data() {
            return {
                // validated: pocketbase.authStore.isValid, 
            }
        },   
        methods: {
        ...mapActions(useSystemsStore, ["loadSystems"]),
        },
        components: {
            Header,
            SideMenu,
            DashboardCard
        }
    }

</script>

<script setup lang="ts">
import { useSystemsStore } from "../stores/systems";
import { useUserStore } from "../stores/user";

const systemStore = useSystemsStore();
const userStore = useUserStore();

if (userStore.valid == false) {
    router.push("/login");
}

systemStore.loadSystems();

// const storeComponents = useComponentStore();
// const storeSubSystems = useSubSystemsStore();
// const storeDependencies = useDependencyStore();
// const storeSystems = useSystemsStore();
// const storeUser = useUserStore();

// if (storeComponents.refresh && storeComponents.lock == false) {
//     storeComponents.loadComponents();
// }
// if (storeSubSystems.refresh && storeSubSystems.lock == false) {
//     storeSubSystems.loadSystems();
// }
// if (storeSystems.refresh && storeSystems.lock == false) {
//     storeSystems.loadSystems();
// }
// if (storeDependencies.refresh && storeDependencies.lock == false) {
//     storeDependencies.loadDependencies();
// }

</script>


<style>

/* Style for all components in "views" folder.*/
        .dash_home {
            display: flex;
            flex-direction: row;
            height: 94vh;
            width: 100vw;
        }

        .right {
            background-color: #F9F9F9;
            width: 100%;
            border-left: 1px solid;
            bottom: 0px;

        }

        .dashboard-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 5vh;
            margin-left: 5vw;
            margin-right: 5vw;
        }
        .dashboard-heading {
            margin-top: 4vh;
        }
        .content {
            display: flex;
            flex-direction: column;
            height: 100%;
            margin-left: 5vw;
            margin-right: 5vw;
        }

        .content h1 {
            float: flex-start;
        }

        @media screen and (max-width: 939px) {
            .dash_home {
                height: 1369px;
            }

        }
        
            
        

</style>