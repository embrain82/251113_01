/**
 * Main Application Logic
 */

// App State
const appState = {
    currentETF: null,
    currentPeriod: '1m'
};

// DOM Elements
let elements = {};

/**
 * Initialize the application
 */
function initApp() {
    // Cache DOM elements
    cacheElements();

    // Attach event listeners
    attachEventListeners();

    // Initial state
    hideAllSections();

    console.log('ETF 시세 조회 앱이 시작되었습니다.');
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
    elements = {
        searchInput: document.getElementById('etf-code-input'),
        searchBtn: document.getElementById('search-btn'),
        etfInfoSection: document.getElementById('etf-info-section'),
        intradaySection: document.getElementById('intraday-section'),
        dailySection: document.getElementById('daily-section'),
        periodBtns: document.querySelectorAll('.period-btn')
    };
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Search button click
    elements.searchBtn.addEventListener('click', handleSearch);

    // Enter key in search input
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Period buttons
    elements.periodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            handlePeriodChange(e.target.dataset.period);
        });
    });
}

/**
 * Handle search action
 */
async function handleSearch() {
    const code = elements.searchInput.value;

    // Validate input
    const validation = validateETFCode(code);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

    hideError();

    // Load ETF data
    await loadETFData(validation.code);
}

/**
 * Load ETF data and display
 */
async function loadETFData(code) {
    try {
        showLoading();
        hideAllSections();

        // Fetch data
        const data = await getETFData(code);

        // Store current ETF
        appState.currentETF = code;

        // Display data
        displayBasicInfo(data.basicInfo);
        displayIntradayData(data.intradayData);
        displayDailyData(data.dailyData);

        // Show sections
        showAllSections();

    } catch (error) {
        console.error('Error loading ETF data:', error);
        showError(error.message || 'ETF 정보를 불러오는데 실패했습니다.');
    } finally {
        hideLoading();
    }
}

/**
 * Display ETF basic information
 */
function displayBasicInfo(info) {
    if (!info) return;

    // Set values
    document.getElementById('etf-name').textContent = info.name;
    document.getElementById('etf-code').textContent = info.code;
    document.getElementById('current-price').textContent = formatPrice(info.currentPrice);

    // Format and set change
    const changeFormatted = formatChange(info.change);
    const changeElement = document.getElementById('price-change');
    changeElement.textContent = changeFormatted.text;
    changeElement.className = `info-value ${changeFormatted.class}`;

    // Format and set percent
    const percentFormatted = formatPercent(info.changePercent);
    const percentElement = document.getElementById('change-percent');
    percentElement.textContent = percentFormatted.text;
    percentElement.className = `info-value ${percentFormatted.class}`;

    // Set price color
    const priceElement = document.getElementById('current-price');
    priceElement.className = `info-value price-large ${changeFormatted.class}`;

    // Set other values
    document.getElementById('open-price').textContent = formatPrice(info.open);
    document.getElementById('high-price').textContent = formatPrice(info.high);
    document.getElementById('low-price').textContent = formatPrice(info.low);
    document.getElementById('volume').textContent = formatNumber(info.volume);
}

/**
 * Display intraday price data
 */
function displayIntradayData(data) {
    const tbody = document.getElementById('intraday-tbody');

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">시간대별 시세 데이터가 없습니다.</td></tr>';
        return;
    }

    // Update time
    document.getElementById('intraday-update').textContent = `업데이트: ${getCurrentTimestamp()}`;

    // Generate rows
    const rows = data.map(item => {
        const changeFormatted = formatChange(item.change);
        const percentFormatted = formatPercent(item.changePercent);

        return `
            <tr>
                <td>${formatTime(item.time)}</td>
                <td class="${changeFormatted.class}">${formatPrice(item.price)}</td>
                <td class="${changeFormatted.class}">${changeFormatted.text}</td>
                <td class="${percentFormatted.class}">${percentFormatted.text}</td>
                <td>${formatNumber(item.volume)}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

/**
 * Display daily price data
 */
function displayDailyData(data) {
    const tbody = document.getElementById('daily-tbody');

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">일별 시세 데이터가 없습니다.</td></tr>';
        return;
    }

    // Generate rows
    const rows = data.map(item => {
        const changeFormatted = formatChange(item.change);
        const percentFormatted = formatPercent(item.changePercent);

        return `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td class="${changeFormatted.class}">${formatPrice(item.close)}</td>
                <td class="${changeFormatted.class}">${changeFormatted.text}</td>
                <td class="${percentFormatted.class}">${percentFormatted.text}</td>
                <td>${formatPrice(item.open)}</td>
                <td>${formatPrice(item.high)}</td>
                <td>${formatPrice(item.low)}</td>
                <td>${formatNumber(item.volume)}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

/**
 * Handle period change
 */
async function handlePeriodChange(period) {
    if (!appState.currentETF) return;

    // Update active button
    elements.periodBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });

    // Update state
    appState.currentPeriod = period;

    // Reload daily data
    try {
        showLoading();
        const dailyData = await getDailyData(appState.currentETF, period);
        displayDailyData(dailyData);
    } catch (error) {
        console.error('Error loading daily data:', error);
        showError('일별 시세를 불러오는데 실패했습니다.');
    } finally {
        hideLoading();
    }
}

/**
 * Hide all data sections
 */
function hideAllSections() {
    hideElement('etf-info-section');
    hideElement('intraday-section');
    hideElement('daily-section');
}

/**
 * Show all data sections
 */
function showAllSections() {
    showElement('etf-info-section');
    showElement('intraday-section');
    showElement('daily-section');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        handleSearch,
        loadETFData,
        displayBasicInfo,
        displayIntradayData,
        displayDailyData,
        handlePeriodChange
    };
}
