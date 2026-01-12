"use client";
import { Provider } from "react-redux";
import { store } from ".";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}
