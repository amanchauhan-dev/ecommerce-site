"use client";
import { useAppSelector } from "@/hooks/redux-hooks";
import { Geist, Geist_Mono } from "next/font/google";
import { HTMLAttributes, useEffect } from "react";

interface BodyTagProps extends HTMLAttributes<HTMLBodyElement> {}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BodyTag: React.FC<BodyTagProps> = ({ children, className, ...rest }) => {
  const theme = useAppSelector((s) => s.theme);
  return (
    <body
      className={` ${geistSans.variable} ${geistMono.variable} ${theme.value} ${className}`}
      {...rest}
    >
      {children}
    </body>
  );
};

export default BodyTag;
