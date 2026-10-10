# 🎈 Balloon Pop Game

A fun and colorful balloon popping game built with vanilla HTML, CSS, and JavaScript.

## Features

- **Pop balloons** by clicking/tapping them as they float up the screen
- **Lives system**: Start with 3 lives - lose one each time a balloon escapes
- **Progressive difficulty**: Balloon speed and spawn rate increase with your score
- **High score leaderboard**: Top 5 scores are saved locally with player initials
- **Sound effects**: Generated using Web Audio API (can be muted)
- **Pause functionality**: Pause/resume the game at any time
- **Responsive design**: Works on desktop and mobile devices (~375px+)
- **Auto-pause**: Game pauses when tab is hidden

## How to Play

1. Click **PLAY** to start the game
2. Click or tap balloons to pop them and score points
3. Don't let balloons escape off the top - you'll lose a life!
4. Game ends when all 3 lives are lost
5. Enter your 3-letter initials if you make the top 5
6. Click **Play Again** to start a new game

## Leaderboard

- Top 5 high scores are stored in browser localStorage
- Scores persist across sessions
- Qualifying scores (top 5 and > 0) prompt for 3 letters (initials)
- New high scores are highlighted in gold
- Corrupt data is handled gracefully without crashes

## Technical Details

- Pure vanilla JavaScript (no frameworks)
- Web Audio API for sound generation
- localStorage for persistent high scores
- Pointer Events API for cross-device compatibility
- Smooth animations using requestAnimationFrame

## Files

- `index.html` - Game structure and layout
- `game.js` - Game logic and mechanics
- `style.css` - Styling and animations

## Browser Compatibility

Works in all modern browsers that support:
- Web Audio API
- localStorage
- Pointer Events
- ES6+ JavaScript
