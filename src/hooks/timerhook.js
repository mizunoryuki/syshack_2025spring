import { useState, useEffect } from "react";
import useRecordVolume from "./recordVolume";

export default function useCountTime() {
    const [count, setCount] = useState(0); //カウント
    const [isRunning, setIsRunning] = useState(false); //計測が始まっているか
    const [isSampling, setIsSampling] = useState(false); //サンプリングが行われたか
    const { avgdBArray, showdB, startRecording, stopRecording } =
        useRecordVolume();
    const [dBArray, setdBArray] = useState([]); //グラフの描画のために使うデータを格納する

    //useEffect内で秒数のカウントとデータとして使う音量の計算を行う
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setCount((prev) => prev + 1); //カウント
                setdBArray([...dBArray, calcAverage(avgdBArray.current)]); //音量
                avgdBArray.current = []; //初期化
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [avgdBArray, dBArray, isRunning]);

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
        dBArray,
        showdB,
        startTimer,
        finishMeasure,
    };
}

//平均計算
export function calcAverage(array) {
    const filterdArray = array.filter((item) => item !== 0); //配列から0を除外

    const sum = filterdArray.reduce((acc, cur) => acc + cur, 0); //合計

    const average = Math.floor(sum / filterdArray.length);
    console.log(average);

    if (isNaN(average)) {
        return 0;
    } else {
        return average;
    }
}
