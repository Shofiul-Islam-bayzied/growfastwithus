"use client";

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    updateIsMobile()
    mql.addEventListener('change', updateIsMobile)

    return () => mql.removeEventListener('change', updateIsMobile)
  }, [])

  return isMobile
}
