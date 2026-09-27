/**
 * Komponent for å tegne grafer med Chart.js
 */

let chartInstance = null;

/**
 * Oppretter eller oppdaterer grafen i sidebar.
 *
 * @param {HTMLCanvasElement} canvas - Canvas elementet
 * @param {Array} dataPoints - Array av {x, y} objekter for grafen
 * @param {Object} vertex - Objekt {x, y, type} for topp/bunnpunkt
 * @param {Array} roots - Array av røtter (nullpunkter)
 */
/**
 * Tegner et tomt rutenett (grid) ved oppstart.
 *
 * @param {HTMLCanvasElement} canvas - Canvas elementet
 */
export function renderEmptyGraph(canvas) {
    if (!window.Chart) {
        console.error("Chart.js er ikke lastet ennå.");
        return;
    }

    const style = getComputedStyle(document.body);
    const textColor = style.getPropertyValue('--text-primary').trim() || '#0f172a';
    const gridColor = style.getPropertyValue('--border-color').trim() || '#cbd5e1';

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Tom graf',
                data: [],
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    min: -10,
                    max: 10,
                    grid: { color: gridColor },
                    ticks: { color: textColor, stepSize: 2 }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    min: -10,
                    max: 10,
                    grid: { color: gridColor },
                    ticks: { color: textColor, stepSize: 2 }
                }
            }
        }
    });
}

export function renderGraph(canvas, dataPoints, vertex, roots) {
    if (!window.Chart) {
        console.error("Chart.js er ikke lastet ennå.");
        return;
    }

    // Finn riktige farger fra CSS variabler
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--accent-primary').trim() || '#3b82f6';
    const secondaryColor = style.getPropertyValue('--accent-secondary').trim() || '#10b981';
    const textColor = style.getPropertyValue('--text-primary').trim() || '#0f172a';
    const gridColor = style.getPropertyValue('--border-color').trim() || '#cbd5e1';

    // Datasett for hovedgrafen
    const datasets = [
        {
            label: 'f(x)',
            data: dataPoints,
            borderColor: primaryColor,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            tension: 0.4
        }
    ];

    // Legg til topp/bunnpunkt
    if (vertex) {
        datasets.push({
            label: vertex.type,
            data: [{ x: vertex.x, y: vertex.y }],
            backgroundColor: secondaryColor,
            borderColor: secondaryColor,
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
        });
    }

    // Legg til røtter (nullpunkter)
    if (roots && roots.length > 0) {
        const rootPoints = roots.map(r => ({ x: r, y: 0 }));
        datasets.push({
            label: 'Nullpunkt',
            data: rootPoints,
            backgroundColor: '#ef4444', // Rød farge for nullpunkter
            borderColor: '#ef4444',
            pointRadius: 5,
            pointHoverRadius: 7,
            showLine: false
        });
    }

    if (chartInstance) {
        // Oppdater eksisterende chart
        chartInstance.data.datasets = datasets;
        chartInstance.options.scales.x.grid.color = gridColor;
        chartInstance.options.scales.y.grid.color = gridColor;
        chartInstance.options.scales.x.ticks.color = textColor;
        chartInstance.options.scales.y.ticks.color = textColor;
        chartInstance.update();
    } else {
        // Opprett nytt chart
        chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center',
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        type: 'linear',
                        position: 'center',
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }
}
