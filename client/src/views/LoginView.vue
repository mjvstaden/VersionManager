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
                <button class="login-button" @click="authUser()">Login</button>
            </div>
            <a @click="moveToRegister()">Need an account?</a>
        </div>
    </body>
</div>
  </template>

<script lang="ts">
import Header from "../components/Login_Header.vue";
import { pocketbase } from "../lib/pocketbase";
import { ClientResponseError } from "pocketbase";
import router from "../router";

var componentCount = 0;
var systemCount = 0;
let id: string = "";
let username: string = "";
let email: string = "";
let role: string = "";

    export default {
        name: "Login",
        data() {
            return {
                alert_incorrect: false,
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
            authUser() {
                if (this.input.email.trim() == "" || this.input.password.trim() == "") {
                    this.alert_incorrect = true;
                    return 
                }
                const path = 'http://127.0.0.1:5000/login'

                axios.post(path, {
                    email: this.input.email,
                    password: this.input.password
                }).then((response) => {
                    if (response.data == "success") {
                        alert("Login Successful");
                        router.push('/dashboard');
                        this.$router.push('/dashboard');
                        return 
                    } else 
                        this.alert_incorrect = true;
                }).catch((error) => {
                    console.log(error)
                })
            },
            // async authUser () {

            //     console.log(await pocketbase.collection('users').getFullList());
            
            //     try {
            //         const user_login = await pocketbase.collection('users').authWithPassword(this.input.email, this.input.password);  
            //         id = user_login.record.id;
            //         username = user_login.record.username;
            //         email = user_login.record.email;
            //         role = user_login.record.role;
            //     } catch (err) {
                    
            //     }
            //     if (pocketbase.authStore.isValid) {
            //             this.alert_incorrect = false;
            //             this.$pinia.state.value.user.id  = id;
            //             this.$pinia.state.value.user.name  = username;
            //             this.$pinia.state.value.user.email  = email;
            //             this.$pinia.state.value.user.role  = role;
            //             this.$pinia.state.value.user.valid  = true;
            //             router.push('/dashboard');
            //         } else {
            //             this.alert_incorrect = true;
            //         }
            // },
            isRememberMe() {
                this.input.rememberMe === true;
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
import { useDependencyStore } from "../stores/dependencies.js";
import { useUserStore } from "../stores/user.js";
import axios from "axios";

const storeDependencies = useDependencyStore();
const storeUser = useUserStore();
storeDependencies.loadDependencies();

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