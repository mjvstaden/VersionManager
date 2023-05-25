<template id="login-form">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">

    <div class="body">
    <Header></Header>
    <body class="body">
        <h1 class="login_header">Welcome Back!</h1>
        <div class="login-container">
            <v-alert
                    icon="mdi-alert-circle"
                    type="warning"
                    v-model="alert_incorrect"
                    title="Incorrect email or password"
                    text="The email or password you entered is incorrect. Please try again."
                    dismissible
                    style="margin-bottom: 30px;"
            ></v-alert>
            <div class="form">

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" v-model="input.email" placeholder="example@example.com">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" v-model="input.password" placeholder="Enter password">
                <!-- <div class="rememberMe">
                    <input type="checkbox" id="rememberMe" name="rememberMe" v-model="input.rememberMe">
                    <label for="rememberMe">Remember me</label> 
                </div> -->
                <button class="login-button" @click="login()">Login</button>
            </div>
            <a @click="moveToRegister()">Need an account?</a>
        </div>
    </body>
</div>
  </template>

<script lang="ts">
import Header from "../components/Login_Header.vue";
import router from "../router";
import AuthenticationService from "../services/AuthenticationService";

export default {
    name: "Login",
    data() {
        return {
            alert_incorrect: false,
            error_msg: "",
            input: {
                username: "",
                email: "",
                password: "",
                role: "",
                rememberMe: false,
            },
        }
    },
    methods: {
        async login() {
            try {
                await AuthenticationService.login({
                    email: this.input.email,
                    password: this.input.password,
                });
                this.alert_incorrect = false;
                router.push('/dashboard');

            } catch (error: any) {
                this.error_msg = error.response.data.error; 
                this.alert_incorrect = true;
            }
        },
        moveToRegister() {
            this.$router.push('/register');
        },
    },
    components: {
        Header,
    }
}
</script>

<script setup lang="ts">
// import { useDependencyStore } from "../stores/dependencies.js";
// import { useUserStore } from "../stores/user.js";
import axios from "axios";

// const storeDependencies = useDependencyStore();
// const storeUser = useUserStore();
// storeDependencies.loadDependencies();

</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p&display=swap');
   * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'M PLUS 1p', sans-serif;
    }

    .login_header {
        font-size: 400%;
        margin: 10vh 10vh;
    }
    a {
        color: #5D2490;
        cursor: pointer;
        text-decoration: underline;
    }

    .rememberMe {
        display: flex;
        flex-direction: row;
    }
    .rememberMe label{
        margin-left: 10px;
        padding-bottom: 15px;
    }

    .body {
        height: 89.5vh;
        font-family: Arial, sans-serif;
        background-color: white;
    }

    .login-container {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        margin: 50px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    label {
        font-size: 1.2rem;
        margin-bottom: 5px;
    }

    input[type="text"], input[type="password"] {
       width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: none;
        background-color: #f1f1f1;
    }

    input[type="checkbox"] {
    /* Double-sized Checkboxes */
        -ms-transform: scale(1.8); /* IE */
        -moz-transform: scale(1.8); /* FF */
        -webkit-transform: scale(1.8); /* Safari and Chrome */
        -o-transform: scale(1.8); /* Opera */
        transform: scale(1.8);
        padding: 10px;
        margin-left: 6px;
        margin-bottom: 20px;
    }

    .login-button {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #707328;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        border-radius: 5px;
        cursor: pointer;
        max-width: 500px;
        width: 100%;
    }

    .login-button:hover {
        background-color: #717328c7;
    }

</style>