"use client";

import React, { useState, useEffect } from "react";
import Meal from "@/components/Meal/Meal";
import styles from "./page.module.css";
import Link from "next/link";

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch("http://localhost:3000/api/meals");
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
      <div className={styles.mealWrapper}>
        <h1 className={styles.mealsTitle}>Delicious Meals Await You</h1>
        <p className={styles.seeMore}>Click on a meal to see more</p>
        <div className={styles.mealList}>
          {meals.map((meal) => (
            <Link className={styles.mealLink} key={meal.id} href={`http://localhost:3001/meals/${meal.id}`}>
              <Meal meal={meal} />
            </Link>
          ))}
        </div>
      </div>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Meal Sharing. Made with ❤️ for food lovers.
      </footer>
    </div>
  );
}
