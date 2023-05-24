<template>
    <div class="container">

        <img v-bind:src="'/' + icon + '.png'" alt="" class="logo">
        <h1 class="card_number"> {{ number }} </h1>
        <p class="message"> {{message}} </p>

    </div>
</template>

<script lang="ts">
    export default {
        name: "DashboardCard",
        props: {
            icon: {
                type: String,
                required: true
            },
            number: {
            
               
            },
            message: {
                type: String,
                required: true
            }
        }
    }

</script>

<script setup lang="ts">
import { useUserStore } from "../stores/user.js"; 

const storeUser = useUserStore();
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2.5px solid;
    padding: 40px 20px;
    width: 16vw;
    max-width: 500px;
    min-width: 200px;
    border-radius: 5px;
    margin-bottom: 30px;
}
.card_number {
    font-size: 300%;
    margin: 50px;
}

.logo {
    width: 100px;
    height: 100px;
    margin-bottom: -40px;
}

.message {
    font-size: 110%;
    text-align: center;
    margin-top: -30px;
}

</style>