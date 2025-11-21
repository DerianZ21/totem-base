import React from "react";
import styles from "./button.module.css";

interface ButtonProps {
  image?: string;
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const ButtonPrimary: React.FC<ButtonProps> = ({
  image,
  label,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles.primary} ${className || ""}`}
      onClick={onClick}
    >
      {image && <img src={image} className={styles.icon} />}
      <span>{label}</span>
    </button>
  );
};

export const ButtonSecondary: React.FC<ButtonProps> = ({
  image,
  label,
  onClick,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles.secondary} ${className || ""}`}
      onClick={onClick}
    >
      {image && <img src={image} className={styles.icon} />}
      <span>{label}</span>
    </button>
  );
};
