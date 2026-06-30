import useScrollReveal from "../hooks/useScrollReveal.js";

const VARIANTS = {
  up: "scroll-reveal",
  left: "scroll-reveal-left",
  right: "scroll-reveal-right",
  scale: "scroll-reveal-scale",
  stagger: "scroll-reveal-stagger",
};

export default function ScrollReveal({
  as: Tag = "div",
  variant = "up",
  className = "",
  threshold,
  rootMargin,
  children,
  ...props
}) {
  const [ref, visible] = useScrollReveal({ threshold, rootMargin });
  const revealClass = VARIANTS[variant] || VARIANTS.up;

  return (
    <Tag
      ref={ref}
      className={`${revealClass} ${visible ? "visible" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
