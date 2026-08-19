"use client";

import { useRef, useState, useCallback } from "react";
import "./LiquidButton.css";

/**
 * Premium liquid-fill CTA — a Lime fill rises from the bottom on hover,
 * transitioning the text to Carbon. Coexists with StarBorder (which owns
 * the outer animated border) via a LiquidCTA wrapper.
 */

interface LiquidButtonProps {
  as?: React.ElementType;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

export default function LiquidButton({
  as: Component = "button",
  className = "",
  children,
  href,
  type,
  disabled,
  onClick,
  target,
  rel,
  style,
  ...rest
}: LiquidButtonProps & Record<string, unknown>) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => {
    setHovered(false);
    setPressed(false);
  }, []);
  const handleDown = useCallback(() => setPressed(true), []);
  const handleUp = useCallback(() => setPressed(false), []);

  const componentProps: Record<string, unknown> = {
    ref: rootRef,
    className: `cg-liquid-btn ${hovered ? "cg-liquid-hover" : ""} ${pressed ? "cg-liquid-press" : ""} ${className}`,
    style,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onMouseDown: handleDown,
    onMouseUp: handleUp,
    onFocus: handleEnter,
    onBlur: handleLeave,
    ...rest,
  };

  if (href) {
    componentProps.href = href;
    if (target) componentProps.target = target;
    if (rel) componentProps.rel = rel;
  }
  if (type) componentProps.type = type;
  if (disabled !== undefined) componentProps.disabled = disabled;

  return (
    <Component {...componentProps}>
      {/* Liquid fill layer — rises from bottom on hover */}
      <span className="cg-liquid-fill" aria-hidden="true" />
      {/* Content sits above the fill */}
      <span className="cg-liquid-content">{children}</span>
    </Component>
  );
}
