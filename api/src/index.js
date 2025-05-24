import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// Respond with all meals in the future (relative to the when datetime)
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
    const [futureMeals] = await knex.raw(futureMealsQuery);
    if (!futureMeals || futureMeals.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(futureMeals);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Respond with all meals in the past (relative to the when datetime)
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const pastMealsQuery = "SELECT * FROM meal where `when` < NOW()";
    const [pastMeals] = await knex.raw(pastMealsQuery);
    if (!pastMeals || pastMeals.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(pastMeals);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Respond with all meals sorted by ID
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const allMealsQuery = "SELECT * FROM meal ORDER BY id";
    const [allMeals] = await knex.raw(allMealsQuery);
    if (!allMeals || allMeals.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(allMeals);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Respond with the first meal (meaning with the minimum id)
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const firstMealQuery = "SELECT title FROM meal ORDER BY id ASC LIMIT 1";
    const [firstMeal] = await knex.raw(firstMealQuery);
    if (!firstMeal || firstMeal.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(firstMeal);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Respond with the last meal (meaning with the maximum id)
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const lastMealQuery = "SELECT title FROM meal ORDER BY id DESC LIMIT 1";
    const [lastMeal] = await knex.raw(lastMealQuery);
    if (!lastMeal || lastMeal.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(lastMeal);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Use imported routers
apiRouter.use(mealsRouter);
apiRouter.use(reservationsRouter);

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
