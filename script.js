// Risultati iniziali
let results = [
  { name: "Cesare", points: 10, date: "2025-07-10" },
  { name: "Mike", points: 7, date: "2025-07-10" },
  { name: "Willy", points: 5, date: "2025-07-10" },
  { name: "Jack", points: 9, date: "2025-07-09" },
  { name: "Sam", points: 6, date: "2025-07-08" },
  { name: "Cesare", points: 8, date: "2025-07-12" },
  { name: "Mike", points: 6, date: "2025-07-12" }
];

document.getElementById('resultForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('playerName').value.trim();
  const points = parseInt(document.getElementById('points').value);
  const date = document.getElementById('matchDate').value;

  if (name && !isNaN(points) && date) {
    results.push({ name, points, date });
    updateLeaderboard();
    this.reset();
  }
});

function updateLeaderboard() {
  const scores = {};

  results.forEach(({ name, points }) => {
    if (!scores[name]) scores[name] = { total: 0, games: 0 };
    scores[name].total += points;
    scores[name].games += 1;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1].total - a[1].total);

  const tbody = document.getElementById('leaderboard');
  tbody.innerHTML = '';
  sorted.forEach(([name, stats]) => {
    const row = `<tr><td>${name}</td><td>${stats.total}</td><td>${stats.games}</td></tr>`;
    tbody.innerHTML += row;
  });
}

// Carica classifica all’avvio
updateLeaderboard();
