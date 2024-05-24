const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
let db = new sqlite3.Database("./db/database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
    console.log("Connected to database!");
    }
});

let sql = "SELECT username, userID FROM Users";

db.all(sql, [] , (err, rows) => {
  if (err) {
      throw err;
  }
  rows.forEach((row) => {
    console.log(row.userID + " - " + row.username)
  });
});


app.set("view engine", "ejs");
app.use("/public", express.static('public'));
app.use(express.urlencoded());


// Variablen
let users = [{username: "lkw", password: "lkw", loggedInAsUser: "false"}];
let loggedInAsUser = false;
let loggedInUser;
let loggedInAsAdmin;

app.get("/", (req, res) => {
    if (loggedInAsUser) {
        res.render("home.ejs", {user: loggedInUser || "user"});
    }
    else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/home", (req, res) => {
    if (loggedInAsUser) {
        res.render("home.ejs", {user: loggedInUser || "user"});
    }
    else {
        //res.send("<h1>Du bist nicht angemeldet</h1><a href='/login'>Back to Login Page</a>");
        res.redirect("/login");
    }
});

app.get("/podcast", (req, res) => {
    if (loggedInAsUser) {
        res.render("podcast.ejs");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/podcast-dev", (req, res) => {
    if (loggedInAsUser) {
        res.render("podcast-dev.ejs");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/admin-panel", (req, res) => {
    if (loggedInAsAdmin) {
        res.render("Admin/admin-panel.ejs");
    }
    else {
        res.redirect("/home");
    }
});

app.get("*", (req, res) => {
    res.render("Error/404.ejs");
});

app.post("/login", (req, res) => {
    login_user(req, res);
});

app.post("/logout-user", (req, res) => {
    loggedInAsUser = false;
    res.redirect("/login");
});

app.post("/logout-admin", (req, res) => {
    loggedInAsAdmin = false;
    res.redirect("/login");
});

app.post("/podcast", (req, res) => {
    res.redirect("/podcast");
});

app.post("/podcastdev", (req, res) => {
    res.redirect("/podcast-dev");
});

app.listen(3000);




// FUNCTIONS

function login_user(req, res) {
    console.log(req.body.username);
    
    const btn = req.body.submit;
    const username = req.body.username;
    const password = req.body.password;

    sql = "SELECT username, password FROM Users WHERE (username = ?) AND (password = ?)";
    params = [username, password];

    db.all(sql, params, (Uerr, Urows) => {
        if (Uerr) {
            throw Uerr;
        }
        else {
            if (Urows.length > 0){
                loggedInUser = Urows[0].username;
                loggedInAsUser = true;
                res.redirect("/home");
            }
            else if (Urows.length == 0) {
                login_admin(req, res);
            }
        }
    });
}

function login_admin(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    sql = "SELECT username, password FROM Admins WHERE (username = ?) AND (password = ?)";
    params = [username, password];

    db.all(sql, params, (Aerr, Arows) => {
        if (Aerr) {
            throw Aerr;
        }
        else  if (Arows.length > 0) {
            loggedInAsAdmin = true;
            loggedInUser = Arows[0];
            res.redirect("/admin-panel");
        }
        else {
            console.log("passsword wrong");
            res.send("<h1>Wrong Username or Password!</h1><a href='/login'>Back to Login Page</a>");
        }
    });
}