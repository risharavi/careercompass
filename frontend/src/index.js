import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

document.addEventListener("click", (event) => {
  const submitButton = event.target.closest('[data-testid="submit-interview-answer"]');
  if (!submitButton || submitButton.disabled) return;
  submitButton.disabled = true;
  submitButton.innerHTML = "Answer submitted ✓";
  submitButton.setAttribute("data-submitted", "true");
});
