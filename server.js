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

let sql = "SELECT username FROM Users";

db.all(sql, [] , (err, rows) => {
  if (err) {
      throw err;
  }
  rows.forEach((row) => {
    console.log(row.username)
  });
});


app.set("view engine", "ejs");
app.use("/public", express.static('public'));
app.use(express.urlencoded());


// Variablen
let users = [{username: "lkw", password: "lkw", loggedIn: "false"}];
let loggedIn = false;
let loggedInUser;

app.get("/", (req, res) => {
    if (loggedIn) {
        res.render("home.ejs", {user: loggedInUser || "user"});
    }
    else {
        res.render("login.ejs");
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/home", (req, res) => {
    if (loggedIn) {
        res.render("home.ejs", {user: loggedInUser || "user"});
    }
    else {
        //res.send("<h1>Du bist nicht angemeldet</h1><a href='/login'>Back to Login Page</a>");
        res.redirect("/login");
    }
});

app.post("/login", (req, res) => {
    console.log(req.body.username);
    
    const btn = req.body.submit;
    const username = req.body.username;
    const password = req.body.password;

    sql = "SELECT username, password FROM Users WHERE (username = ?) AND (password = ?)";
    params = [username, password];

    db.all(sql, params, (err, rows) => {
        if (err) {
            throw err;
        }
        else {
            if (rows.length > 0){
                loggedInUser = rows[0].username;
                loggedIn = true;
                res.redirect("/home");
            }
            else {
                console.log("passsword wrong");
                res.send("<h1>Wrong Username or Password!</h1><a href='/login'>Back to Login Page</a>");
            }
        }
    });

    /*if (username == "lkw" && password == "lkw") {
        res.redirect("/home");
        loggedIn = true;
    }
    else {
        console.log("passsword wrong");
        res.send("<h1>Wrong Username or Password!</h1><a href='/login'>Back to Login Page</a>");
    }*/
});

app.post("/logout", (req, res) => {
    loggedIn = false;
    res.redirect("/login");
});

app.listen(3000);