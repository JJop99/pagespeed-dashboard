// hooks
import { useEffect, useRef, useState } from "react";

// react-chartjs-2
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

function LineChart({ dateLabels, analyticsData, fillColor }) {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const chartRef = useRef();

    const labels = dateLabels;
    const options = {
        maintainAspectRatio: true,
        responsive: true,
        scales: {
            x: {
                type: "time",
                time: {
                    // Luxon format string
                    tooltipFormat: "DD/MM/YYYY HH:mm",
                },

                display: false,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                display: true,
                ticks: {
                    display: true,
                    stepSize: 20,
                },
                grid: {
                    display: false,
                },
                beginAtZero: true,
                max: 100,
                min: 0,
            },
            
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    function createGradient(ctx, area) {
        const colorStart = "rgba(255, 255, 255, 0.9)";
        const colorEnd = fillColor;

        const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);

        return gradient;
    }

    // wait for chartRef to access the DOM
    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
            return;
        }

        const data = {
            labels,
            datasets: [
                {
                    data: analyticsData,
                    backgroundColor: createGradient(chart.ctx, chart.chartArea),
                    borderColor: fillColor,
                    fill: true,
                    lineTension: 0.5,
                    pointRadius: 2.5,
                },
            ],
        };

        setChartData(data);
    }, [analyticsData]); // never add labels to the dependencies array (php storm is stupid)
    return <Line ref={chartRef} data={chartData} options={options} />;
}

export default LineChart;
