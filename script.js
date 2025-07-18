const sheetURL = "https://script.google.com/macros/s/AKfycbzA7PLEXs2L7rWJSypt0AxsjS2m1PkGDHY5UkszLYnp4U9_VNP-UNahjoax71LK5pJCzg/exec";

document.getElementById('resultForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('playerName').value.trim();
  const points = parseInt(document.getElementById('points').value);
  const date = document.getElementById('matchDate').value;

  fetch(sheetURL, {
    method: "POST",
    body: JSON.stringify({ name, points, date }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(response => {
    alert("Risultato salvato!");
    document.getElementById('resultForm').reset();
  })
  .catch(error => {
    console.error("Errore:", error);
    alert("Errore nel salvataggio!");
  });
});
