# Prusa Market Analysis Dashboard

A real-time market analysis dashboard for tracking Prusa 3D printer and upgrade prices across various platforms. This tool helps users identify market trends, price patterns, and exceptional deals in the 3D printing ecosystem.

View the live dashboard: [https://cdracars.github.io/prusa-market-analysis](https://cdracars.github.io/prusa-market-analysis)

## Features

### Comprehensive Market Overview
- Real-time tracking of printer and upgrade listings
- Price comparison against MSRP
- Shipping cost analysis
- Seller reliability metrics
- Auction status monitoring

### Model-Specific Analytics
- Individual model price trends
- Deal identification
- Market availability tracking
- Price distribution analysis
- Shipping cost patterns

### Upgrade Market Analysis
- Categorized upgrade tracking
- Price trend visualization
- Vendor comparison
- Deal spotting
- Category-specific insights

### Interactive Features
- Detailed listing view
- Real-time price updates
- Auction time tracking
- Seller verification
- Direct listing access

## Technical Implementation

### Core Technologies
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Recharts
- ShadcnUI Components

### Data Processing
- Real-time data fetching
- Price normalization
- Shipping cost calculation
- Market trend analysis
- Deal identification algorithms

### User Interface
- Responsive design
- Interactive charts
- Tabbed navigation
- Modal dialogs
- Real-time updates

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/cdracars/prusa-market-analysis.git
cd prusa-market-analysis
```

2. Install dependencies:

Using Yarn (preferred):
```bash
yarn install
```

Using npm:
```bash
npm install
```

3. Run the development server:

Using Yarn:
```bash
yarn dev
```

Using npm:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Package Manager Notes

This project can be used with either Yarn or npm. While both package managers will work, we recommend using Yarn for the following reasons:

- Faster installation times
- More reliable dependency resolution
- Better caching mechanism
- Parallel package downloads
- Consistent installations across different machines

If switching between package managers, make sure to:
1. Delete the existing `node_modules` directory
2. Delete the package manager lock file (`yarn.lock` or `package-lock.json`)
3. Run a fresh install with your preferred package manager

## Project Structure

```
prusa-market-analysis/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── listing-dialog.tsx
│   ├── prusa-analysis-dashboard.tsx
│   └── ui/
├── lib/
│   └── utils.ts
├── types/
│   └── listing.ts
└── utils/
    └── process-data.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Note: Please ensure you're using the same package manager as specified in the project's lock file to maintain consistency.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Prusa Research](https://www.prusa3d.com/) for their excellent 3D printers
- [ShadcnUI](https://ui.shadcn.com/) for the component library
- [Recharts](https://recharts.org/) for charting capabilities
- [Radix UI](https://www.radix-ui.com/) for accessible primitives