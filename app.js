const express = require("express")
const path = require('path');
require("dotenv").config()

require("./db config/config").connectToDb()
const bodyParser = require("body-parser")
const todoRouter = require("./routes/todo")
const authRouter = require("./routes/user")
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }));  //used to parse URL encoded http req(bodies) like forms 

app.use(methodOverride('_method'));

app.use(cookieParser(process.env.JWT_SECRET));

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));


app.use("/todo", todoRouter)
app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.render("welcome")
})

app.get('/signup', (req, res) => {
    res.render("signup")
});

app.get("/login", (req, res) => {
    res.render("login")
});



app.use((err, req, res, next) => {
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Your token has expired. Please log in again.' });
      } else if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: err.message || 'Invalid token' });
      } else {
        console.log("error occured")
        res.status(500).json({ message : 'Server error'})
    }
  
    next()
})

app.listen(PORT, () => {
    console.log(`Server hosted at: http://localhost:${PORT}`)
})
