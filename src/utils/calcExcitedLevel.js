export function calcExcitedLevel(array) {
    const sum = array.reduce((acc, item) => acc + item, 0);
    const filterdArray = array.filter((item) => item !== 0);
    const level = Math.floor(sum / filterdArray.length);
    return level;
}
