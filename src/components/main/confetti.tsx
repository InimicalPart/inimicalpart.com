"use client"
import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";

const birthdayUnix = new Date(1163545200000);
const birthdayDate = new Date(birthdayUnix);
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];

export default function Confetti() {
  const konamiBuffer = useRef<string[]>([]);
  const originalTitle = useRef<string>("");
  const [birthdayMode, setBirthdayMode] = useState(false);
  const [konamiBirthdayMode, setKonamiBirthdayMode] = useState(false);

  function launchConfetti(showFinale = false) {
    const duration = showFinale ? 12 * 1000 : 9 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = showFinale
      ? { startVelocity: 38, spread: 360, ticks: 90, zIndex: 0 }
      : { startVelocity: 30, spread: 320, ticks: 80, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = (showFinale ? 170 : 130) * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount: particleCount * 0.9,
          colors: showFinale ? ["#ff7a18", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"] : undefined,
          origin: { x: randomInRange(0.08, 0.42), y: Math.random() - 0.18 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount: particleCount * 0.9,
          colors: showFinale ? ["#ffb703", "#fb8500", "#f72585", "#4cc9f0"] : undefined,
          origin: { x: randomInRange(0.58, 0.92), y: Math.random() - 0.18 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount: particleCount * (showFinale ? 0.8 : 0.6),
          spread: showFinale ? 100 : defaults.spread,
          origin: { x: 0.5, y: Math.random() - 0.28 },
        })
      );

      if (showFinale) {
        confetti(
          Object.assign({}, defaults, {
            particleCount: particleCount * 0.35,
            spread: 140,
            scalar: 1.1,
            origin: { x: randomInRange(0.2, 0.8), y: 0.35 },
          })
        );
      }
    }, showFinale ? 180 : 250);
  }

  function isBirthdayToday() {
    return new Date().getMonth() === birthdayDate.getMonth() && new Date().getDate() === birthdayDate.getDate();
  }

  function birthdayAge() {
    const today = new Date();
    let age = today.getFullYear() - birthdayDate.getFullYear();

    if (
      today.getMonth() < birthdayDate.getMonth() ||
      (today.getMonth() === birthdayDate.getMonth() && today.getDate() < birthdayDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  }

  function birthdayOrdinal(age: number) {
    const remainder = age % 100;

    if (remainder >= 11 && remainder <= 13) {
      return "th";
    }

    switch (age % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  function birthdayTitle() {
    const age = birthdayAge();
    const suffix = birthdayOrdinal(age).toUpperCase();
    return `IT'S INIMI'S ${age}${suffix} BIRTHDAY!`;
  }

  function birthdayConfettiKey() {
    const today = new Date();
    return `birthday-confetti-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  function hasPlayedBirthdayConfettiToday() {
    return window.localStorage.getItem(birthdayConfettiKey()) === "1";
  }

  function markBirthdayConfettiPlayedToday() {
    window.localStorage.setItem(birthdayConfettiKey(), "1");
  }

  function triggerKonamiBirthdayMode() {
    setKonamiBirthdayMode(true);
    launchConfetti(true);

    window.setTimeout(() => {
      setKonamiBirthdayMode(false);
    }, 20 * 1000);
  }

  useEffect(() => {
    const syncBirthdayMode = () => {
      const isBirthday = isBirthdayToday();
      setBirthdayMode(isBirthday || konamiBirthdayMode);

      if (isBirthday && !hasPlayedBirthdayConfettiToday()) {
        markBirthdayConfettiPlayedToday();
        launchConfetti(true);
      }
    };

    syncBirthdayMode();

    const interval = setInterval(syncBirthdayMode, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [konamiBirthdayMode]);

  useEffect(() => {
    if (!birthdayMode) {
      return;
    }

    if (!originalTitle.current) {
      originalTitle.current = document.title;
    }

    let blinkState = false;
    document.title = `${birthdayTitle()} 🎉`;

    const interval = window.setInterval(() => {
      blinkState = !blinkState;
      document.title = blinkState ? `${birthdayTitle()} 🎉` : birthdayTitle();
    }, 250);

    return () => {
      window.clearInterval(interval);
      document.title = originalTitle.current || document.title;
    };
  }, [birthdayMode]);

        useEffect(() => {
          const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

            konamiBuffer.current = [...konamiBuffer.current, key].slice(-konamiCode.length);

            const matched = konamiCode.every((expectedKey, index) => konamiBuffer.current[index] === expectedKey);

            if (matched) {
              konamiBuffer.current = [];
              triggerKonamiBirthdayMode();
            }
          };

          window.addEventListener("keydown", handleKeyDown);

          return () => {
            window.removeEventListener("keydown", handleKeyDown);
          };
        }, []);

    return null;
}