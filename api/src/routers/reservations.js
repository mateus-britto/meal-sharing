import express from "express";
import knex from "../database_client.js";

const reservationsRouter = express.Router();

// Returns all reservations
reservationsRouter.get("/reservations", async (req, res) => {
  try {
    const allReservations = await knex("reservation").select("*");

    if (allReservations.length === 0) {
      return res.status(404).json({ message: "No reservations found" });
    }

    res.json(allReservations);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Adds a new reservation to the database
reservationsRouter.post("/reservations", async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // For debugging
  const {
    number_of_guests,
    meal_id,
    created_date,
    contact_phone_number,
    contact_name,
    contact_email,
  } = req.body;

  // Added data validation (had to use AI to figure it out)
  if (
    !number_of_guests ||
    typeof number_of_guests !== "number" ||
    !meal_id ||
    typeof meal_id !== "number" ||
    !created_date ||
    isNaN(Date.parse(created_date)) ||
    !contact_phone_number ||
    typeof contact_phone_number !== "string" ||
    !contact_name ||
    typeof contact_name !== "string" ||
    !contact_email ||
    typeof contact_email !== "string" ||
    !contact_email.includes("@")
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newReservation = {
      number_of_guests,
      meal_id,
      created_date,
      contact_phone_number,
      contact_name,
      contact_email,
    };

    await knex("reservation").insert(newReservation);

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Returns a reservation by id
// Added/updated GET /reservations/:id endpoint to return the total number of guests for a meal by querying reservations with meal_id = id, instead of by reservation id.
// This ensures the frontend can fetch reservation counts per meal correctly.
// Other endpoints (POST, PUT, DELETE) for reservations by reservation id remain
reservationsRouter.get("/reservations/:id", async (req, res) => {
  const { id } = req.params;
  const mealId = Number(id);
  if (!Number.isInteger(mealId) || mealId <= 0) {
    return res.status(400).json({ message: "Invalid meal ID. Must be a positive integer." });
  }

  try {
    const reservations = await knex("reservation").where({ meal_id: mealId });
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found for this meal" });
    }
    const number_of_guests = reservations.reduce((sum, r) => sum + r.number_of_guests, 0);
    res.json({ number_of_guests });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Updates a reservation by id
reservationsRouter.put("/reservations/:id", async (req, res) => {
  const { id } = req.params;
  const { contact_name } = req.body;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid reservation ID. Must be a positive integer." });
  }

  if (!contact_name) {
    return res.status(400).send("Contact name is required.");
  }

  try {
    const rowsUpdated = await knex("reservation").where({ id }).update({ contact_name });

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "No reservation found" });
    }

    res.json({ message: "Reservation updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Deletes the reservations by id
reservationsRouter.delete("/reservations/:id", async (req, res) => {
  const { id } = req.params;

  // Add the same validations as in meals.js
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid reservation ID. Must be a positive integer." });
  }

  try {
    const rowsDeleted = await knex("reservation").where({ id }).del();

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "No reservation to delete" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

export default reservationsRouter;
