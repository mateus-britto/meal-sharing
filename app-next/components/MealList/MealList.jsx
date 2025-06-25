"use client";
import React, { useState, useEffect } from "react";
import Meal from "../Meal/Meal";
import styles from "./MealList.module.css";

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
    <div className={styles.mealWrapper}>
      <h1 className={styles.mealsTitle}>Meals</h1>
      <div className={styles.mealList}>
        {meals.map((meal) => (
          <Meal
            key={meal.id}
            meal={meal}
          />
        ))}
      </div>
    </div>
  );
}
