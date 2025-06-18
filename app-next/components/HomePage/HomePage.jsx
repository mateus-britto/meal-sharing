import styles from "./HomePage.module.css";
import MealList from "../MealList/MealList";

// Feel free to replace the content of this component with your own
function HomePage() {
  return (
    <>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome to Meal Sharing!</h1>
        <p className={styles.welcomeDescription}>
          Discover and share delicious meals with friends and family.
        </p>
      </div>
      <MealList />
    </>
  );
}

export default HomePage;
