"use client";
import "./globals.css";
import Head from "next/head";

import { DataProvider } from "../Contextapi";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Book your oil change </title>
      </Head>
      <body >
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
