import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

// Returns all Reviews
reviewsRouter.get("/reviews", async (req, res) => {
  try {
    const allReviews = await knex("review").select("*");

    if (allReviews.length === 0) {
      return res.status(404).json({ message: "No Reviews found" });
    }

    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Returns all reviews for a specific meal.
reviewsRouter.get("/meals/:meal_id/reviews", async (req, res) => {
  const { meal_id } = req.params;
  const parsedMealId = Number(meal_id);

  if (!Number.isInteger(parsedMealId) || parsedMealId <= 0) {
    return res.status(400).json({ message: "Invalid meal ID. Must be a positive integer." });
  }

  try {
    const reviews = await knex("review").where({ meal_id: parsedMealId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this meal" });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Adds a new review to the database.
reviewsRouter.post("/reviews", async (req, res) => {
  const { title, description, meal_id, stars, created_date } = req.body;

  // Added data validation (had to use AI to figure it out)
  if (
    !title ||
    !description ||
    !meal_id ||
    !stars ||
    !created_date ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    !Number.isInteger(Number(meal_id)) ||
    Number(meal_id) <= 0 ||
    !Number.isInteger(Number(stars)) ||
    Number(stars) < 1 ||
    Number(stars) > 5 ||
    isNaN(Date.parse(created_date))
  ) {
    return res.status(400).json({ message: "Missing or invalid required fields" });
  }

  try {
    const newReview = {
      title,
      description,
      meal_id,
      stars,
      created_date,
    };

    await knex("review").insert(newReview);

    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Returns a review by id.
reviewsRouter.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid review ID. Must be a positive integer." });
  }

  try {
    const review = await knex("review").where({ id }).first();

    if (!review) {
      return res.status(404).json({ message: "No review found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Updates a review by id.
reviewsRouter.put("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid review ID. Must be a positive integer." });
  }

  if (!title) {
    return res.status(400).send("Contact name is required.");
  }

  try {
    const rowsUpdated = await knex("review").where({ id }).update({ title });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "No review found" });
    }

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Deletes the review by id.
reviewsRouter.delete("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  // Add the same validations as in meals.js
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid review ID. Must be a positive integer." });
  }

  try {
    const rowsDeleted = await knex("review").where({ id }).del();

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "No review to delete" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

export default reviewsRouter;
