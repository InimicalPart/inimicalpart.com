"use client"
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

export default function Confetti() {
    function HBD_Confetti() {
        var duration = 10 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }
    
        var interval: NodeJS.Timeout = setInterval(function () {
          var timeLeft = animationEnd - Date.now();
    
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
    
          var particleCount = 125 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 },
            })
          );
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.5, 0.9), y: Math.random() - 0.2 },
            })
          );
        }, 250);
      }

      function nextBirthday(date: Date) {
        let thisYearBd: Date | number = new Date(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            new Date().getFullYear() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds()
        );
        // console.log(thisYearBd)
        if (thisYearBd < new Date()) {
          thisYearBd = thisYearBd.setFullYear(thisYearBd.getFullYear() + 1);
        }
        if (thisYearBd instanceof Date) {
          return thisYearBd.getTime();
        } else {
          return thisYearBd;
        }
      }


    const [celebration, setCelebration] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            const birthday = nextBirthday(new Date(1163623320000));
            if (birthday - Date.now() < 500 && !celebration) {
                HBD_Confetti();
                setCelebration(true);
            } else if (birthday - Date.now() > 500 && celebration) {
                setCelebration(false);
            }
        },100)
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [celebration]);

    return null;
}