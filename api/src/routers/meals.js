import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

// Returns all meals
mealsRouter.get("/meals", async (req, res) => {
  try {
    const allMeals = await knex("meal").select("*");

    if (allMeals.length === 0) {
      return res.status(404).json({ message: "No meals found" });
    }

    res.json(allMeals);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Adds a new meal to the database
// Change this route to accept data from the client
mealsRouter.post("/meals", async (req, res) => {
  const { title, description, location, when, max_reservations, price, created_date } = req.body;

  // Data validation
  if (
    !title ||
    typeof title !== "string" ||
    !description ||
    typeof description !== "string" ||
    !location ||
    typeof location !== "string" ||
    !when ||
    isNaN(Date.parse(when)) ||
    !Number.isInteger(max_reservations) ||
    max_reservations <= 0 ||
    typeof price !== "number" ||
    price <= 0 ||
    !created_date ||
    isNaN(Date.parse(created_date))
  ) {
    return res.status(400).json({ message: "Missing or invalid required fields" });
  }

  try {
    const newMeal = {
      title,
      description,
      location,
      when,
      max_reservations,
      price,
      created_date,
    };

    await knex("meal").insert(newMeal);

    res.status(201).json({ message: "Meal created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Returns the meal by id
mealsRouter.get("/meals/:id", async (req, res) => {
  const { id } = req.params;

  // Add ID validation
  // Converts the string to a number, checks if it is a whole number and rejects zero or negative numbers
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid meal ID. Must be a positive integer." });
  }

  try {
    const meal = await knex("meal").where({ id }).first();

    if (!meal) {
      return res.status(404).json({ message: "No meal found" });
    }

    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Updates the meal by id
mealsRouter.put("/meals/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid reservation ID. Must be a positive integer." });
  }

  if (!title) {
    return res.status(400).send("Title is required.");
  }

  try {
    const rowsUpdated = await knex("meal").where({ id }).update({ title });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "No meal found" });
    }

    res.json({ message: "Meal updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Deletes the meal by id
mealsRouter.delete("/meals/:id", async (req, res) => {
  const { id } = req.params;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid reservation ID. Must be a positive integer." });
  }

  try {
    const rowsDeleted = await knex("meal").where({ id }).del();

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "No meal found to delete" });
    }

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

export default mealsRouter;
