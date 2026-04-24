"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
}: ButtonProps) {
  const base =
    "inline-block px-6 py-3 text-sm uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer rounded-xl";
  const variants = {
    primary: "bg-accent text-background hover:bg-accent/80",
    outline:
      "border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-background rounded-xl",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  const Comp = href ? "a" : "button";

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Comp href={href} onClick={onClick} className={classes}>
        {children}
      </Comp>
    </motion.div>
  );
}
