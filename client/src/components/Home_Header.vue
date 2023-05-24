<template> 
 <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <div class="header">
     <div class="home-header-left">

         <img src="../../VT.gif" width="" height="30">
         <p>Version Manager</p>
     </div>

    

     <!-- <div class="header-right_option" @click="logout()">
      <v-icon class="mdi mdi-logout" color="white" size="24" style="padding-left: 10px;"></v-icon>
       <a id="logout">Log out</a>
     </div> -->

     <!-- <div class="user_details">
        <v-avatar
        v-if="pocketbase.authStore.model?.role === 'Developer'"
          image="../../avatar.png"
          rounded="0"
          size="40"
        ></v-avatar>
        <v-avatar
        v-if="pocketbase.authStore.model?.role === 'Support'"
          image="../../technical-support.png"
          rounded="0"
          size="40"
        ></v-avatar>
        <v-avatar
        v-if="pocketbase.authStore.model?.role === 'SIT'"
          image="../../quality-control.png"
          rounded="0"
          size="40"
        ></v-avatar>
        <div class="text-info"> 
         <p style="margin-left: 10px;"> <strong>{{ pocketbase.authStore.model?.username }}</strong></p>
          <p style="margin-left: 10px; font-size: 13px;">{{ pocketbase.authStore.model?.role }}</p>
        </div>
      </div> -->
 </div> 
 </template>
 
 <script lang="ts">

     export default {
        methods: {
            logout() {
                pocketbase.authStore.clear();
                this.$router.push('/login');
            }
        }
     };
 </script>

 <script setup lang="ts">
import { pocketbase } from '../lib/pocketbase';

</script>
 <style>
 .header {
   overflow: hidden;
   background-color: #6c6e27;
   height: 58px;
 }
 
 /* Style the header links */
 .header a {
   float: left;
   color: white;
   text-align: center;
   text-decoration: none;
   font-size: 18px;
   line-height: 20px;
   border-radius: 4px;
 }
 
 /* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
 .header a.logo {
   font-size: 20px;
   font-weight: bold;
 }
 
 /* Change the background color on mouse-over */
 .header a:hover {
   /* background-color: #dddddd6a; */
   /* color: black; */
 }

 #logout:hover {
    /* color: black; */
 }
 
 /* Style the active/current link*/
 .header a.active {
   background-color: dodgerblue;
   color: white;
 }

 .text-info p{
  color: white;
  margin-bottom: 0px;
 }

 
 /* Float the link section to the right */
 .header-right_option {
  display: flex;
  align-items: center;
  float: right;
  color: white;
  margin-top: 4px;
  margin-right: 10px;
  margin-left: 35px;
 }
 .header-right_option:hover {
  border-radius: 20px;
  background-color: #dddddd6a;
  cursor: pointer;
 }
 .user_details {
      display: flex;
      align-items: center;
      float: right;
      color: white;
      margin-top: 4px;
      margin-right: 10px;
  }
 .home-header-left p {
    margin-bottom: -2px;
    margin-left: 10px;
 }
 .home-header-left {
    float: right;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    text-decoration: none;
    font-size: 21px;
    line-height: 25px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    margin-left: 0px;
  }

 /* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */
 @media screen and (max-width: 500px) {
   .header a {
     float: none;
     display: block;
     text-align: left;
   }
   .header-right {
     float: none;
   }
 }
 </style>