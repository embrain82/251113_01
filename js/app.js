/**
 * Main Application Logic - Multi ETF Comparison
 */

// App State
const appState = {
    etfList: [], // Array to store searched ETF data
    selectedETFs: new Set(), // Set of selected ETF codes for comparison
    currentETF: null // Currently displayed ETF in detail view
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

    console.log('ETF 시세 조회 앱이 시작되었습니다 (다중 비교 모드).');
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
    elements = {
        searchInput1: document.getElementById('etf-code-input-1'),
        searchInput2: document.getElementById('etf-code-input-2'),
        searchInput3: document.getElementById('etf-code-input-3'),
        searchBtns: document.querySelectorAll('.search-btn-small'),
        etfListSection: document.getElementById('etf-list-section'),
        etfCheckboxList: document.getElementById('etf-checkbox-list'),
        etfInfoSection: document.getElementById('etf-info-section'),
        intradaySection: document.getElementById('intraday-section'),
        dailySection: document.getElementById('daily-section'),
        comparisonSection: document.getElementById('comparison-section')
    };
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Search buttons click
    elements.searchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            handleAddETF(index);
        });
    });

    // Enter key in search inputs
    [elements.searchInput1, elements.searchInput2, elements.searchInput3].forEach((input, idx) => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAddETF(idx + 1);
                }
            });
        }
    });
}

/**
 * Handle adding ETF to the list
 */
async function handleAddETF(index) {
    const input = document.getElementById(`etf-code-input-${index}`);
    const code = input.value.trim();

    // Validate input
    const validation = validateETFCode(code);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

    // Check if already added
    if (appState.etfList.find(etf => etf.code === validation.code)) {
        showError('이미 추가된 ETF입니다.');
        return;
    }

    // Check max limit
    if (appState.etfList.length >= 3) {
        showError('최대 3개까지 추가할 수 있습니다.');
        return;
    }

    hideError();

    try {
        showLoading();

        // Fetch ETF data
        const data = await getETFData(validation.code);

        // Add to list
        appState.etfList.push({
            code: validation.code,
            name: data.basicInfo.name,
            currentPrice: data.basicInfo.currentPrice,
            change: data.basicInfo.change,
            changePercent: data.basicInfo.changePercent,
            dailyData: data.dailyData,
            intradayData: data.intradayData,
            fullData: data
        });

        // Auto-select the added ETF
        appState.selectedETFs.add(validation.code);

        // Clear input
        input.value = '';

        // Render list
        renderETFList();

        // Show list section
        showElement('etf-list-section');

        // Update comparison chart
        updateComparisonChart();

        console.log('ETF 추가:', validation.code, data.basicInfo.name);

    } catch (error) {
        console.error('Error adding ETF:', error);
        showError(error.message || 'ETF 정보를 불러오는데 실패했습니다.');
    } finally {
        hideLoading();
    }
}

/**
 * Render ETF checkbox list
 */
function renderETFList() {
    const container = elements.etfCheckboxList;

    if (appState.etfList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">검색된 ETF가 없습니다.</p>';
        return;
    }

    container.innerHTML = appState.etfList.map(etf => {
        const changeFormatted = formatChange(etf.change);
        const percentFormatted = formatPercent(etf.changePercent);
        const isChecked = appState.selectedETFs.has(etf.code);

        return `
            <div class="etf-checkbox-item">
                <input
                    type="checkbox"
                    id="checkbox-${etf.code}"
                    data-code="${etf.code}"
                    ${isChecked ? 'checked' : ''}
                    onchange="handleCheckboxChange('${etf.code}')"
                >
                <div class="etf-checkbox-info">
                    <div>
                        <span class="etf-checkbox-name">${etf.name}</span>
                        <span class="etf-checkbox-code">[${etf.code}]</span>
                    </div>
                    <div>
                        <span class="etf-checkbox-price ${changeFormatted.class}">
                            ${formatPrice(etf.currentPrice)}
                        </span>
                        <span class="${percentFormatted.class}" style="margin-left: 10px; font-size: 0.9rem;">
                            ${percentFormatted.text}
                        </span>
                    </div>
                </div>
                <button class="etf-remove-btn" onclick="removeETF('${etf.code}')">
                    삭제
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Handle checkbox change
 */
function handleCheckboxChange(code) {
    const checkbox = document.getElementById(`checkbox-${code}`);

    if (checkbox.checked) {
        appState.selectedETFs.add(code);
    } else {
        appState.selectedETFs.delete(code);
    }

    console.log('Selected ETFs:', Array.from(appState.selectedETFs));

    // Update comparison chart
    updateComparisonChart();
}

/**
 * Remove ETF from list
 */
function removeETF(code) {
    // Remove from list
    appState.etfList = appState.etfList.filter(etf => etf.code !== code);

    // Remove from selected
    appState.selectedETFs.delete(code);

    // Re-render list
    renderETFList();

    // Update comparison chart
    updateComparisonChart();

    // Hide section if empty
    if (appState.etfList.length === 0) {
        hideElement('etf-list-section');
        hideElement('comparison-section');
    }

    console.log('ETF 삭제:', code);
}

/**
 * Update comparison chart
 */
function updateComparisonChart() {
    const selectedCodes = Array.from(appState.selectedETFs);

    if (selectedCodes.length === 0) {
        hideElement('comparison-section');
        return;
    }

    // Get selected ETF data
    const selectedETFs = appState.etfList.filter(etf =>
        selectedCodes.includes(etf.code)
    );

    // Show comparison section
    showElement('comparison-section');

    // Render comparison chart
    renderComparisonChart(selectedETFs);

    console.log('Comparison chart updated with', selectedETFs.length, 'ETFs');
}

/**
 * Display ETF basic information (legacy - for single ETF view)
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
 * Display intraday price data (legacy - for single ETF view)
 */
function displayIntradayData(data) {
    if (!data || data.length === 0) {
        console.warn('No intraday data to display');
        return;
    }

    // Update time
    document.getElementById('intraday-update').textContent = `업데이트: ${getCurrentTimestamp()}`;

    // Render chart
    renderIntradayChart(data);
    console.log('Intraday chart displayed with', data.length, 'data points');
}

/**
 * Display daily price data (legacy - for single ETF view)
 */
function displayDailyData(data) {
    if (!data || data.length === 0) {
        console.warn('No daily data to display');
        return;
    }

    // Update section header with data count
    const sectionHeader = document.querySelector('#daily-section .section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = `일별 시세 (${data.length}개)`;
    }

    // Render chart
    renderDailyChart(data);
    console.log('Daily chart displayed with', data.length, 'data points');
}

/**
 * Hide all data sections
 */
function hideAllSections() {
    hideElement('etf-info-section');
    hideElement('intraday-section');
    hideElement('daily-section');
    hideElement('comparison-section');
}

/**
 * Show all data sections (legacy)
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
        handleAddETF,
        removeETF,
        handleCheckboxChange,
        updateComparisonChart
    };
}
