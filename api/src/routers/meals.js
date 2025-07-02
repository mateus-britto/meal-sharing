import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

// Returns all meals
mealsRouter.get("/meals", async (req, res) => {
  const { maxPrice, availableReservations, title, dateAfter, dateBefore, limit, sortKey, sortDir } =
    req.query;

  try {
    const query = knex("meal")
      .select("meal.*")
      .leftJoin("reservation", "meal.id", "reservation.meal_id")
      .groupBy("meal.id");

    // Filter by maxPrice
    if (maxPrice !== undefined) {
      const parsedMaxPrice = Number(maxPrice);
      if (isNaN(parsedMaxPrice)) {
        return res.status(400).json({ message: "Invalid maxPrice. Must be a number." });
      }
      query.having("price", "<", parsedMaxPrice);
    }

    // Filter by availability of spots
    if (availableReservations !== undefined) {
      const parsedAvailable = availableReservations === "true";

      if (parsedAvailable) {
        query.havingRaw("meal.max_reservations > IFNULL(SUM(reservation.number_of_guests), 0)");
      } else {
        query.havingRaw("meal.max_reservations <= IFNULL(SUM(reservation.number_of_guests), 0)");
      }
    }

    // Filter by partial title (case-insensitive)
    if (title !== undefined) {
      query.whereRaw("LOWER(meal.title) LIKE ?", [`%${title.toLowerCase()}%`]);
    }

    // Filter by date after
    if (dateAfter !== undefined) {
      const parsedDate = new Date(dateAfter);
      if (isNaN(parsedDate)) {
        return res
          .status(400)
          .json({ message: "Invalid date. Use a valid date format (e.g., 2025-05-30)." });
      }
      query.where("meal.when", ">", parsedDate);
    }

    // Filter by date before
    if (dateBefore !== undefined) {
      const parsedDate = new Date(dateBefore);
      if (isNaN(parsedDate)) {
        return res
          .status(400)
          .json({ message: "Invalid date. Use a valid date format (e.g., 2025-05-30)." });
      }
      query.where("meal.when", "<", parsedDate);
    }

    // Filter by number of meals
    if (limit !== undefined) {
      const parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ message: "Invalid limit. Must be a positive integer." });
      }
      query.limit(parsedLimit);
    }

    // Allowed sorting keys
    const allowedSortKeys = ["when", "max_reservations", "price"];
    const allowedSortDirs = ["asc", "desc"];

    if (sortDir && !sortKey) {
      return res.status(400).json({
        message: "`sortDir` requires a `sortKey` to be provided.",
      });
    }

    // If sortKey is valid and provided
    if (sortKey && allowedSortKeys.includes(sortKey)) {
      // Use 'asc' as default direction unless sortDir is valid
      const direction = allowedSortDirs.includes(sortDir?.toLowerCase()) // will convert the value of sortDir to lowercase if sortDir is defined and is a string
        ? sortDir.toLowerCase()
        : "asc";

      query.orderBy(sortKey, direction);
    }

    const meals = await query;
    res.json(meals);
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
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: "Invalid meal ID. Must be a positive integer." });
  }

  // Build update object with only provided fields
  const allowedFields = [
    "title",
    "description",
    "location",
    "when",
    "max_reservations",
    "price",
    "created_date",
  ];
  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update." });
  }

  try {
    const rowsUpdated = await knex("meal").where({ id: parsedId }).update(updateData);

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
