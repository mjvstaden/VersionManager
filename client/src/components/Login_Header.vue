<template> 
   <div class="header">
    <div class="header-left">
        <img src="../../VT.gif" width="" height="30">
        <p>Version Manager</p>
    </div>
    <div class="header-right">
      <div class="login_header_right_option"> 
        <router-link to="/login">Login</router-link>
      </div>
      <div class="login_header_right_option"> 
      <router-link to="/register">Register</router-link>
      </div>
    </div>
</div> 
</template>

<script>
    export default {};
</script>
<style>
.header {
  overflow: hidden;
  background-color: #6c6e27;
  text-align: center;
}

/* Style the header links */
.header a {
  float: left;
  color: white;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 14px;
  line-height: 25px;
  border-radius: 4px;
}

/* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
.header a.logo {
  font-size: 20px;
  font-weight: bold;
}

/* Change the background color on mouse-over */
.header a:hover {
  border-radius: 10px;
}
.login_header_right_option:hover {
  border-radius: 20px;
  background-color: #dddddd6a;
  color: black;
}
.login_header_right_option {
 margin-top: 4px;
}

/* Style the active/current link*/
.header a.active {
  background-color: dodgerblue;
  color: white;
}

/* Float the link section to the right */
.header-right {
  float: right;
  display: flex;
  align-items: center;
  color: white;

}
.header-left {
    float: left;
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

.header-left p {
    margin-bottom: -2px;
    padding-left: 10px;
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