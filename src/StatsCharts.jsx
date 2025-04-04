import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ScoreService from './services/ScoreService';
import AuthService from './services/AuthService';

const StatsCharts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartsData, setChartsData] = useState({
        personalScores: [],
        leaderboardScores: []
    });
    const personalScoreChartRef = useRef(null);
    const leaderboardChartRef = useRef(null);
    const personalChartInstance = useRef(null);
    const leaderboardChartInstance = useRef(null);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const currentUser = AuthService.getCurrentUser();
                if (!currentUser) {
                    setIsLoading(false);
                    return;
                }

                // Fetch personal scores
                const userScores = await ScoreService.getScoresByEmail(currentUser.email);

                // Fetch leaderboard scores
                const allScores = await ScoreService.getAllScores();

                setChartsData({
                    personalScores: userScores,
                    leaderboardScores: allScores
                });
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Clean up charts when component unmounts
        return () => {
            if (personalChartInstance.current) {
                personalChartInstance.current.destroy();
            }
            if (leaderboardChartInstance.current) {
                leaderboardChartInstance.current.destroy();
            }
        };
    }, []);

    // Create charts after data is loaded and DOM is ready
    useEffect(() => {
        if (!isLoading && personalScoreChartRef.current && leaderboardChartRef.current) {
            renderPersonalChart();
            renderLeaderboardChart();
        }
    }, [isLoading, chartsData]);

    const renderPersonalChart = () => {
        const { personalScores } = chartsData;
        if (!personalScoreChartRef.current || personalScores.length === 0) return;

        // Sort scores by timestamp
        const sortedScores = [...personalScores].sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Format dates for display
        const labels = sortedScores.map(score =>
            new Date(score.timestamp).toLocaleDateString()
        );
        const data = sortedScores.map(score => score.score);

        // Calculate moving average for trend line
        const movingAverage = calculateMovingAverage(data, Math.min(3, data.length));

        // Destroy previous chart if it exists
        if (personalChartInstance.current) {
            personalChartInstance.current.destroy();
        }

        const ctx = personalScoreChartRef.current.getContext('2d');
        personalChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Score',
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                        pointRadius: 5,
                    },
                    {
                        label: 'Trend (3-game average)',
                        data: movingAverage,
                        borderColor: 'rgba(255, 99, 132, 0.8)',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Your Score Progress'
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function (context) {
                                const score = context.raw;
                                const date = new Date(sortedScores[context.dataIndex].timestamp);
                                return `Date: ${date.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Game Date'
                        }
                    }
                }
            }
        });
    };

    const renderLeaderboardChart = () => {
        const { leaderboardScores } = chartsData;
        if (!leaderboardChartRef.current || leaderboardScores.length === 0) return;

        // Take top 10 scores
        const topScores = [...leaderboardScores].slice(0, 10);

        // Destroy previous chart if it exists
        if (leaderboardChartInstance.current) {
            leaderboardChartInstance.current.destroy();
        }

        const ctx = leaderboardChartRef.current.getContext('2d');
        leaderboardChartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topScores.map(score => {
                    // Handle potential undefined emails gracefully
                    return score.email ? score.email.split('@')[0] : 'Unknown';
                }),
                datasets: [{
                    label: 'Top Scores',
                    data: topScores.map(score => score.score),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Leaderboard'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Player'
                        }
                    }
                }
            }
        });
    };

    // Utility function to calculate moving average
    const calculateMovingAverage = (data, window) => {
        if (data.length < window) {
            // If we don't have enough data points, return the data as is
            return data;
        }

        const result = [];

        // Fill initial values with null for proper alignment
        for (let i = 0; i < window - 1; i++) {
            result.push(null);
        }

        for (let i = 0; i <= data.length - window; i++) {
            const windowSlice = data.slice(i, i + window);
            const average = windowSlice.reduce((sum, val) => sum + val, 0) / window;
            result.push(average);
        }

        return result;
    };

    if (isLoading) {
        return <div>Loading chart data...</div>;
    }

    // Add a message if no data is available
    if (chartsData.personalScores.length === 0) {
        return <div>No game data available. Play some games to see your statistics!</div>;
    }

    return (
        <div className="stats-charts">
            <div className="chart-container" style={{ height: '300px', marginBottom: '20px' }}>
                <canvas ref={personalScoreChartRef} />
            </div>
            <div className="chart-container" style={{ height: '300px' }}>
                <canvas ref={leaderboardChartRef} />
            </div>
        </div>
    );
};

export default StatsCharts;