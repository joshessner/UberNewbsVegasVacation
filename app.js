// Countdown Timer for March 16, 2025
const countdownElement = document.getElementById('countdown');
const targetDate = new Date('March 16, 2025 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "Event has passed!";
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);

// Fetch NBA games with Odds API
const apiKey = '2d854c2e73c654efe5ff74c8b59f6738';  // Replace with your API key
const nbaGamesElement = document.getElementById('nba-games');
const favoriteTeamsElement = document.getElementById('favorite-teams');
const favoriteTeams = ['Los Angeles Lakers', 'Memphis Grizzlies', 'Indiana Pacers'];

async function fetchNBAOdds() {
    try {
        const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=spreads&apiKey=${apiKey}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayNBAOdds(data);
        } else {
            nbaGamesElement.innerHTML = "No games available at the moment.";
        }
    } catch (error) {
        console.error("Error fetching NBA games:", error);
        nbaGamesElement.innerHTML = "Failed to load games.";
    }
}

function displayNBAOdds(games) {
    nbaGamesElement.innerHTML = '';
    favoriteTeamsElement.innerHTML = '';
    
    games.forEach(game => {
        const homeTeam = game.home_team;
        const awayTeam = game.away_team;
        const spread = game.bookmakers[0].markets[0].outcomes;

        const gameInfo = `
            <div>
                <strong>${awayTeam} vs ${homeTeam}</strong><br>
                Spread: ${spread[0].name}: ${spread[0].point} | ${spread[1].name}: ${spread[1].point}
            </div>
            <hr>
        `;
        nbaGamesElement.innerHTML += gameInfo;

        if (favoriteTeams.includes(homeTeam) || favoriteTeams.includes(awayTeam)) {
            favoriteTeamsElement.innerHTML += gameInfo;
        }
    });
}

// Initial fetch of NBA odds
fetchNBAOdds();
