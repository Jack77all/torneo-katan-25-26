const apiKey = 'AIzaSyATTZnPzPLGBi0kKbj0ZBCAWb-0n5l1pRo';
const spreadsheetId = '1G_nHw8XrB4N0yAA5QoOLSLuIzpmQ_isuaVA-7GrPLMU';
const range = 'TorneoKatan!A1:D150';

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

// Funzione per caricare e mostrare i dati
function loadData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values;
      if(rows && rows.length > 1){
        const header = rows[0];
        let dataRows = rows.slice(1);

        // Ordina per punti (colonna 2, indice 1), decrescente
        dataRows.sort((a, b) => {
          const puntiA = parseInt(a[1]) || 0;
          const puntiB = parseInt(b[1]) || 0;
          return puntiB - puntiA;
        });

        // Tabella classifica dettagliata
        let htmlClassifica = '<h2>Classifica Dettagliata</h2><table border="1" cellpadding="5" cellspacing="0">';
        htmlClassifica += '<tr>';
        header.forEach(cell => {
          htmlClassifica += `<th>${cell}</th>`;
        });
        htmlClassifica += '</tr>';

        dataRows.forEach(row => {
          htmlClassifica += '<tr>';
          row.forEach(cell => {
            htmlClassifica += `<td>${cell}</td>`;
          });
          htmlClassifica += '</tr>';
        });
        htmlClassifica += '</table>';

        document.getElementById('classifica').innerHTML = htmlClassifica;

        // Calcolo totali per giocatore
        const risultati = {};
        dataRows.forEach(row => {
          const nome = row[0];
          const punti = parseInt(row[1]) || 0;
          const vittoria = parseInt(row[2]) || 0;

          if(!risultati[nome]){
            risultati[nome] = { punti: 0, vittorie: 0 };
          }
          risultati[nome].punti += punti;
          risultati[nome].vittorie += vittoria;
        });

        // Tabella riepilogo totali
        let htmlTotali = '<h2>Totali per Giocatore</h2><table border="1" cellpadding="5" cellspacing="0">';
        htmlTotali += '<tr><th>Giocatore</th><th>Punti Totali</th><th>Vittorie Totali</th></tr>';

        for(const nome in risultati){
          htmlTotali += `<tr><td>${nome}</td><td>${risultati[nome].punti}</td><td>${risultati[nome].vittorie}</td></tr>`;
        }

        htmlTotali += '</table>';
        document.getElementById('totali').innerHTML = htmlTotali;

      } else {
        document.getElementById('classifica').innerText = 'Nessun dato trovato';
        document.getElementById('totali').innerText = '';
      }
    })
    .catch(err => {
      console.error('Errore nel recupero dati:', err);
      document.getElementById('classifica').innerText = 'Errore nel caricamento dati';
      document.getElementById('totali').innerText = '';
    });
}

// Al caricamento pagina carica i dati
window.onload = loadData;

// Gestione submit form per inviare dati via POST al Google Apps Script
document.getElementById('resultForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('playerName').value.trim();
  const punti = parseInt(document.getElementById('points').value);
  const dataPartita = document.getElementById('matchDate').value;
  const vittoria = document.getElementById('victory').checked;  // Assicurati che questo checkbox esista

  if (!nome || isNaN(punti) || !dataPartita) {
    alert('Compila tutti i campi correttamente.');
    return;
  }

  fetch('https://script.google.com/macros/s/AKfycbzOMWW0JBhrr5FeRbOK6zWlzA70gB7OURrBoxEj5To2pXaDki0Jqy7qrcvc1gj709OtFg/exec', {   // <-- Qui metti il link al tuo Google Apps Script Web App
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, punti, vittoria, data: dataPartita })
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === 'success') {
      alert('Risultato inserito con successo!');
      this.reset();
      loadData();  // Ricarica dati dopo inserimento
    } else {
      alert('Errore durante l\'invio: ' + data.message);
    }
  })
  .catch(err => {
    alert('Errore di rete: ' + err.message);
  });
});
