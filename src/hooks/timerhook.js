import { useState, useEffect } from "react";

export default function useCountTime() {
    const [count, setCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isdone, setIsdone] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setCount((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [isRunning]);

    const startTimer = () => {
        setIsRunning(true);
    };

    const finishMeasure = () => {
        setIsRunning(false);
        setIsdone(true);
    };

    return { count, isRunning, isdone, startTimer, finishMeasure };
}
