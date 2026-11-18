"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations";
import { GrapevineAnimation } from "@/components/ui/GrapevineAnimation";

export function HomeIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [vineFinished, setVineFinished] = useState(false);
  const [brandingFinished, setBrandingFinished] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.remove("wf-home-intro-active");
        setVisible(false);
        return;
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!visible || !ready || !overlay) return;

    const logo = overlay.querySelector(".wf-home-intro-logo-frame");
    const brand = overlay.querySelectorAll<HTMLElement>(
      ".wf-home-intro-brand .wf-wordmark-text, .wf-home-intro-brand .wf-wordmark-final-glyph",
    );
    const wordmarkTrademark = overlay.querySelector<HTMLElement>(".wf-home-intro-brand .wf-wordmark-trademark");
    const ornament = overlay.querySelector(".wf-home-intro-ornament");
    const rule = overlay.querySelector(".wf-home-intro-rule");
    const copy = overlay.querySelector(".wf-home-intro-copy");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setVisible(false);
      return;
    }

    overlay.classList.add("wf-home-intro-ready");
    const timeline = gsap.timeline();
    timeline
      .fromTo(logo, { autoAlpha: 0, scale: .97 }, { autoAlpha: 1, scale: 1, duration: 1.15, ease: "power2.out" }, 0)
      .fromTo(ornament, { autoAlpha: 0, scale: .98 }, { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power2.out" }, .1)
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "power1.inOut" }, .1)
      .fromTo(brand, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(-.15em -.2em -.15em 0)", duration: 1.25, ease: "power1.inOut" }, .8)
      .fromTo(wordmarkTrademark, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, ease: "power1.out" }, 1.7)
      .fromTo(copy, { autoAlpha: 0, y: 10 }, { autoAlpha: .9, y: 0, duration: .8, ease: "power2.out" }, 2)
      .call(() => setBrandingFinished(true));

    return () => timeline.kill();
  }, { scope: overlayRef, dependencies: [visible, ready] });

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!overlay || !visible || !vineFinished || !brandingFinished) return;
    const exit = gsap.to(overlay, {
      clipPath: "inset(0 0 100% 0 round 0 0 46% 46%)",
      duration: .8,
      ease: "power3.inOut",
      onComplete: () => setVisible(false),
    });
    return () => exit.kill();
  }, { scope: overlayRef, dependencies: [visible, vineFinished, brandingFinished] });

  useEffect(() => {
    document.documentElement.classList.toggle("wf-home-intro-active", visible);
    if (!visible) window.dispatchEvent(new Event("wf-home-intro-exit"));
    return () => document.documentElement.classList.remove("wf-home-intro-active");
  }, [visible]);

  return (
    <>
      {visible && (
        <div ref={overlayRef} className="wf-home-intro" aria-label="WineFriend" role="status">
          <GrapevineAnimation mode="intro" className="wf-home-intro-grapevine" onGrowthComplete={() => setVineFinished(true)} />
          <span className="wf-home-intro-logo-frame wf-logo-mark-frame">
            <Image src="/kamaltara-logo.png" alt="WineFriend" width={800} height={600} priority unoptimized className="wf-home-intro-logo" />
            <span className="wf-logo-trademark" aria-hidden="true">{"\u2122"}</span>
          </span>
          <div className="wf-home-intro-ornament" aria-hidden="true">
            <span className="wf-home-intro-rule" />
            <span className="wf-home-intro-diamond" />
            <span className="wf-home-intro-rule" />
          </div>
          <p className="wf-home-intro-brand" aria-label="WineFriend"><span className="wf-wordmark"><span className="wf-wordmark-text">WineFrien</span><span className="wf-wordmark-final-letter"><span className="wf-wordmark-final-glyph">d</span><span className="wf-wordmark-trademark" aria-hidden="true">{"\u2122"}</span></span></span></p>
          <p className="wf-home-intro-copy">ALWAYS IN ALL WAYS FOR THE WINE LOVERS</p>
        </div>
      )}
    </>
  );
}
