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

        // Get data by period and aggregate accordingly
        console.log(`Processing period: ${period}, Total data available: ${data.length}`);
        let resultData;
        switch (period) {
            case '1m':
                // 1개월: 일별 데이터 30일
                resultData = data.slice(0, 30);
                console.log(`1m: Returning ${resultData.length} daily records`);
                break;
            case '3m':
                // 3개월: 주간 데이터 (7일 단위 집계)
                const data3m = data.slice(0, 90);
                console.log(`3m: Aggregating ${data3m.length} days into weekly data`);
                resultData = aggregateDataByInterval(data3m, 7);
                break;
            case '6m':
                // 6개월: 2주간 데이터 (14일 단위 집계)
                const data6m = data.slice(0, 180);
                console.log(`6m: Aggregating ${data6m.length} days into bi-weekly data`);
                resultData = aggregateDataByInterval(data6m, 14);
                break;
            case '1y':
                // 1년: 월간 데이터 (30일 단위 집계)
                const data1y = data.slice(0, 365);
                console.log(`1y: Aggregating ${data1y.length} days into monthly data`);
                resultData = aggregateDataByInterval(data1y, 30);
                break;
            default:
                resultData = data.slice(0, 30);
                console.log(`Default: Returning ${resultData.length} daily records`);
        }

        console.log(`Final result for ${period}: ${resultData.length} items`);
        return resultData;
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
 * Aggregate data by interval (weekly, bi-weekly, monthly)
 * @param {Array} data - Daily data array
 * @param {number} intervalDays - Number of days to aggregate (7, 14, 30)
 * @returns {Array} Aggregated data
 */
function aggregateDataByInterval(data, intervalDays) {
    if (!data || data.length === 0) {
        console.warn('No data to aggregate');
        return [];
    }

    console.log(`Aggregating ${data.length} days into ${intervalDays}-day intervals`);
    const aggregated = [];

    for (let i = 0; i < data.length; i += intervalDays) {
        const chunk = data.slice(i, i + intervalDays);

        if (chunk.length === 0) continue;

        // 첫날 (가장 최근 날짜)
        const firstDay = chunk[0];
        // 마지막날 (가장 오래된 날짜)
        const lastDay = chunk[chunk.length - 1];

        // 집계 데이터 계산
        const aggregatedItem = {
            date: firstDay.date, // 기간의 마지막 날짜 (가장 최근)
            close: firstDay.close, // 종가: 기간의 마지막 종가
            open: lastDay.open, // 시가: 기간의 첫 시가
            high: Math.max(...chunk.map(d => d.high)), // 고가: 기간 중 최고가
            low: Math.min(...chunk.map(d => d.low)), // 저가: 기간 중 최저가
            volume: chunk.reduce((sum, d) => sum + d.volume, 0), // 거래량: 합계
            change: firstDay.close - lastDay.open, // 전일대비: 종가 - 시가
            changePercent: ((firstDay.close - lastDay.open) / lastDay.open * 100)
        };

        aggregated.push(aggregatedItem);
    }

    console.log(`Aggregated result: ${aggregated.length} items`);
    return aggregated;
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

    // Generate data until we have 365+ days worth (excluding weekends)
    let daysGenerated = baseData.length;
    const targetDays = 365;

    while (daysGenerated < targetDays) {
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
        daysGenerated++;
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
