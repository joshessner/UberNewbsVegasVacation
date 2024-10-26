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
    // Create grid containers for both sections
    const allGamesHTML = '<div class="games-grid">' + 
        games.map(game => createGameCard(game)).join('') + 
        '</div>';
    
    const favoriteGamesHTML = '<div class="games-grid">' +
        games.filter(game => 
            favoriteTeams.includes(game.home_team) || 
            favoriteTeams.includes(game.away_team)
        ).map(game => createGameCard(game)).join('') +
        '</div>';

    nbaGamesElement.innerHTML = allGamesHTML;
    favoriteTeamsElement.innerHTML = favoriteGamesHTML || 'No games for favorite teams today.';
}

function createGameCard(game) {
    const homeTeam = game.home_team;
    const awayTeam = game.away_team;
    const spread = game.bookmakers[0].markets[0].outcomes;

    return `
        <div class="game-card">
            <strong>${awayTeam} vs ${homeTeam}</strong>
            <div class="spread">
                Spread: ${spread[0].name}: ${spread[0].point} | ${spread[1].name}: ${spread[1].point}
            </div>
        </div>
    `;
}

// Initial fetch of NBA odds
fetchNBAOdds();
