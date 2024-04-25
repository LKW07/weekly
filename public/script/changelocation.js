let canAccessHome = true;
let isLoggedIn;

function changeLocation(site) {
    if (site  == "home" && canAccessHome){
        window.location = "/home/home.html";
    }
}

export default changeLocation;