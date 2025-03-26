import "./index.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    {
        index: 1,
        volume: 40,
    },
    {
        index: 2,
        volume: 30,
    },
    {
        index: 3,
        volume: 20,
    },
    {
        index: 4,
        volume: 27,
    },
    {
        index: 5,
        volume: 18,
    },
    {
        index: 6,
        volume: 23,
    },
    {
        index: 7,
        volume: 34,
    },
];
export default function ResultGraph({ volumeData = [] }) {
    const dB_array = [20, 30, 40, 20, 30];
    const test = [];
    dB_array.map((element, index) => {
        test.push({ index: index + 1, volume: element });
    });
    console.log(test);
    return (
        <ResponsiveContainer width="90%" height="90%">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
