# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-13

### Added
- Initial release of ETF Price Viewer
- HTML/CSS/JavaScript frontend implementation
- Mock data support for 3 ETFs (KODEX 200, TIGER 200, KODEX 반도체)
- Responsive design for mobile, tablet, and desktop
- ETF search functionality with validation
- Real-time price display with color indicators (red/blue)
- Intraday price table with timestamps
- Daily price history with period selection (1m/3m/6m/1y)
- Vercel deployment configuration (vercel.json)
- Comprehensive documentation (README.md, plan.md)
- SEO optimization with meta tags and Open Graph tags
- Favicon support (📈 chart emoji)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Cache optimization for static assets
- Error handling and loading states
- Git repository setup with proper .gitignore

### Features
- **ETF Search**: Search by ETF code with validation
- **Basic Info Display**: Current price, change, percentage, volume
- **Intraday Prices**: Time-series price data with volume
- **Daily Prices**: Historical data with configurable periods
- **Responsive Tables**: Mobile-optimized data tables
- **Loading Spinner**: Visual feedback during data loading
- **Error Messages**: User-friendly error notifications

### Technical Details
- Pure vanilla JavaScript (no frameworks)
- Modular code architecture (utils, api, app)
- Mock data JSON for development
- Ready for real API integration
- Vercel-optimized deployment
- Browser compatibility (Chrome, Firefox, Safari, Edge)

### Documentation
- Comprehensive README with setup instructions
- Detailed plan.md with development roadmap
- API integration guide for future phases
- Vercel deployment instructions
- Local development guide

### Future Plans
- Phase 2: Real API integration (Public Data Portal, KRX, PyKRX)
- Phase 3: Chart visualization (Chart.js)
- Phase 4: Additional features (favorites, multi-comparison)

## [Unreleased]

### Planned
- Integration with 공공데이터포털 API
- Real-time data updates
- Chart visualization
- Favorites/watchlist functionality
- Multi-ETF comparison
- Custom domain setup
- Performance monitoring

---

**Note**: This project is in active development. Version 1.0.0 represents the completion of Phase 1 (Prototype with Mock Data).
