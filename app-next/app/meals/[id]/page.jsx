"use client";
import styles from "./page.module.css";
import { use } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import mealImages from "@/utils/mealImages";

export default function MealDetail({ params }) {
  const { id } = typeof params.then === "function" ? use(params) : params;
  // Implemented "use" due to a warning saying that: In recent and upcoming versions of Next.js, params may be a Promise instead of a plain object.
  const [meal, setMeal] = useState(null);
  const [reservation, setReservation] = useState(0);
  const [error, setError] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // Fetching the meal by id
  async function fetchMeal() {
    try {
      const response = await fetch(`http://localhost:3000/api/meals/${id}`);
      if (!response.ok) {
        throw new Error("Meal not found");
      }
      const data = await response.json();
      setMeal(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Fetching the meal by id
  useEffect(() => {
    fetchMeal();
  }, [id]);

  // Fetching the reservation by id
  useEffect(() => {
    async function fetchReservation() {
      try {
        const response = await fetch(`http://localhost:3000/api/reservations/${id}`);

        if (response.status === 404) {
          setReservation(0); // No reservations for this meal, allow user to create one
          return;
        }

        if (!response.ok) {
          throw new Error("Reservation not found");
        }
        const data = await response.json();
        setReservation(data.number_of_guests);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchReservation();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!meal) return <p>Loading...</p>;

  // Handle form submission
  function handleReservationSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    async function submitReservation() {
      try {
        const response = await fetch("http://localhost:3000/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact_name: data.name,
            contact_email: data.email,
            contact_phone_number: String(data.phone),
            number_of_guests: 1,
            meal_id: Number(id),
            created_date: new Date().toISOString().slice(0, 10),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to submit reservation");
        }
        alert("Reservation submitted!");
        event.target.reset(); // Clears the form if submission succeeds
      } catch (error) {
        alert(error.message || "An error occurred");
      }
    }

    submitReservation();
    fetchMeal();
  }

  // Handle review submission
  function handleReviewSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    async function submitReview() {
      try {
        const response = await fetch("http://localhost:3000/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.comment,
            meal_id: Number(id),
            stars: Number(data.stars),
            created_date: new Date().toISOString().slice(0, 10),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit review");
        }
        alert("Thank you for your feedback!");
        event.target.reset(); // Clears the form if submission succeeds
      } catch (error) {
        alert(error.message || "An error occurred");
      }
    }
    submitReview();
  }

  return (
    <div className={styles.mealWrapper}>
      <Link className={styles.backToMenuLink} href="http://localhost:3001/meals">
        Back
      </Link>
      <div className={styles.mealCard}>
        <img className={styles.mealImage} src={mealImages[meal.id]} alt="meal.title" />
        <h2 className={styles.mealTitle}>{meal.title}</h2>
        <p className={styles.description}>{meal.description}</p>
        <p className={styles.mealPrice}>${meal.price},00</p>
        <p className={styles.mealPrice}>Spots left: {meal.spots_left}</p>
      </div>
      <button
        className={`${styles.reviewButton} ${!showReview ? styles.hidden : ""}`}
        onClick={() => setShowReview(!showReview)}
      >
        Leave a review
      </button>
      <div className={styles.reviewWrapper}>
        {showReview && (
          <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" id="title" required />

            <label htmlFor="stars">Rating (1-5):</label>
            <input type="number" name="stars" id="stars" min="1" max="5" required />

            <label htmlFor="comment">Comment:</label>
            <textarea name="comment" id="comment" rows="3" required />

            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      {reservation < meal.max_reservations ? (
        <form className={styles.form} onSubmit={handleReservationSubmit}>
          <h2 className={styles.makeReservation}>Please make a reservation</h2>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" placeholder="exemple@exampe.com" required />
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" name="phone" id="phone" required />
          <button>Submit</button>
        </form>
      ) : (
        <p className={styles.noReservationsMessage}>No reservations available for this meal.</p>
      )}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Meal Sharing. Made with ❤️ for food lovers.
      </footer>
    </div>
  );
}
