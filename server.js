const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Car = require("./models/car.js");

app.get("/", (req, res) => {
  res.render("carsHome.ejs");
});
app.get("/cars/create", (req, res) => {
  res.render("carsCreate.ejs");
});

app.post("/cars/create", async (req, res) => {
  const car = await Car.create(req.body);
  res.redirect("/cars/view");
});

app.get("/cars/view", async (req, res) => {
  const cars = await Car.find({});
  res.render("carsView.ejs", {
    allCars: cars,
  });
});

app.get("/cars/update", async (req, res) => {
  const cars = await Car.find({});
  res.render("carsUpdate.ejs", {
    title: "Update Car",
    allCars: cars,
  });
});

app.post("/cars/update", async (req, res) => {
  const { carId, make, model, year, mileage, color, price } = req.body;

  const updateData = {};

  if (make) updateData.make = make;
  if (model) updateData.model = model;
  if (year) updateData.year = year;
  if (mileage) updateData.mileage = mileage;
  if (color) updateData.color = color;
  if (price) updateData.price = price;

  await Car.findByIdAndUpdate(carId, updateData);

  res.redirect("/cars/view");
});

app.get("/cars/delete", async (req, res) => {
  const cars = await Car.find({});
  res.render("carsDelete.ejs", {
    title: "Delete Car",
    allCars: cars,
  });
});

app.post("/cars/delete", async (req, res) => {
  const { carId } = req.body;
  await Car.findByIdAndDelete(carId);
  res.redirect("/cars/view");
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
