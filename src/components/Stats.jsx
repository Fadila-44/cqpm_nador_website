

import { useEffect, useRef, useState } from "react";

function useCountUp(target, enabled) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frameId;
    let startTime;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress * (2 - progress);
      setValue(Math.floor(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(animate);
      else setValue(target);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, target]);

  return value;
}

function StatCard({ stat, index, active }) {
  const value = useCountUp(stat.target, active);

  return (
    <article className={`stat-card ${active ? "stat-card-visible" : ""}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="stat-icon">
        <span className="material-symbols-outlined">{stat.icon}</span>
      </div>
      <div className="stat-number">
        <span>{value}</span>
        {stat.suffix && <span className={stat.suffix.length > 1 ? "stat-small-suffix" : "stat-suffix"}>{stat.suffix}</span>}
      </div>
      <div className="stat-label">{stat.label}</div>
    </article>
  );
}

export default function Stats({ text }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="container">
        <div className="stats-grid">
          {text.stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
