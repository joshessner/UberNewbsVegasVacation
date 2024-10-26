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

function filterGamesByDate(games) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter games for today
    let filteredGames = games.filter(game => {
        const gameDate = new Date(game.commence_time);
        return gameDate.setHours(0, 0, 0, 0) === today.getTime();
    });

    // If no games today, get the next available day's games
    if (filteredGames.length === 0) {
        const nextGameDate = games.reduce((earliest, game) => {
            const gameDate = new Date(game.commence_time);
            return !earliest || gameDate < earliest ? gameDate : earliest;
        }, null);

        if (nextGameDate) {
            filteredGames = games.filter(game => {
                const gameDate = new Date(game.commence_time);
                return gameDate.setHours(0, 0, 0, 0) === nextGameDate.setHours(0, 0, 0, 0);
            });
        }
    }

    return filteredGames;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const gameDay = new Date(date);
    gameDay.setHours(0, 0, 0, 0);
    
    let dateText;
    if (gameDay.getTime() === today.getTime()) {
        dateText = 'Today';
    } else if (gameDay.getTime() === today.getTime() + 86400000) {
        dateText = 'Tomorrow';
    } else {
        dateText = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    const timeText = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        timeZoneName: 'short' 
    });
    
    return { dateText, timeText };
}

function displayNBAOdds(games) {
    const filteredGames = filterGamesByDate(games);
    
    if (filteredGames.length === 0) {
        nbaGamesElement.innerHTML = "No upcoming games found.";
        favoriteTeamsElement.innerHTML = "No upcoming games for favorite teams.";
        return;
    }

    const gameDate = new Date(filteredGames[0].commence_time);
    const dateHeader = gameDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    });

    // Create grid containers for both sections
    const allGamesHTML = `
        <div class="date-header">${dateHeader}</div>
        <div class="games-grid">
            ${filteredGames.map(game => createGameCard(game)).join('')}
        </div>
    `;
    
    const favoriteGames = filteredGames.filter(game => 
        favoriteTeams.includes(game.home_team) || 
        favoriteTeams.includes(game.away_team)
    );

    const favoriteGamesHTML = favoriteGames.length > 0 ? `
        <div class="date-header">${dateHeader}</div>
        <div class="games-grid">
            ${favoriteGames.map(game => createGameCard(game)).join('')}
        </div>
    ` : 'No games for favorite teams on this day.';

    nbaGamesElement.innerHTML = allGamesHTML;
    favoriteTeamsElement.innerHTML = favoriteGamesHTML;
}

function createGameCard(game) {
    const homeTeam = game.home_team;
    const awayTeam = game.away_team;
    const spread = game.bookmakers[0].markets[0].outcomes;
    const { dateText, timeText } = formatDateTime(game.commence_time);

    return `
        <div class="game-card">
            <div class="game-time">
                <span class="date">${dateText}</span>
                <span class="time">${timeText}</span>
            </div>
            <strong>${awayTeam} vs ${homeTeam}</strong>
            <div class="spread">
                Spread: ${spread[0].name}: ${spread[0].point} | ${spread[1].name}: ${spread[1].point}
            </div>
        </div>
    `;
}

// Initial fetch of NBA odds
fetchNBAOdds();
