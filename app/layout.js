import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata = {
  title: 'FinFlow | Personal Finance Dashboard',
  description: 'Track transactions, visualize insights, and manage your finances with FinFlow — a premium personal finance dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#141b2d',
                color: '#fff',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 600,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
