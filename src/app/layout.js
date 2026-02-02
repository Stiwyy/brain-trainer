import "./globals.css";

export const metadata = {
  title: "Brain Trainer",
  description: "Train your Brain with easy exercises",
  icons: {
    icon: "https://img.icons8.com/fluency/96/brain.png",
    apple: "https://img.icons8.com/fluency/96/brain.png",
  },
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
