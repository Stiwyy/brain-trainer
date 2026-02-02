import "./globals.css";

export const metadata = {
  title: "Brain Trainer",
  description: "Train your Brain with easy exercises",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
