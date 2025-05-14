import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// Homework begins bellow
apiRouter.get("/meals", async (req, res) => {
  const mealQuery = "SELECT * FROM meal";
  const [meal] = await knex.raw(mealQuery); // Destructuring the result to extract the meal data
  res.json(meal);
});

apiRouter.get("/reservations", async (req, res) => {
  const reservationQuery = "SELECT * FROM reservation";
  const [reservation] = await knex.raw(reservationQuery);
  res.json(reservation);
});

apiRouter.get("/reviews", async (req, res) => {
  const reviewQuery = "SELECT * FROM review";
  const [review] = await knex.raw(reviewQuery);
  res.json(review);
});

// Respond with all meals in the future (relative to the when datetime)
apiRouter.get("/future-meals", async (req, res) => {
  const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
  const [futureMeals] = await knex.raw(futureMealsQuery);
  res.json(futureMeals);
});

// Respond with all meals in the past (relative to the when datetime)
apiRouter.get("/past-meals", async (req, res) => {
  const pastMealsQuery = "SELECT * FROM meal where `when` < NOW()";
  const [pastMeals] = await knex.raw(pastMealsQuery);
  res.json(pastMeals);
});

// Respond with all meals sorted by ID
apiRouter.get("/all-meals", async (req, res) => {
  const allMealsQuery = "SELECT * FROM meal ORDER BY id";
  const [allMeals] = await knex.raw(allMealsQuery);
  res.json(allMeals);
});

// Respond with the first meal (meaning with the minimum id)
apiRouter.get("/first-meal", async (req, res) => {
  const firstMealQuery = "SELECT title FROM meal ORDER BY id ASC LiMIT 1";
  const [firstMeal] = await knex.raw(firstMealQuery);
  res.json(firstMeal);
});

// Respond with the last meal (meaning with the maximum id)
apiRouter.get("/last-meal", async (req, res) => {
  const lastMealQuery = "SELECT title FROM meal ORDER BY id DESC LiMIT 1";
  const [lastMeal] = await knex.raw(lastMealQuery);
  res.json(lastMeal);
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
