import "./globals.css";

export const metadata = {
  title: "Noyo OS MVP",
  description:
    "A Next.js MVP for a benefits data operating system inspired by the local Noyo blueprint PDF.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
