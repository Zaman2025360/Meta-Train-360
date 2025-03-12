// src/Home.js
import React from 'react';

export const Home = ({ onStartExperience, onLogout, username }) => {
    return (
        <div className="home-container">
            <div className="content">
                <div className="user-welcome">
                    {username && <h2>Welcome, {username}!</h2>}
                    <button className="logout-button" onClick={onLogout}>
                        Logout
                    </button>
                </div>

                <h1>WebXR First Steps</h1>
                <p className="tagline">An immersive WebXR shooting game experience.</p>
                <p className="highlight">Optimized for <strong>Meta Quest</strong> and other VR headsets.</p>

                <div className="features">
                    <div className="feature">
                        <h3>🔹 Immersive VR</h3>
                        <p>Fully interactive 3D environment with smooth controls.</p>
                    </div>
                    <div className="feature">
                        <h3>🎯 Shooting Mechanics</h3>
                        <p>Engaging gameplay with real-time target tracking.</p>
                    </div>
                    <div className="feature">
                        <h3>🏆 Score Tracking</h3>
                        <p>Compete and track your best scores dynamically.</p>
                    </div>
                </div>

                <button className="start-button" onClick={onStartExperience}>
                    🚀 Start Experience
                </button>

                <div className="instructions">
                    <h3>How to Play</h3>
                    <ul>
                        <li>Click "Start Experience" above.</li>
                        <li>Press "Enter VR" on the next screen.</li>
                        <li>Use your controller to aim and shoot targets.</li>
                        <li>Score high and challenge yourself!</li>
                    </ul>
                </div>
            </div>

            <footer>
                <p className="footer-text">© 2025 VR Shooting Experience. All Rights Reserved.</p>
            </footer>


            <style jsx>{`
    /* Main container styling */
    .home-container {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: linear-gradient(to bottom, #1a1a2e, #16213e);
        color: white;
        font-family: Arial, sans-serif;
    }

    /* Centered content */
    .content {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px;
        text-align: center;
    }

    /* User welcome section */
    .user-welcome {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        background: rgba(255, 255, 255, 0.1);
        padding: 15px 20px;
        border-radius: 10px;
    }

    .user-welcome h2 {
        margin: 0;
        color: #4cc9f0;
        font-size: 1.5rem;
    }

    .logout-button {
        background: #e63946;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .logout-button:hover {
        background: #c1121f;
        transform: translateY(-2px);
    }

    /* Headings and text */
    h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        color: #4cc9f0;
    }

    p {
        font-size: 1.2rem;
        margin-bottom: 15px;
        line-height: 1.6;
    }

    /* Features section */
    .features {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap; /* Ensures responsiveness */
        margin-top: 40px;
    }

    /* Feature cards */
    .feature {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        width: 270px; /* Adjusted for consistency */
        text-align: center;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .feature:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }

    .feature h3 {
        color: #4cc9f0;
        margin-bottom: 10px;
        font-size: 1.5rem;
    }

    /* Start Experience button */
    .start-button {
        background: #4361ee;
        color: white;
        border: none;
        padding: 15px 30px;
        font-size: 1.2rem;
        border-radius: 30px;
        cursor: pointer;
        margin: 30px 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
    }

    .start-button:hover {
        background: #3a56d4;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
    }

    /* Instructions section */
    .instructions {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin: 30px auto;
        max-width: 600px;
        text-align: left;
    }

    .instructions h3 {
        text-align: center;
        margin-bottom: 15px;
        color: #4cc9f0;
    }

    .instructions ul {
        margin-left: 20px;
        line-height: 1.8;
    }

    footer {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        text-align: center;
        font-size: 1rem;
        font-weight: 500;
        color: #ffffff;
        letter-spacing: 1px;
        border-top: 2px solid rgba(255, 255, 255, 0.2);
    }

    /* Footer Text */
    .footer-text {
        opacity: 0.8;
    }
    /* Responsive Design */
    @media (max-width: 768px) {
        h1 {
            font-size: 2.2rem;
        }

        /* Stack feature cards vertically on small screens */
        .features {
            flex-direction: column;
            align-items: center;
        }

        .feature {
            width: 90%; /* Adjust width for small screens */
        }
    }
`}</style>

        </div>
    );
};

export default Home;