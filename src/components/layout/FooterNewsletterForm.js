"use client";

import { useState } from "react";
import { submitNewsletterForm } from "@/lib/actions";
import styles from "./Footer.module.css";

export default function FooterNewsletterForm() {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.target);
    const result = await submitNewsletterForm(formData);

    if (result.success) {
      setStatus("success");
      e.target.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  };

  if (status === "success") {
    return (
      <div style={{ backgroundColor: "#2d3748", padding: "0.75rem", borderRadius: "8px", color: "#68d391", fontSize: "0.95rem" }}>
        Thanks for subscribing!
      </div>
    );
  }

  return (
    <form className={styles["footer__form"]} action="javascript:void(0);" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email address"
        required
        disabled={status === "loading"}
        className={styles["footer__input"]}
      />
      <button 
        type="submit" 
        disabled={status === "loading"}
        className={styles["footer__btn"]}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p style={{ color: "#fc8181", fontSize: "0.85rem", marginTop: "0.5rem", width: "100%" }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
