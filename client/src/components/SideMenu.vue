<!-- <template>
    <div class="menu">
        <div class="menu-options">
            <ul class="menu-items" >
                <li class="menu-item" v-for="option in menuOptions" :key="option.name"
                  v-on:mouseenter="option.showSubItems=true" v-on:mouseleave="option.showSubItems=false">
                    <router-link class="link" :to="option.link">
                        
                        <span>
                            <div>
                                <v-icon class="menu-icon" :icon="'mdi:mdi-' + option.icon" />
                                {{ option.name }}
                            </div>
                            
                            <ul class="sub-menu-items" v-if="option.showSubItems && option.subOptions[0].name != '' ">
                                <li class="menu-item" v-for="sub in option.subOptions" :key="sub.name" 
                                    v-on:mouseenter="sub.showSubItems=true" v-on:mouseleave="sub.showSubItems=false">
                                    <router-link class="link" :to="sub.link">
                                       
                                        <span>
                                            <div >
                                                <v-icon class="menu-icon"  :icon="'mdi:mdi-' + sub.icon" />
                                                {{ sub.name }}
                                            </div>
                                            <ul class="sub-sub-menu-items"  v-if="sub.showSubItems && sub.subOptions[0].name != '' ">
                                                <li class="menu-item" v-for="subsub in sub.subOptions" :key="subsub.name">
                                                    <router-link class="link" :to="subsub.link">
                                                        
                                                        <span>
                                                            <div>
                                                                <v-icon class="menu-icon"  :icon="'mdi:mdi-' + subsub.icon" />
                                                                {{ subsub.name }}
                                                            </div>
                                                        </span>
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </span>
                                    </router-link>
                                </li>
                            </ul>
                        </span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template> -->

<template >
    <v-card>
      <v-layout>
        <v-navigation-drawer
          style="height: 100%;
                border: 1px solid #fff;"
          v-model="drawer"
          :rail="rail"
          permanent
          @click="rail = false"
        >
          <v-list-item
            prepend-avatar="../../avatar.png"
            style="height: 16px;"
            nav
          >
             <div class="user_info" style="display: flex; flex-direction: column;">
                <v-label style="margin-top: 5px; margin-bottom: 0px;">{{userStore.name}}</v-label>
                <v-label style="font-size: 12px;"> {{userStore.role}}</v-label>
            </div>
            <template v-slot:append>
              <v-btn
                variant="text"
                icon="mdi-chevron-left"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home-city" title="Dashboard" value="home" @click="$router.push('/dashboard')"></v-list-item>
            <v-list-item prepend-icon="mdi-graph" title="View" value="view" @click="$router.push('/view')"></v-list-item>
            <!-- <v-list-item prepend-icon="mdi-plus" title="Create" value="create" @click="$router.push('/create')"></v-list-item> -->
            <v-list-item prepend-icon="mdi-history" title="History" value="history" @click="$router.push('/history')" v-if="userStore.role !== 'SIT'"></v-list-item>
          </v-list>

          <v-list density="compact" style="position: absolute; bottom: 0px; width: 100%;" nav >
            <v-list-item prepend-icon="mdi-logout" title="Log out" value="logout" @click="logout"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
  </template>

<script lang="ts"> 

    export default {
        name: "SideMenu",
        data() {
            return {
               rail: true,
               drawer: true,
                menuOptions: [
                    {
                        name: "Dashboard",
                        link: "/dashboard",
                        icon: "view-dashboard",
                        showSubItems: false,
                        subOptions: [{
                            name: "",
                            link: "",
                            icon: "",
                            showSubItems: false,
                            subOptions: [{
                                name: "",
                                link: "",
                                icon: "",
                            }],
                        }],
                    },
                    {
                        name: "System Management",
                        link: "",
                        icon: "clipboard-file-outline",
                        showSubItems: false,
                        subOptions: [
                            {
                                name: "View",
                                link: "/dependency-management/view",
                                icon: "graph",
                                showSubItems: false,
                                subOptions: [{
                                    name: "",
                                    link: "",
                                    icon: "",
                                }],
                            },
                            {
                            name: "Create", 
                            link: "/dependency-management/create",
                            icon: "plus-thick",
                            showSubItems: false,
                            subOptions: [
                                {
                                name: "", 
                                link: "",
                                icon: "",
                                showSubItems: false,
                                subOptions: [{
                                    name: "",
                                    link: "",
                                    icon: "",
                                }],
                                },
                                {
                                name: "",
                                link: "",
                                icon: "",
                                showSubItems: false,
                                subOptions: [{
                                    name: "",
                                    link: "",
                                    icon: "",
                                }],
                                },
                            ],            
                            },
                            {
                                name: "Update component", 
                                link: "/dependency-management/update-component",
                                icon: "pencil",
                                showSubItems: false,
                                subOptions: [{
                                    name: "",
                                    link: "",
                                    icon: "",
                                }], 
                            },
                            {
                                name: "History", 
                                link: "/dependency-management/history",
                                icon: "history",
                                showSubItems: false,
                                subOptions: [{
                                    name: "",
                                    link: "",
                                    icon: "",
                                }], 
                            },
                        ],
                    },
                ]
            }
        },
        methods: {
            ...mapActions(useUserStore, ['logout'])
        }
    }
</script>

<script setup lang="ts">

import { mapActions } from 'pinia';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();


</script>
  
<style>

.menu {
    width: 282px;
    background-color: white;
}

.menu-icon {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    margin-bottom: 5px;
}

.menu-options {
    margin-left: -10px;
    margin-top: 30px;
    font-size: 98%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sub-menu-items {
    font-weight: 200;
    height: 400px;
}
.menu-item {
    align-items: center;
}

ul {
    list-style-type: none;
    margin: 0;
    width: 100%;
    text-align: left;
    font-size: 100%;
    font-weight: bold;
    padding-left: 1em;
    padding-bottom: 20px;
}

.menu-options li {
    align-items: center;
    list-style-type: none;
    margin: 0;
    width: 100%;
    text-align: left;
    font-weight: bold;
    padding: 1em;
 }



.link {
    text-decoration: none;
    color: black;
}


</style>
