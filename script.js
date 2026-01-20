// script.js

document.getElementById('incomeForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const netIncomeInput = document.getElementById('netIncome');
    const netIncome = parseFloat(netIncomeInput.value);
  
    if (isNaN(netIncome) || netIncome <= 0) {
      alert('Bitte geben Sie ein gültiges Nettoeinkommen ein.');
      resetResults();
      return;
    }
  
    calculateDistribution(netIncome);
});
  
function calculateDistribution(netIncome) {
  // Berechnung basierend auf dem aktuellen Sparanteil
  const sparen = netIncome * 0.2;
  const haushalt = netIncome * 0.5;
  const ausgeben = netIncome * 0.3;

  // Ergebnisse anzeigen
  document.getElementById('haushaltAmount').textContent = haushalt.toFixed(2);
  document.getElementById('ausgebenAmount').textContent = ausgeben.toFixed(2);
  document.getElementById('sparenAmount').textContent = sparen.toFixed(2);

  // Investitionsberechnung mit monatlicher Sparrate durchführen
  const monthlySavings = sparen;
  const yearlySavings = monthlySavings * 12;
  calculateInvestment(yearlySavings);
}

function resetResults() {
  document.getElementById('haushaltAmount').textContent = '0,00';
  document.getElementById('ausgebenAmount').textContent = '0,00';
  document.getElementById('sparenAmount').textContent = '0,00';
  calculateInvestment(0);
}

let investmentChart = null;

function calculateInvestment(yearlySavings) {
  const monthlySavings = yearlySavings / 12;
  const returnRate = parseFloat(document.getElementById('returnRate').value) / 100;
  const years = parseInt(document.getElementById('years').value);

  // Monatliche und jährliche Sparrate anzeigen
  document.getElementById('monthlySavings').textContent = monthlySavings.toFixed(2);
  document.getElementById('yearlySavings').textContent = yearlySavings.toFixed(2);

  // Gesamteinzahlung berechnen
  const totalContribution = yearlySavings * years;
  document.getElementById('totalContribution').textContent = totalContribution.toFixed(2);

  // Endkapital berechnen (mit monatlicher Verzinsung)
  const monthlyRate = returnRate / 12;
  const months = years * 12;
  let finalAmount = 0;

  // Arrays für den Graphen
  const labels = [];
  const investmentData = [];
  const contributionData = [];

  // Jährliche Werte berechnen für den Graphen
  for (let year = 0; year <= years; year++) {
    labels.push(year);
    contributionData.push(year * yearlySavings);
    
    // Kapital am Ende des Jahres berechnen
    let yearlyAmount = 0;
    for (let month = 0; month < year * 12; month++) {
      yearlyAmount += monthlySavings;
      yearlyAmount *= (1 + monthlyRate);
    }
    investmentData.push(yearlyAmount);
  }

  // Endwerte berechnen und anzeigen
  finalAmount = investmentData[investmentData.length - 1];
  document.getElementById('finalAmount').textContent = finalAmount.toFixed(2);
  document.getElementById('totalReturn').textContent = (finalAmount - totalContribution).toFixed(2);

  // Graph aktualisieren
  updateChart(labels, contributionData, investmentData);
}

function updateChart(labels, contributionData, investmentData) {
  const ctx = document.getElementById('investmentChart').getContext('2d');
  
  if (investmentChart) {
    investmentChart.destroy();
  }

  investmentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Vermögen mit Zinsen',
          data: investmentData,
          borderColor: '#0066cc',
          backgroundColor: 'rgba(0, 102, 204, 0.1)',
          fill: true
        },
        {
          label: 'Einzahlungen',
          data: contributionData,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + ' €';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Jahre'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + 
                     context.parsed.y.toLocaleString() + ' €';
            }
          }
        }
      }
    }
  });
}

// Event Listener für Änderungen an Rendite und Jahren
document.getElementById('returnRate').addEventListener('input', function() {
  const netIncomeInput = document.getElementById('netIncome');
  if (netIncomeInput.value) {
    calculateDistribution(parseFloat(netIncomeInput.value));
  }
});

document.getElementById('years').addEventListener('input', function() {
  const netIncomeInput = document.getElementById('netIncome');
  if (netIncomeInput.value) {
    calculateDistribution(parseFloat(netIncomeInput.value));
  }
});

document.getElementById('netIncome').addEventListener('input', function(event) {
  const netIncome = parseFloat(event.target.value);
  if (isNaN(netIncome) || netIncome <= 0) {
    resetResults();
    return;
  }

  calculateDistribution(netIncome);
});
