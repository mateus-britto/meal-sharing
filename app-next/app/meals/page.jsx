"use client";

import React, { useState, useEffect } from "react";
import Meal from "@/components/Meal/Meal";
import styles from "./page.module.css";
import Link from "next/link";
import mealImages from "@/utils/mealImages";

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [sortDir, setSortDir] = useState("asc");

  // Function to fetch meals
  async function fetchMeals(currentSortKey, currentSortDir) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/meals?sortKey=${currentSortKey}&sortDir=${currentSortDir}`
      );
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

  // Effect for fetching the meals whenever sortKey/sortDir change
  useEffect(() => {
    fetchMeals(sortKey, sortDir);
  }, [sortKey, sortDir]);

  if (loading) {
    return (
      <div className={styles.loadingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  // Function to handle search submission
  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  // Filtering meals for search
  const filteredMeals = meals.filter((meal) =>
    meal.title.toLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      {/* search and sort functionalities */}
      <div className={styles.searchAndSortWrapper}>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <label htmlFor="searchInput" className={styles.label} style={{ display: "none" }}>
            Search meals
          </label>
          <img src="/assets/search.svg" alt="Search" className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            id="searchInput"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className={styles.sortControls}>
          <label className={styles.label} htmlFor="sortKey">
            Sort by:
            <select id="sortKey" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="title">Meal name</option>
              <option value="description">Meal description</option>
              <option value="price">Meal price</option>
            </select>
          </label>

          <label className={styles.label} htmlFor="sortDir">
            Order by:
            <select id="sortDir" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>
      {/* search and sort functionalities */}
      <div className={styles.mealWrapper}>
        <h1 className={styles.mealsTitle}>Delicious Meals Await You</h1>
        <p className={styles.seeMore}>Click on a meal to make reservations</p>
        {filteredMeals.length === 0 && (
          <p className={styles.resultsMessage}>No meals match your search</p>
        )}
        <div className={styles.mealList}>
          {filteredMeals.map((meal) => (
            <Link className={styles.mealLink} key={meal.id} href={`/meals/${meal.id}`}>
              <Meal meal={{ ...meal, image: mealImages[meal.id] }} />
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
