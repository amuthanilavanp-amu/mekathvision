import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Maketh Vision | Manifest Your Cinematic Tales',
  description: 'Experience storytelling like never before. Dive into a sanctuary of imagination, where every tale is a cinematic journey crafted by visionaries.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Maketh Vision',
    description: 'The sanctuary for cinematic storytelling.',
    url: 'https://timely-concha-3d7463.netlify.app',
    siteName: 'Maketh Vision',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
