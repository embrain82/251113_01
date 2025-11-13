/**
 * Chart rendering functions using Chart.js
 */

// Chart instances
let intradayChartInstance = null;
let dailyChartInstance = null;

/**
 * Render intraday price chart
 * @param {Array} data - Intraday data
 */
function renderIntradayChart(data) {
    if (!data || data.length === 0) {
        console.warn('No intraday data to render');
        return;
    }

    const canvas = document.getElementById('intraday-chart');
    if (!canvas) {
        console.error('Intraday chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (intradayChartInstance) {
        intradayChartInstance.destroy();
    }

    // Prepare data (reverse to show oldest to newest)
    const reversedData = [...data].reverse();
    const labels = reversedData.map(item => formatTime(item.time));
    const prices = reversedData.map(item => item.price);
    const volumes = reversedData.map(item => item.volume);

    // Determine price trend colors
    const borderColors = reversedData.map((item, index) => {
        if (index === 0) return 'rgba(102, 126, 234, 1)';
        return item.price > reversedData[index - 1].price ?
            'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)';
    });

    // Create chart
    intradayChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '현재가',
                    data: prices,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    yAxisID: 'y',
                },
                {
                    label: '거래량',
                    data: volumes,
                    type: 'bar',
                    backgroundColor: 'rgba(200, 200, 200, 0.5)',
                    borderWidth: 0,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.yAxisID === 'y') {
                                label += formatPrice(context.parsed.y);
                            } else {
                                label += formatNumber(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '시간'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '가격 (원)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '거래량'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });

    console.log('Intraday chart rendered with', data.length, 'data points');
}

/**
 * Render daily price chart (Candlestick-style with line chart)
 * @param {Array} data - Daily data
 */
function renderDailyChart(data) {
    if (!data || data.length === 0) {
        console.warn('No daily data to render');
        return;
    }

    const canvas = document.getElementById('daily-chart');
    if (!canvas) {
        console.error('Daily chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (dailyChartInstance) {
        dailyChartInstance.destroy();
    }

    // Prepare data (reverse to show oldest to newest)
    const reversedData = [...data].reverse();
    const labels = reversedData.map(item => formatDate(item.date));
    const closePrices = reversedData.map(item => item.close);
    const highPrices = reversedData.map(item => item.high);
    const lowPrices = reversedData.map(item => item.low);
    const volumes = reversedData.map(item => item.volume);

    // Determine candle colors
    const candleColors = reversedData.map(item => {
        return item.change >= 0 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 255, 0.8)';
    });

    // Create chart
    dailyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '종가',
                    data: closePrices,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    yAxisID: 'y',
                },
                {
                    label: '고가',
                    data: highPrices,
                    borderColor: 'rgba(255, 0, 0, 0.3)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    yAxisID: 'y',
                },
                {
                    label: '저가',
                    data: lowPrices,
                    borderColor: 'rgba(0, 0, 255, 0.3)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    yAxisID: 'y',
                },
                {
                    label: '거래량',
                    data: volumes,
                    type: 'bar',
                    backgroundColor: candleColors,
                    borderWidth: 0,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.yAxisID === 'y') {
                                label += formatPrice(context.parsed.y);
                            } else {
                                label += formatNumber(context.parsed.y);
                            }
                            return label;
                        },
                        afterLabel: function(context) {
                            const dataIndex = context.dataIndex;
                            const item = reversedData[dataIndex];
                            if (item && context.dataset.label === '종가') {
                                const change = formatChange(item.change);
                                const percent = formatPercent(item.changePercent);
                                return `전일대비: ${change.text} (${percent.text})`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    },
                    ticks: {
                        maxTicksLimit: 15,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '가격 (원)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '거래량'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });

    console.log('Daily chart rendered with', data.length, 'data points');
}

/**
 * Destroy all chart instances
 */
function destroyAllCharts() {
    if (intradayChartInstance) {
        intradayChartInstance.destroy();
        intradayChartInstance = null;
    }
    if (dailyChartInstance) {
        dailyChartInstance.destroy();
        dailyChartInstance = null;
    }
    if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
        comparisonChartInstance = null;
    }
}

/**
 * Render comparison chart for multiple ETFs
 * @param {Array} etfs - Array of ETF objects with dailyData
 */
let comparisonChartInstance = null;

function renderComparisonChart(etfs) {
    if (!etfs || etfs.length === 0) {
        console.warn('No ETF data for comparison');
        return;
    }

    const canvas = document.getElementById('comparison-chart');
    if (!canvas) {
        console.error('Comparison chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
    }

    // Prepare common labels (use dates from first ETF)
    const reversedData = [...etfs[0].dailyData].reverse();
    const labels = reversedData.map(item => formatDate(item.date));

    // Color palette for different ETFs
    const colors = [
        { border: 'rgba(102, 126, 234, 1)', bg: 'rgba(102, 126, 234, 0.1)' },
        { border: 'rgba(255, 99, 132, 1)', bg: 'rgba(255, 99, 132, 0.1)' },
        { border: 'rgba(75, 192, 192, 1)', bg: 'rgba(75, 192, 192, 0.1)' }
    ];

    // Create datasets for each ETF
    const datasets = etfs.map((etf, index) => {
        const reversedDaily = [...etf.dailyData].reverse();
        const closePrices = reversedDaily.map(item => item.close);
        const color = colors[index % colors.length];

        return {
            label: `${etf.name} (${etf.code})`,
            data: closePrices,
            borderColor: color.border,
            backgroundColor: color.bg,
            borderWidth: 2,
            tension: 0.1,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5
        };
    });

    // Create chart
    comparisonChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatPrice(context.parsed.y);

                            // Add change percentage if available
                            const etfIndex = context.datasetIndex;
                            const dataIndex = context.dataIndex;
                            const etf = etfs[etfIndex];
                            if (etf && etf.dailyData) {
                                const reversedDaily = [...etf.dailyData].reverse();
                                const item = reversedDaily[dataIndex];
                                if (item) {
                                    const percent = formatPercent(item.changePercent);
                                    label += ` (${percent.text})`;
                                }
                            }

                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'ETF 일별 시세 비교 (종가 기준)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    },
                    ticks: {
                        maxTicksLimit: 15,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '가격 (원)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });

    console.log('Comparison chart rendered with', etfs.length, 'ETFs');
}
