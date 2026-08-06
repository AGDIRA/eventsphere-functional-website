// Chart.js Dashboard Preview Integration for EventSphere
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js CDN not loaded yet.');
    return;
  }

  // Set Chart.js Defaults
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = '#6B7280';

  // 1. Line Chart: Attendee Velocity
  const lineCtx = document.getElementById('registrationChart');
  let registrationChart = null;

  if (lineCtx) {
    const lineGradient = lineCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    lineGradient.addColorStop(0, 'rgba(0, 102, 255, 0.35)');
    lineGradient.addColorStop(1, 'rgba(0, 102, 255, 0.0)');

    const tealGradient = lineCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    tealGradient.addColorStop(0, 'rgba(0, 168, 150, 0.35)');
    tealGradient.addColorStop(1, 'rgba(0, 168, 150, 0.0)');

    const chartData = {
      '24h': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        registrations: [15, 30, 85, 240, 310, 195, 80],
        checkins: [10, 20, 60, 180, 290, 150, 45]
      },
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        registrations: [450, 720, 890, 1200, 1540, 1890, 2100],
        checkins: [380, 610, 810, 1050, 1420, 1750, 1980]
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        registrations: [2800, 5400, 8900, 12400],
        checkins: [2400, 4900, 8100, 11800]
      }
    };

    registrationChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: chartData['7d'].labels,
        datasets: [
          {
            label: 'Registrations',
            data: chartData['7d'].registrations,
            borderColor: '#0066FF',
            borderWidth: 3,
            backgroundColor: lineGradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0066FF',
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: 'Check-ins',
            data: chartData['7d'].checkins,
            borderColor: '#00A896',
            borderWidth: 3,
            backgroundColor: tealGradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00A896',
            pointRadius: 4,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Syne', size: 14 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7280' }
          },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: { color: '#6B7280' }
          }
        }
      }
    });

    // Timeframe toggle handlers
    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    timeframeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        timeframeBtns.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-600');
        });
        btn.classList.remove('bg-slate-100', 'text-slate-600');
        btn.classList.add('bg-blue-600', 'text-white');

        const period = btn.dataset.period;
        if (chartData[period]) {
          registrationChart.data.labels = chartData[period].labels;
          registrationChart.data.datasets[0].data = chartData[period].registrations;
          registrationChart.data.datasets[1].data = chartData[period].checkins;
          registrationChart.update();
        }
      });
    });
  }

  // 2. Doughnut Chart: Ticket Distribution
  const doughnutCtx = document.getElementById('ticketDistChart');
  if (doughnutCtx) {
    new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['VIP All-Access', 'Tech Keynote', 'General Pass', 'Executive Dinner'],
        datasets: [{
          data: [35, 40, 15, 10],
          backgroundColor: [
            '#7C3AED',
            '#0066FF',
            '#00A896',
            '#FF6B6B'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { size: 12, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 10,
            cornerRadius: 8
          }
        }
      }
    });
  }

  // 3. Donut & Line Charts for Module 5 Bulk Invitation Sender Page
  const statusCtx = document.getElementById('dispatchStatusChart');
  const velocityCtx = document.getElementById('dispatchVelocityChart');

  let statusChart = null;
  let velocityChart = null;

  if (statusCtx) {
    statusChart = new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Delivered (Success)', 'Pending Queue', 'Failed / Retried'],
        datasets: [{
          data: [0, 5, 0],
          backgroundColor: ['#00A896', '#0066FF', '#FF6B6B'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Syne', size: 13 },
            padding: 10,
            cornerRadius: 8
          }
        }
      }
    });
  }

  if (velocityCtx) {
    const vGrad = velocityCtx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    vGrad.addColorStop(0, 'rgba(0, 168, 150, 0.35)');
    vGrad.addColorStop(1, 'rgba(0, 168, 150, 0.0)');

    velocityChart = new Chart(velocityCtx, {
      type: 'line',
      data: {
        labels: ['Batch Start', '0.5s', '1.0s', '1.5s', '2.0s', '2.5s', 'Current'],
        datasets: [{
          label: 'Delivery Speed (ms/email)',
          data: [0, 420, 380, 510, 450, 410, 390],
          borderColor: '#00A896',
          borderWidth: 2.5,
          backgroundColor: vGrad,
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  // Helper window function to update telemetry charts live from email.js
  window.updateDispatchTelemetryCharts = function(successCount, pendingCount, failedCount) {
    if (statusChart) {
      statusChart.data.datasets[0].data = [successCount, pendingCount, failedCount];
      statusChart.update();
    }
    const chartDel = document.getElementById('chart-stat-delivered');
    const chartPen = document.getElementById('chart-stat-pending');
    const chartFai = document.getElementById('chart-stat-failed');

    if (chartDel) chartDel.textContent = successCount;
    if (chartPen) chartPen.textContent = pendingCount;
    if (chartFai) chartFai.textContent = failedCount;
  };
});

