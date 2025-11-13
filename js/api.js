/**
 * API Functions for ETF Data
 */

// API Configuration
const API_CONFIG = {
    useMockData: true, // Set to false when using real API
    mockDataPath: 'data/mock-data.json',
    apiBaseUrl: '/api', // For Vercel serverless functions
    timeout: 10000 // 10 seconds
};

// Cache for mock data
let mockDataCache = null;

/**
 * Load mock data from JSON file
 */
async function loadMockData() {
    if (mockDataCache) {
        return mockDataCache;
    }

    try {
        const response = await fetch(API_CONFIG.mockDataPath);
        if (!response.ok) {
            throw new Error('Failed to load mock data');
        }
        mockDataCache = await response.json();
        return mockDataCache;
    } catch (error) {
        console.error('Error loading mock data:', error);
        throw new Error('Mock 데이터를 불러오는데 실패했습니다.');
    }
}

/**
 * Get ETF basic information
 * @param {string} code - ETF code
 * @returns {Promise<Object>} ETF basic info
 */
async function getETFBasicInfo(code) {
    if (API_CONFIG.useMockData) {
        const mockData = await loadMockData();
        if (!mockData[code]) {
            throw new Error('해당 종목코드를 찾을 수 없습니다. (152100, 102110, 091160 중 하나를 입력해주세요)');
        }
        return mockData[code].basicInfo;
    }

    // Real API call (to be implemented)
    try {
        const response = await fetch(`${API_CONFIG.apiBaseUrl}/etf?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'ETF 정보를 가져오는데 실패했습니다.');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching ETF basic info:', error);
        throw new Error('ETF 정보를 가져오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
    }
}

/**
 * Get intraday price data
 * @param {string} code - ETF code
 * @returns {Promise<Array>} Intraday price data
 */
async function getIntradayData(code) {
    if (API_CONFIG.useMockData) {
        const mockData = await loadMockData();
        if (!mockData[code]) {
            throw new Error('해당 종목코드를 찾을 수 없습니다.');
        }
        return mockData[code].intradayData || [];
    }

    // Real API call (to be implemented)
    try {
        const response = await fetch(`${API_CONFIG.apiBaseUrl}/etf/intraday?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || '시간대별 시세를 가져오는데 실패했습니다.');
        }

        return data.data || [];
    } catch (error) {
        console.error('Error fetching intraday data:', error);
        throw new Error('시간대별 시세를 가져오는데 실패했습니다.');
    }
}

/**
 * Get daily price data
 * @param {string} code - ETF code
 * @param {string} period - Period (1m, 3m, 6m, 1y)
 * @returns {Promise<Array>} Daily price data
 */
async function getDailyData(code, period = '1m') {
    if (API_CONFIG.useMockData) {
        const mockData = await loadMockData();
        if (!mockData[code]) {
            throw new Error('해당 종목코드를 찾을 수 없습니다.');
        }

        let data = mockData[code].dailyData || [];

        // Generate more data if needed
        if (data.length < 365) {
            data = generateExtendedDailyData(data, code);
        }

        // Filter by period
        const periodDays = {
            '1m': 30,
            '3m': 90,
            '6m': 180,
            '1y': 365
        };

        const days = periodDays[period] || 30;
        return data.slice(0, Math.min(days, data.length));
    }

    // Real API call (to be implemented)
    try {
        const response = await fetch(
            `${API_CONFIG.apiBaseUrl}/etf/daily?code=${code}&period=${period}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || '일별 시세를 가져오는데 실패했습니다.');
        }

        return data.data || [];
    } catch (error) {
        console.error('Error fetching daily data:', error);
        throw new Error('일별 시세를 가져오는데 실패했습니다.');
    }
}

/**
 * Generate extended daily data for testing
 * @param {Array} baseData - Base daily data
 * @param {string} code - ETF code
 * @returns {Array} Extended daily data
 */
function generateExtendedDailyData(baseData, code) {
    if (!baseData || baseData.length === 0) {
        return [];
    }

    const extended = [...baseData];
    const lastItem = baseData[baseData.length - 1];
    const lastDate = new Date(lastItem.date);
    let currentPrice = lastItem.close;

    // Generate data for up to 365 days
    for (let i = baseData.length; i < 365; i++) {
        lastDate.setDate(lastDate.getDate() - 1);

        // Skip weekends
        if (lastDate.getDay() === 0 || lastDate.getDay() === 6) {
            continue;
        }

        // Random price change (-2% to +2%)
        const changePercent = (Math.random() - 0.5) * 4;
        const change = Math.round(currentPrice * changePercent / 100);
        const close = currentPrice;
        const open = close - change;
        const high = Math.max(open, close) + Math.round(Math.random() * 100);
        const low = Math.min(open, close) - Math.round(Math.random() * 100);
        const volume = Math.round(500000 + Math.random() * 2000000);

        extended.push({
            date: lastDate.toISOString().split('T')[0],
            close: close,
            change: change,
            changePercent: parseFloat(changePercent.toFixed(2)),
            open: open,
            high: high,
            low: low,
            volume: volume
        });

        currentPrice = open;
    }

    return extended;
}

/**
 * Get all ETF data at once
 * @param {string} code - ETF code
 * @returns {Promise<Object>} All ETF data
 */
async function getETFData(code) {
    try {
        const [basicInfo, intradayData, dailyData] = await Promise.all([
            getETFBasicInfo(code),
            getIntradayData(code),
            getDailyData(code)
        ]);

        return {
            basicInfo,
            intradayData,
            dailyData
        };
    } catch (error) {
        console.error('Error fetching ETF data:', error);
        throw error;
    }
}

// Export functions (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        loadMockData,
        getETFBasicInfo,
        getIntradayData,
        getDailyData,
        getETFData
    };
}
