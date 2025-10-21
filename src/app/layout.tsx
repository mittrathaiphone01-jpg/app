
import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { PropsWithChildren } from "react";
import { Prompt } from 'next/font/google'
import SessionProvider from "@/components/ Providers/SessionProviderAuth";
  import { ToastContainer } from 'react-toastify';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-prompt',
})

export default function RootLayout({ children }: PropsWithChildren) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prompt.className}`}>
        <ToastContainer autoClose={2000} theme="colored"/>
        <SessionProvider  >
          {children}
        </SessionProvider>

      </body>
    </html>
  );
}
