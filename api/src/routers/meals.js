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
mealsRouter.post("/meals", async (req, res) => {
  try {
    const newMeal = {
      title: "Taco Fiesta",
      description: "Authentic Mexican tacos with fresh toppings",
      location: "Fiesta Grill",
      when: "2023-11-05 18:30:00",
      max_reservations: 25,
      price: 12.5,
      created_date: "2023-10-15",
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
