import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useReveal – Intersection Observer hook for scroll-triggered reveal animations.
 * Returns [ref, isVisible].
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/**
 * useStagger – Returns a function that gives sequential delay classes.
 */
export function useStagger(baseDelay = 80) {
  const counter = useRef(0);

  const getDelay = useCallback(() => {
    const delay = counter.current * baseDelay;
    counter.current += 1;
    return { transitionDelay: `${delay}ms` };
  }, [baseDelay]);

  const reset = useCallback(() => {
    counter.current = 0;
  }, []);

  return { getDelay, reset };
}

/**
 * useParallax – Simple parallax scroll value.
 */
export function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      if (scrolled > 0) {
        setOffset(scrolled * speed);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
}

/**
 * useMouse – Track mouse position for interactive elements.
 */
export function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    function handle(e) {
      setPos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    }
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return pos;
}
