import React, { useEffect, useState } from 'react';
import StatsCharts from './StatsCharts';
import ScoreService from './services/ScoreService';
import AuthService from './services/AuthService';
import './styles/StatsDashboard.css'; // We'll create this styling file

const StatsDashboard = () => {
    const [stats, setStats] = useState({
        totalGames: 0,
        highestScore: 0,
        averageScore: 0,
        recentScores: [],
        rank: 'N/A'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const currentUser = AuthService.getCurrentUser();
                if (!currentUser) return;

                // Get personal scores
                const userScores = await ScoreService.getScoresByEmail(currentUser.email);

                // Get all scores for ranking
                const allScores = await ScoreService.getAllScores();

                // Calculate statistics
                const totalGames = userScores.length;

                const highestScore = userScores.length > 0
                    ? Math.max(...userScores.map(score => score.score))
                    : 0;

                const averageScore = userScores.length > 0
                    ? userScores.reduce((sum, score) => sum + score.score, 0) / totalGames
                    : 0;

                // Sort by recent and take last 5
                const recentScores = [...userScores]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 5);

                // Calculate rank
                let rank = 'N/A';
                if (allScores.length > 0 && userScores.length > 0) {
                    const playerIndex = allScores.findIndex(score =>
                        score.email === currentUser.email
                    );

                    if (playerIndex !== -1) {
                        rank = `${playerIndex + 1} of ${allScores.length}`;
                    }
                }

                setStats({
                    totalGames,
                    highestScore,
                    averageScore,
                    recentScores,
                    rank
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="loading">Loading your statistics...</div>;
    }

    return (
        <div className="stats-dashboard">
            <div className="stats-summary">
                <h2>Your Stats Summary</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Games Played</h3>
                        <div className="stat-value">{stats.totalGames}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Highest Score</h3>
                        <div className="stat-value">{stats.highestScore}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Average Score</h3>
                        <div className="stat-value">{stats.averageScore.toFixed(1)}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Rank</h3>
                        <div className="stat-value">{stats.rank}</div>
                    </div>
                </div>
            </div>

            <div className="recent-games">
                <h3>Recent Games</h3>
                <table className="recent-games-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentScores.map((score, index) => (
                            <tr key={index}>
                                <td>{new Date(score.timestamp).toLocaleString()}</td>
                                <td>{score.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="charts-section">
                <h3>Performance Charts</h3>
                <StatsCharts />
            </div>
        </div>
    );
};

export default StatsDashboard;