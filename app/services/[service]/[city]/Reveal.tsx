"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = ref.current;
    const node = container?.firstElementChild;

    if (!(node instanceof HTMLElement)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisible(true);
        observer.unobserve(node);
      },
      { threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={
        {
          "--reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
      className={`contents [&>*]:transform-gpu [&>*]:transition-all [&>*]:duration-700 [&>*]:ease-out [&>*]:[transition-delay:var(--reveal-delay)] ${
        visible
          ? "[&>*]:translate-y-0 [&>*]:opacity-100"
          : "[&>*]:translate-y-8 [&>*]:opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}