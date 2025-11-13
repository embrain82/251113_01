/**
 * Utility Functions for ETF Price Viewer
 */

// Format number with commas (thousands separator)
function formatNumber(num) {
    if (num === null || num === undefined || num === '-') {
        return '-';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format price (add currency symbol)
function formatPrice(price) {
    if (price === null || price === undefined || price === '-') {
        return '-';
    }
    return formatNumber(price) + '원';
}

// Format change with sign and color
function formatChange(change) {
    if (change === null || change === undefined || change === 0) {
        return { text: '0', class: 'price-neutral' };
    }

    const sign = change > 0 ? '▲' : '▼';
    const absChange = Math.abs(change);
    const className = change > 0 ? 'price-up' : 'price-down';

    return {
        text: `${sign}${formatNumber(absChange)}`,
        class: className
    };
}

// Format percent with sign and color
function formatPercent(percent) {
    if (percent === null || percent === undefined || percent === 0) {
        return { text: '0.00%', class: 'price-neutral' };
    }

    const sign = percent > 0 ? '+' : '';
    const className = percent > 0 ? 'price-up' : 'price-down';

    return {
        text: `${sign}${percent.toFixed(2)}%`,
        class: className
    };
}

// Format date (YYYY-MM-DD)
function formatDate(dateStr) {
    if (!dateStr) return '-';

    // If already formatted, return as is
    if (dateStr.includes('-')) {
        return dateStr;
    }

    // Convert YYYYMMDD to YYYY-MM-DD
    if (dateStr.length === 8) {
        return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    }

    return dateStr;
}

// Format time (HH:MM:SS)
function formatTime(timeStr) {
    if (!timeStr) return '-';
    return timeStr;
}

// Get current timestamp
function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Show/Hide element
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('search-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Hide error message
function hideError() {
    const errorElement = document.getElementById('search-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Show loading spinner
function showLoading() {
    showElement('loading-spinner');
}

// Hide loading spinner
function hideLoading() {
    hideElement('loading-spinner');
}

// Validate ETF code (basic validation)
function validateETFCode(code) {
    if (!code || code.trim() === '') {
        return { valid: false, message: '종목코드를 입력해주세요.' };
    }

    // Remove whitespace
    code = code.trim();

    // Check if it's numeric (for Korean ETF codes)
    if (!/^\d+$/.test(code)) {
        return { valid: false, message: '올바른 종목코드를 입력해주세요. (숫자만 입력)' };
    }

    // Check length (typically 6 digits)
    if (code.length !== 6) {
        return { valid: false, message: '종목코드는 6자리 숫자여야 합니다.' };
    }

    return { valid: true, code: code };
}

// Debounce function (for performance optimization)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatPrice,
        formatChange,
        formatPercent,
        formatDate,
        formatTime,
        getCurrentTimestamp,
        showElement,
        hideElement,
        showError,
        hideError,
        showLoading,
        hideLoading,
        validateETFCode,
        debounce
    };
}
