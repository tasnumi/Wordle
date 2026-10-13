import { useNavigate } from 'react-router-dom';
import '../styles/title-screen.css'

function TitleScreen() {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="wordle-header">
                <img src="https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/wordle-icon.svg"></img>
                <h1>Wordle</h1>
                <h2 className="wordle-description">Get 6 chances to guess a 5-letter word.</h2>
                <div className="button-container">
                    <button className="login-button">Log in</button>
                    <button className="play-button" onClick={() => navigate('/gameboard')}>Play</button>
                </div>
            </div>
        </div>
    );
}

export default TitleScreen;