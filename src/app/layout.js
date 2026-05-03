import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Maketh Vision | Cinematic Storytelling Platform',
  description: 'Explore, discover, and share amazing stories in a cinematic anime-inspired world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <div className="cherry-blossom-container"></div>
        {children}
      </body>
    </html>
  );
}
