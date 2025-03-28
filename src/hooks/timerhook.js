import { useState, useEffect } from "react";
import useRecordVolume from "./recordVolume";

export default function useCountTime() {
    const [count, setCount] = useState(0); //カウント
    const [isRunning, setIsRunning] = useState(false); //カウントが動いているか
    const [isSampling, setIsSampling] = useState(false); //サンプリングが行われたか
    const [avgdB, setAvgdB] = useState(0); //算出した平均を出す
    const { avgdBArray, showdB, startRecording, stopRecording } =
        useRecordVolume();

    //useEffect内で秒数のカウントとデータとして使う音量の計算を行う
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setCount((prev) => prev + 1); //カウント

                //平均音量を算出
                const sum = avgdBArray.current.reduce(
                    (acc, cur) => acc + cur,
                    0
                );
                // setAvgdB(Math.floor(sum / avgdBArray.lenght))
                console.log(Math.floor(sum / avgdBArray.current.length));
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [avgdBArray, isRunning]);

    const startTimer = () => {
        setCount(0);
        setIsRunning(true);
        startRecording();
    };

    const finishMeasure = () => {
        setIsRunning(false);
        setIsSampling(true);
        stopRecording();
    };

    return {
        count,
        isRunning,
        isSampling,
        avgdB,
        showdB,
        startTimer,
        finishMeasure,
    };
}
