import styles from "./Meal.module.css";

export default function Meal({meal}) {
  return (
    <div className={styles.mealCard}>
      <h2 className={styles.mealTitle}>{meal.title}</h2>
      <p className={styles.description}>{meal.description}</p>
      <p className={styles.mealPrice}>${meal.price},00</p>
    </div>
  );
}
