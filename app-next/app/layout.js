import "./globals.css";

export const metadata = {
  title: "Meal-Sharing",
  description:
    "Discover and share delicious meals with the Meal-Sharing app. Find, host, and enjoy home-cooked dishes from around the world. Join our community and explore new culinary experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
