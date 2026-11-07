"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations";

// Bump the key when the intro changes so returning testers see the latest version once.
const SESSION_KEY = "winefriend-home-intro-v8-seen";

export function HomeIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const shouldShowIntro = !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.sessionStorage.getItem(SESSION_KEY);
    if (!shouldShowIntro) {
      document.documentElement.classList.remove("wf-home-intro-active");
      setVisible(false);
      return;
    }
    setReady(true);
  }, []);

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!visible || !ready || !overlay) return;

    const logo = overlay.querySelector(".wf-home-intro-logo-frame");
    const brand = overlay.querySelector<HTMLElement>(".wf-home-intro-brand");
    const ornament = overlay.querySelector(".wf-home-intro-ornament");
    const rule = overlay.querySelector(".wf-home-intro-rule");
    const copy = overlay.querySelector(".wf-home-intro-copy");
    const vineLeaves = overlay.querySelectorAll<SVGPathElement>(".wf-home-intro-vine g > path:nth-of-type(2)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(false);
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo(logo, { autoAlpha: 0, scale: .97 }, { autoAlpha: 1, scale: 1, duration: 1.15, ease: "power2.out" }, 0)
      .fromTo(ornament, { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power2.out" }, .1)
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "power1.inOut" }, .1)
      .fromTo(brand, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)", duration: 1.25, ease: "power1.inOut" }, 1.15)
      .fromTo(copy, { autoAlpha: 0, y: 10 }, { autoAlpha: .9, y: 0, duration: .8, ease: "power2.out" }, 2.45);

    vineLeaves.forEach((leaf) => {
      const length = leaf.getTotalLength();
      gsap.set(leaf, {
        strokeDasharray: length,
        strokeDashoffset: 0,
        transformBox: "fill-box",
        transformOrigin: "50% 90%",
      });
    });
    timeline.to(vineLeaves, {
      rotation: (index) => index % 2 === 0 ? 2.2 : -2.2,
      duration: 1.2,
      stagger: .14,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut",
    }, .6);

    timeline.to(overlay, {
      clipPath: "inset(0 0 100% 0 round 0 0 46% 46%)",
      duration: .9,
      ease: "power3.inOut",
      onComplete: () => {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
      },
    }, 3.3);

    return () => timeline.kill();
  }, { scope: overlayRef, dependencies: [visible, ready] });

  useEffect(() => {
    document.documentElement.classList.toggle("wf-home-intro-active", visible);
    return () => document.documentElement.classList.remove("wf-home-intro-active");
  }, [visible]);

  return (
    <>
      {visible && (
        <div ref={overlayRef} className="wf-home-intro" aria-label="WineFriend" role="status">
          <svg className="wf-home-intro-vine wf-home-intro-vine-left" viewBox="0 0 300 420" fill="none" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-20 380C90 320 30 240 130 190s80-100 120-170M80 275c-55-70-40-110 0-128 36 28 39 70 0 128Zm45-85c-2-75 32-110 78-100 0 41-25 77-78 100ZM44 297c-60-5-90 20-88 63 39 15 74-3 88-63Zm86-106c-50-6-83 14-88 57 42 14 74-5 88-57Z" />
              <path d="M160 180c-10-40 4-68 38-84 15 33 5 61-38 84Zm5-7c31-34 61-37 86-13-19 34-48 42-86 13Zm-79 88c35-31 67-34 96-10-18 34-49 44-96 10Z" />
            </g>
          </svg>
          <svg className="wf-home-intro-vine wf-home-intro-vine-right" viewBox="0 0 300 420" fill="none" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M320 380C210 320 270 240 170 190S90 90 50 20M220 275c55-70 40-110 0-128-36 28-39 70 0 128Zm-45-85c2-75-32-110-78-100 0 41 25 77 78 100Zm81 107c60-5 90 20 88 63-39 15-74-3-88-63Zm-86-106c50-6 83 14 88 57-42 14-74-5-88-57Z" />
              <path d="M140 180c10-40-4-68-38-84-15 33-5 61 38 84Zm-5-7c-31-34-61-37-86-13 19 34 48 42 86 13Zm79 88c-35-31-67-34-96-10 18 34 49 44 96 10Z" />
            </g>
          </svg>
          <span className="wf-home-intro-logo-frame wf-logo-mark-frame">
            <Image src="/kamaltara-logo.png" alt="WineFriend" width={800} height={600} priority unoptimized className="wf-home-intro-logo" />
            <span className="wf-logo-trademark" aria-hidden="true">{"\u2122"}</span>
          </span>
          <div className="wf-home-intro-ornament" aria-hidden="true">
            <span className="wf-home-intro-rule" />
            <span className="wf-home-intro-diamond" />
            <span className="wf-home-intro-rule" />
          </div>
          <p className="wf-home-intro-brand" aria-label="WineFriend">WineFriend<sup className="wf-trademark-inline" aria-hidden="true">{"\u2122"}</sup></p>
          <p className="wf-home-intro-copy">ALWAYS IN ALL WAYS FOR THE WINE LOVERS</p>
        </div>
      )}
    </>
  );
}
