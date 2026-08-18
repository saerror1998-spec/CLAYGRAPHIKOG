"use client";

import { useState, useCallback } from "react";
import "./StarBorder.css";

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  hoverSpeed?: string;
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Premium edge-travel border effect — a subtle Lime radial gradient
 * sweeps along the button border. Adapted from React Bits StarBorder
 * to Clay Graphik brand language.
 */
export default function StarBorder({
  as: Component = "button",
  className = "",
  color = "#CCFF00",
  speed = "5s",
  thickness = 1,
  hoverSpeed = "3.8s",
  children,
  href,
  onClick,
  type,
  disabled,
  style,
  ...rest
}: StarBorderProps & Record<string, unknown>) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const activeSpeed = hovered ? hoverSpeed : speed;
  const activeOpacity = hovered ? "0.9" : "0.55";

  const componentProps: Record<string, unknown> = {
    className: `cg-star-border ${className}`,
    style: {
      padding: `${thickness}px 0`,
      ...style,
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...rest,
  };

  // Add Link-specific props
  if (href) componentProps.href = href;
  if (type) componentProps.type = type;
  if (disabled !== undefined) componentProps.disabled = disabled;

  return (
    <Component {...componentProps}>
      <div
        className="cg-star-border-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: activeSpeed,
          opacity: activeOpacity,
        }}
      />
      <div
        className="cg-star-border-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: activeSpeed,
          opacity: activeOpacity,
        }}
      />
      <div className="cg-star-border-inner">{children}</div>
    </Component>
  );
}
