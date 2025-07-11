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
  const [showReservation, setShowReservation] = useState(false);
  const [error, setError] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // Fetching the meal by id
  async function fetchMeal() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meals/${id}`);
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
  async function fetchReservation() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${id}`);

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

  useEffect(() => {
    fetchReservation();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!meal) return <p>Loading...</p>;

  // Separate async function
  async function submitReservation(data, event) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
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
      event.target.reset();
    } catch (error) {
      alert(error.message || "An error occurred");
    }
    fetchMeal();
    setShowReservation(false);
  }

  // Event handler
  function handleReservationSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    submitReservation(data, event);
  }

  // Separate async function for review submission
  async function submitReview(data, event) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
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
      event.target.reset();
    } catch (error) {
      alert(error.message || "An error occurred");
    }
    setShowReview(!showReview);
  }

  // Event handler for review form
  function handleReviewSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    submitReview(data, event);
  }

  // split each of the ternary statements into their own branch of an if-else statement (as suggested by the mentor)
  let reservationMessage = null;
  if (reservation >= meal.max_reservations) {
    reservationMessage = <p className={styles.noReservationsMessage}>No reservations available.</p>;
  }

  let reservationButton = null;
  if (Number(meal.spots_left) > 0) {
    reservationButton = (
      <button
        className={styles.reservationButton}
        onClick={() => setShowReservation(!showReservation)}
      >
        Make a reservation
      </button>
    );
  }

  let reviewForm = null;
  if (showReview) {
    reviewForm = (
      <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
        <label htmlFor="title">Review title:</label>
        <input type="text" name="title" id="title" required />

        <label htmlFor="stars">Rating (1-5):</label>
        <input type="number" name="stars" id="stars" min="1" max="5" required />

        <label htmlFor="comment">Comment:</label>
        <textarea name="comment" id="comment" rows="3" required />
        <button type="submit">Submit</button>
      </form>
    );
  }

  let reservationForm = null;
  if (showReservation && reservation < meal.max_reservations) {
    reservationForm = (
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
    );
  }

  return (
    <div className={styles.mealWrapper}>
      <Link className={styles.backToMenuLink} href="/meals">
        Back
      </Link>
      <div className={styles.mealCard}>
        <img className={styles.mealImage} src={mealImages[meal.id]} alt="meal.title" />
        <h2 className={styles.mealTitle}>{meal.title}</h2>
        <p className={styles.description}>{meal.description}</p>
        <p className={styles.mealPrice}>${meal.price},00</p>
        <p className={styles.mealPrice}>Spots left: {meal.spots_left}</p>
        {reservationMessage}
        <button className={styles.reviewButton} onClick={() => setShowReview(!showReview)}>
          Leave a review ☆
        </button>
        {reservationButton}
        {reviewForm}
        {reservationForm}
      </div>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Meal Sharing. Made with ❤️ for food lovers.
      </footer>
    </div>
  );
}
