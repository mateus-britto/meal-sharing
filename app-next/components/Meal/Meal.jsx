import styles from "./Meal.module.css";

export default function Meal({ meal, disableHover = false }) {
  return (
    <div className={disableHover ? styles.mealCardNoHover : styles.mealCard}>
      <img src={meal.image} alt={meal.title} className={styles.mealImage} loading="lazy" />
      <h2 className={styles.mealTitle}>{meal.title}</h2>
      <p className={styles.description}>{meal.description}</p>
      <p className={styles.mealPrice}>${meal.price},00</p>
      <p className={styles.mealPrice}>Spots left: {meal.spots_left}</p>
    </div>
  );
}
