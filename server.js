const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
require("dotenv").config();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Car = require("./models/car.js");

app.get("/cars", async (req, res) => {
  const cars = await Car.find({});
  res.render("carsIndex.ejs", { allCars: cars });
});

app.get("/cars/new", (req, res) => {
  res.render("carsNew.ejs");
});
//==========================================
// CREATE CARS
//==========================================

app.post("/cars", async (req, res) => {
  await Car.create(req.body);
  res.redirect("/cars");
});

//==========================================
// SHOW CARS
//==========================================

app.get("/cars/:id", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.render("carsShow.ejs", { car });
});

//==========================================
// EDIT CARS
//==========================================

app.get("/cars/:id/edit", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.render("carsEdit.ejs", { car });
});

//==========================================
// UPDATE CARS
//==========================================

app.put("/cars/:id", async (req, res) => {
  await Car.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/cars/${req.params.id}`);
});

//==========================================
// DELETE CARS
//==========================================

app.delete("/cars/:id", async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.redirect("/cars");
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
