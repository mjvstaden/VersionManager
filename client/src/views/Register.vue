<template id="login-form">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.X/css/materialdesignicons.min.css" rel="stylesheet">

<div class="body">
  <Header></Header>
    <body>
        <h1 class="signUp_heading">Create an account</h1>
        <div class="login-container"> 
            <div class="form">
                <div class="alerts">
                    <v-alert
                        icon="mdi-alert-circle"
                        type="warning"
                        v-model="alert_error"
                        title="Error"
                        :text="error_msg"
                        dismissible
                ></v-alert>
                <v-alert
                        icon="mdi-alert-circle"
                        type="warning"
                        v-model="alert_password_match"
                        title="Password"
                        text="Passwords do not match"
                        dismissible
                ></v-alert>

                <v-alert
                        icon="mdi-success-circle"
                        type="success"
                        v-model="alert_success"
                        title="Account created"
                        text="You are now being logged in with your new account."
                        dismissible
                ></v-alert>
                </div>
                <label for="name">Username (unique):</label>
                <input class="input" placeholder="Your name" id="name" name="name" v-model="username" required>
                <label for="email">Email:</label>
                <input class="input" type="email" placeholder="Your email" id="email" name="email" v-model="email" required>
                <div class="v-select">
                <label for="role">Role:</label>
                <v-select
                    v-model="role"
                    :items="['Developer', 'SIT', 'Support']"
                    label=""
                    required
                ></v-select>
                </div>
                <label for="password">Password:</label>
                <input  class="input" type="password" id="password" name="password"  v-model="password" required>
                <label for="confirm-password">Confirm Password:</label>
                <input  class="input" type="password" id="confirm-password" v-model="confirmPassword" name="confirm-password" required>
                <button
                class="register-button"
                @click="validateInput()">
                    Sign Up    
                </button>
            </div>
            <a @click="goToLogin()">Already have an account?</a>
        </div>
    </body>
</div>
</template>

<script lang="ts">
import Header from "../components/Login_Header.vue";
import AuthenticationService from "../services/AuthenticationService";


const username: string = "";
    export default {
        name: "Register",
        data() {
            return {
                //Alerts
                alert_password_match: false,
                alert_success: false,
                alert_email_exists: false,
                alert_username_exists: false,
                alert_error: false,

                //Error
                error_msg: "",

                // User data 
                username: "",
                email: "",
                role: "",
                password: "",
                confirmPassword: "",
            };
        },
        methods: {
            validateInput() {

                if (this.password !== this.confirmPassword) {
                    this.alert_password_match = true;
                    return;
                } else 
                    this.alert_password_match = false;

                this.createUser();
            },

            async createUser() {
                console.log("Creating user")
                const data = {
                    "username": this.username,
                    "email": this.email,
                    "password": this.password,
                    "role": this.role
                };

                try {
                   await AuthenticationService.register(data);
                   this.alert_error = false;
                   this.alert_success = true;
                   this.$router.push({ path: "/dashboard"});
                }
                catch (error: any) {
                    this.error_msg = error.response.data.error;
                    this.alert_error = true;
                }
               
                this.alert_email_exists = false;
                this.alert_username_exists = false;
                this.alert_password_match = false;

                // this.login();
           
            },
            goToLogin() {
                this.$router.push({ path: "/login"});

                this.alert_success = false;
            }
        },
        components: {
            Header,
        }
    }

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p&display=swap');
   * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'M PLUS 1p', sans-serif;
    }
    .signUp_heading {
        font-size: 400%;
        margin: 5vh 10vh;
    }
    
    .alerts {
        width: 100%;
        margin-bottom: 30px;
    }

    .v-select {
        width: 100%;
    }

    .input {
        background-color: #f1f1f1;
    }

    a {
        color: #5D2490;
        cursor: pointer;
        text-decoration: underline;
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

    .form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    label {
        font-size: 1rem;
        margin-bottom: 5px;
    }

    
    input{
        width: 100%;
        height: 45px;
        padding: 10px;
        font-size: 120%;
        margin-bottom: 20px;
        border-radius: 5px;
        border: none;
        background-color: #f1f1f1;
    }

    input[type="text"], input[type="password"], input[type="email"], select{
        width: 100%;
        height: 45px;
        padding: 10px;
        font-size: 120%;
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

    .register-button {
        margin-top: 10px;
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

    .register-button:hover {
        background-color: #717328c7;
    }

</style>