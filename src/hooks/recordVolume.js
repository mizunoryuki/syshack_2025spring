import { useState, useRef } from "react";
export default function useRecordVolume() {
    const [showdB, setshowdB] = useState(0);
    //const showdB = useRef(0);
    const avgdBArray = useRef([]);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const baselineVolumeRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.5;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            mediaStreamRef.current = stream;

            await measureBaselineVolume(analyser); // 基準音量を取得
            updateVolume();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        console.log("録音を終了");
    };

    const measureBaselineVolume = async (analyser) => {
        return new Promise((resolve) => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            let totalVolume = 0;
            let count = 0;
            const sampleDuration = 5000; // サンプリング
            const startTime = performance.now();

            const collectData = () => {
                if (performance.now() - startTime < sampleDuration) {
                    analyser.getByteFrequencyData(dataArray);
                    const sum = dataArray.reduce((a, b) => a + b, 0);
                    totalVolume += sum / dataArray.length;
                    count++;
                    requestAnimationFrame(collectData);
                } else {
                    baselineVolumeRef.current = totalVolume / count;
                    //console.log("Baseline Volume:", baselineVolumeRef.current);
                    resolve();
                }
            };
            collectData();
        });
    };

    const updateVolume = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const getVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const avgRaw =
                dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            //console.log("整形前:", avgRaw); // フィルタリング前の生データ

            const adjustedVolume = baselineVolumeRef.current
                ? avgRaw - baselineVolumeRef.current
                : avgRaw;
            const dB =
                adjustedVolume > 1
                    ? Math.ceil(20 * Math.log10(adjustedVolume))
                    : 0;

            //console.log("整形後:", dB);
            avgdBArray.current.push(dB);
            setshowdB(dB);
            //showdB.current = dB;

            animationFrameIdRef.current = requestAnimationFrame(getVolume);
        };

        getVolume();
    };

    return { avgdBArray, showdB, startRecording, stopRecording };
}
