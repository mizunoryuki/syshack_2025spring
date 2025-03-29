export function calcMaxVolume(array) {
    if (!array || array.length === 0) return { maxdB: 0, peakTime: 0 };

    let maxdB = -Infinity;
    let peakTime = 0;

    array.forEach((value, index) => {
        if (value > maxdB) {
            maxdB = value;
            peakTime = index + 1;
        }
    });

    return { maxdB, peakTime };
}
