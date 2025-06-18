"use client";

import styles from "./MealList.module.css";
import React, { useState, useEffect, use } from "react";

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
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
    };
    fetchMeals();
  }, []);

  if (loading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.mealWrapper}>
      <h1 className={styles.mealsTitle}>Meals</h1>
      <ul className={styles.mealList}>
        {meals.map((meal) => (
          <li className={styles.mealListItem} key={meal.id}>
            <strong>{meal.title}</strong>: {meal.description} - <span>${meal.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
