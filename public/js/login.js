import changeLocation from "../script/changelocation.js";

const btn =  document.querySelector("#submit");
const username = document.querySelector("#username");
const password = document.querySelector("#password");


function check_pass() {
    if (username.value != "" && password.value != "") {
        changeLocation("home");
    }
    else {
        //alert("Falsche Anmeldedaten");
        document.getElementById("login_msg").style.visibility = "visible";
        btn.disabled = true;
        setTimeout(function() {
            document.getElementById("login_msg").style.visibility = "hidden";
            btn.disabled = false;
        }, 2000)
        console.log("Test");
    }

}


function main() {
    btn.addEventListener("click", check_pass);
}
main();