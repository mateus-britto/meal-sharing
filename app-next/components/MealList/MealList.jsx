"use client";
import React, { useState, useEffect } from "react";
import Meal from "../Meal/Meal";
import styles from "./MealList.module.css";
import Link from "next/link";
import mealImages from "@/utils/mealImages";

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meals`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMeals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals", error);
        setLoading(false);
      }
    }
    fetchMeals();
  }, []);

  if (loading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Welcome to Meal Sharing!</h1>
        <p>Discover and share delicious meals with friends and family.</p>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div>
          <img src="/assets/checkmark-svgrepo-com.svg" alt="Easy" />
          <p>Easy Reservations</p>
        </div>
        <div>
          <img src="/assets/chef-hat-svgrepo-com.svg" alt="Diverse" />
          <p>Diverse Cuisines</p>
        </div>
        <div>
          <img src="/assets/thumbs-up-svgrepo-com.svg" alt="Reviews" />
          <p>Trusted Reviews</p>
        </div>
      </section>

      {/* Meals Section */}
      <div className={styles.mealWrapper}>
        <h2 className={styles.mealsTitle}>Some of our Meals</h2>
        <div className={styles.mealList}>
          {meals.slice(0, 4).map((meal, idx) => (
            <Meal
              key={meal.id}
              meal={{ ...meal, image: mealImages[meal.id] }}
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          ))}
        </div>
        <Link className={styles.mealsLink} href="/meals">
          <button className={styles.seeMoreBtn}>See more ➡️</button>
        </Link>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Meal Sharing. Made with ❤️ for food lovers.
      </footer>
    </div>
  );
}
