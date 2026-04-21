"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./StepForm.module.css";
import wizardStyles from "./ListingWizard.module.css";

function Step4Media({ formData, updateFormData, nextStep, prevStep }) {
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({ featured: "", gallery: "" });
  const [dragState, setDragState] = useState({
    featured: false,
    gallery: false,
  });

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const processFiles = (incomingFiles, field) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    let currentErrors = [];

    const validFiles = incomingFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        currentErrors.push(
          `"${file.name}" is not a valid format (JPEG, PNG, WEBP only).`,
        );
        return false;
      }
      if (file.size > maxSize) {
        currentErrors.push(`"${file.name}" exceeds the 5MB limit.`);
        return false;
      }
      return true;
    });

    if (field === "featuredImage") {
      if (currentErrors.length > 0) {
        setFileErrors((prev) => ({ ...prev, featured: currentErrors[0] }));
      } else if (validFiles.length > 0) {
        setFileErrors((prev) => ({ ...prev, featured: "" }));
        updateFormData({ featuredImage: validFiles[0] });
      }
    } else if (field === "gallery") {
      let newGallery = [...(formData.gallery || []), ...validFiles];
      if (newGallery.length > 10) {
        currentErrors.push(
          "Maximum 10 images allowed. Excess images were removed.",
        );
        newGallery = newGallery.slice(0, 10);
      }

      setFileErrors((prev) => ({
        ...prev,
        gallery: currentErrors.length > 0 ? currentErrors.join(" ") : "",
      }));

      if (validFiles.length > 0 || currentErrors.length > 0) {
        updateFormData({ gallery: newGallery });
      }
    }
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files), field);
    }
    // Reset input value so the same file can be uploaded again if removed
    e.target.value = null;
  };

  // Drag and Drop Handlers
  const handleDragOver = (e, field) => {
    e.preventDefault();
    setDragState((prev) => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e, field) => {
    e.preventDefault();
    setDragState((prev) => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragState((prev) => ({ ...prev, [field]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Map the 'featured' drag state key to the 'featuredImage' data key
      const targetField = field === "featured" ? "featuredImage" : field;
      processFiles(Array.from(e.dataTransfer.files), targetField);
    }
  };

  // Removal Handlers
  const removeFeatured = () => {
    updateFormData({ featuredImage: null });
    setFileErrors((prev) => ({ ...prev, featured: "" }));
  };

  const removeGalleryImage = (indexToRemove) => {
    const newGallery = formData.gallery.filter(
      (_, index) => index !== indexToRemove,
    );
    updateFormData({ gallery: newGallery });
    setFileErrors((prev) => ({ ...prev, gallery: "" })); // Clear errors on manual removal
  };

  const handleNext = () => {
    const newErrors = {};
    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Must start with http:// or https://";
    }

    // Prevent continuation if there are active file validation errors
    if (fileErrors.featured || fileErrors.gallery) {
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  };

  return (
    <div className={styles["step-form"]}>
      <header className={styles["step-form__header"]}>
        <span className="material-symbols-outlined">perm_media</span>
        <h2>Media & Gallery</h2>
      </header>

      {/* FEATURED IMAGE */}
      <div className={styles["step-form__group"]}>
        <label className={styles["step-form__label"]}>Featured Image</label>

        {!formData.featuredImage ? (
          <div
            onDragOver={(e) => handleDragOver(e, "featured")}
            onDragLeave={(e) => handleDragLeave(e, "featured")}
            onDrop={(e) => handleDrop(e, "featured")}
            style={{
              border: `2px dashed ${fileErrors.featured ? "#ef4444" : dragState.featured ? "#e04c4c" : "#cbd5e1"}`,
              backgroundColor: dragState.featured ? "#fef2f2" : "#f8fafc",
              padding: "3rem 2rem",
              borderRadius: "12px",
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "2.5rem",
                color: "#94a3b8",
                marginBottom: "0.5rem",
              }}
            >
              add_photo_alternate
            </span>
            <p style={{ margin: "0 0 1rem 0", color: "#475569" }}>
              Drag & drop your featured image here, or
            </p>
            <input
              type="file"
              id="featuredImage"
              accept="image/jpeg, image/png, image/webp"
              onChange={(e) => handleFileChange(e, "featuredImage")}
              style={{ display: "none" }}
            />
            <label
              htmlFor="featuredImage"
              style={{
                cursor: "pointer",
                backgroundColor: "#fff",
                border: "1px solid #cbd5e1",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                color: "#1e293b",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              Browse Files
            </label>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "200px",
              height: "140px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            <Image
              src={URL.createObjectURL(formData.featuredImage)}
              alt="Featured Preview"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
            <button
              onClick={removeFeatured}
              title="Remove image"
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                close
              </span>
            </button>
          </div>
        )}

        {fileErrors.featured && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontWeight: 500,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.1rem" }}
            >
              error
            </span>
            {fileErrors.featured}
          </div>
        )}
      </div>

      {/* GALLERY IMAGES */}
      <div className={styles["step-form__group"]}>
        <label className={styles["step-form__label"]}>
          Gallery Images (Max 10)
        </label>

        <div
          onDragOver={(e) => handleDragOver(e, "gallery")}
          onDragLeave={(e) => handleDragLeave(e, "gallery")}
          onDrop={(e) => handleDrop(e, "gallery")}
          style={{
            border: `2px dashed ${fileErrors.gallery ? "#ef4444" : dragState.gallery ? "#e04c4c" : "#cbd5e1"}`,
            backgroundColor: dragState.gallery ? "#fef2f2" : "#f8fafc",
            padding: "2rem",
            borderRadius: "12px",
            transition: "all 0.2s ease",
            minHeight: "150px",
          }}
        >
          {formData.gallery && formData.gallery.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {formData.gallery.map((file, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fff",
                  }}
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Gallery preview ${index + 1}`}
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
                    title="Remove image"
                    style={{
                      position: "absolute",
                      top: "0.25rem",
                      right: "0.25rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      close
                    </span>
                  </button>
                </div>
              ))}

              {/* Add More Button inside the gallery */}
              {formData.gallery.length < 10 && (
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="file"
                    id="gallery"
                    accept="image/jpeg, image/png, image/webp"
                    multiple
                    onChange={(e) => handleFileChange(e, "gallery")}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="gallery"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      color: "#64748b",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.5rem" }}
                    >
                      add
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Add More
                    </span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "2.5rem",
                  color: "#94a3b8",
                  marginBottom: "0.5rem",
                }}
              >
                collections
              </span>
              <p style={{ margin: "0 0 1rem 0", color: "#475569" }}>
                Drag & drop your gallery images here
              </p>
              <input
                type="file"
                id="gallery"
                accept="image/jpeg, image/png, image/webp"
                multiple
                onChange={(e) => handleFileChange(e, "gallery")}
                style={{ display: "none" }}
              />
              <label
                htmlFor="gallery"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  border: "1px solid #cbd5e1",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  color: "#1e293b",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Browse Files
              </label>
            </div>
          )}
        </div>

        {fileErrors.gallery && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontWeight: 500,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1.1rem" }}
            >
              error
            </span>
            {fileErrors.gallery}
          </div>
        )}
      </div>

      {/* VIDEO URL */}
      <div className={styles["step-form__group"]}>
        <label htmlFor="videoUrl" className={styles["step-form__label"]}>
          Video URL (YouTube/Vimeo)
        </label>
        <input
          type="url"
          id="videoUrl"
          className={`${styles["step-form__input"]} ${errors.videoUrl ? styles["step-form__input--error"] : ""}`}
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.videoUrl}
          onChange={(e) => updateFormData({ videoUrl: e.target.value })}
        />
        {errors.videoUrl && (
          <span
            className={styles["step-form__error-message"]}
            style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              marginTop: "0.25rem",
              display: "block",
            }}
          >
            {errors.videoUrl}
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className={wizardStyles["wizard__actions"]}>
        <button
          className={`${wizardStyles["wizard__button"]} ${wizardStyles["wizard__button--secondary"]}`}
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className={`${wizardStyles["wizard__button"]} ${wizardStyles["wizard__button--primary"]}`}
          onClick={handleNext}
          disabled={!!fileErrors.featured || !!fileErrors.gallery}
          style={{
            opacity: fileErrors.featured || fileErrors.gallery ? 0.5 : 1,
            cursor:
              fileErrors.featured || fileErrors.gallery
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Step4Media;
