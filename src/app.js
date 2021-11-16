const { NODE_ENV = "development" } = process.env;
const express = require("express");
const app = express();

// Middleware
const validateZip = require("./middleware/validateZip");
const getZoos = require("./utils/getZoos");

// Routes
app.get("/check/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip
   if (getZoos(zip)){
    res.send(`${zip} exists in our records.`)
  } else {
    res.send(`${zip} does not exist in our records.`)
  }
});
//admin route
const saySomething = (req, res) => {
  //http://localhost:5000/zoos/all?admin=true
  const admin = req.query.admin;
  if (admin === "true"){
  const zoos = getZoos();
  res.send(`All zoos: ${zoos.join("; ")}`);
} else {
  res.send("You do not have access to that route.")
}
};
//admin route called here with middleware function
app.get("/zoos/all", saySomething);
//zoos/zip route
app.get("/zoos/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip
  let zoos = getZoos(zip)
  let content = zoos.join("; ")
  if (zoos.length){
    res.send(`${zip} zoos: ${content}` )
  } else {
    res.send(`${zip} has no zoos.`)
  }
});
// Error Handling
app.use((req, res, next) => {
  next("That route could not be found!");
});
app.use((err, req, res, next) => {
  err = err || "Internal server error!";
  res.send(err);
});

module.exports = app;

