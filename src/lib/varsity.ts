export interface Chapter {
  title: string
  url: string
}

export interface Module {
  id: number
  title: string
  chapters: Chapter[]
}

export const varsityModules: Module[] = [
  {
    id: 1,
    title: "Introduction to Stock Markets",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tThe Need to Invest",
        url: "https://zerodha.com/varsity/chapter/the-need-to-invest/",
      },
      {
        title: "2.\t\t\t\t\t\tRegulators, the guardians of capital markets",
        url: "https://zerodha.com/varsity/chapter/regulators/",
      },
      {
        title: "3.\t\t\t\t\t\tMarket Intermediaries in Stock Markets explained",
        url: "https://zerodha.com/varsity/chapter/financial-intermediaries/",
      },
      {
        title: "4.\t\t\t\t\t\tThe IPO Markets (Part 1)",
        url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-1/",
      },
      {
        title: "5.\t\t\t\t\t\tThe IPO Markets (Part 2)",
        url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-2/",
      },
      {
        title: "6.\t\t\t\t\t\tThe Stock Markets",
        url: "https://zerodha.com/varsity/chapter/the-stock-markets/",
      },
      {
        title:
          "7.\t\t\t\t\t\tStock market index explained: Sensex, Nifty & how they work",
        url: "https://zerodha.com/varsity/chapter/the-stock-markets-index/",
      },
      {
        title: "8.\t\t\t\t\t\tCommonly Used Jargons",
        url: "https://zerodha.com/varsity/chapter/commonly-used-jargons/",
      },
      {
        title: "9.\t\t\t\t\t\tThe Trading Terminal",
        url: "https://zerodha.com/varsity/chapter/the-trading-terminal/",
      },
      {
        title: "10.\t\t\t\t\t\tClearing and Settlement Process",
        url: "https://zerodha.com/varsity/chapter/clearing-and-settlement-process/",
      },
      {
        title: "11.\t\t\t\t\t\tCorporate actions and impact on stock prices",
        url: "https://zerodha.com/varsity/chapter/five-corporate-actions-and-its-impact-on-stock-prices/",
      },
      {
        title: "12.\t\t\t\t\t\tKey Events and Their Impact on Markets",
        url: "https://zerodha.com/varsity/chapter/key-events-and-their-impact-on-markets/",
      },
      {
        title: "13.\t\t\t\t\t\tGetting started",
        url: "https://zerodha.com/varsity/chapter/getting-started/",
      },
      {
        title: "14.\t\t\t\t\t\tSupplementary note – Rights, OFS, FPO",
        url: "https://zerodha.com/varsity/chapter/supplementary-note-ipo-ofs-fpo/",
      },
      {
        title:
          "15.\t\t\t\t\t\tSupplementary note – The 20 market depth or level 3 data",
        url: "https://zerodha.com/varsity/chapter/supplementary-note-the-20-market-depth/",
      },
    ],
  },

  {
    id: 2,
    title: "Technical Analysis",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tBackground",
        url: "https://zerodha.com/varsity/chapter/background/",
      },
      {
        title: "2.\t\t\t\t\t\tIntroducing Technical Analysis",
        url: "https://zerodha.com/varsity/chapter/introducing-technical-analysis/",
      },
      {
        title: "3.\t\t\t\t\t\tThe Chart Types",
        url: "https://zerodha.com/varsity/chapter/chart-types/",
      },
      {
        title: "4.\t\t\t\t\t\tGetting Started with Candlesticks",
        url: "https://zerodha.com/varsity/chapter/getting-started-candlesticks/",
      },
      {
        title: "5.\t\t\t\t\t\tSingle Candlestick patterns (Part 1)",
        url: "https://zerodha.com/varsity/chapter/single-candlestick-patterns-part-1/",
      },
      {
        title: "6.\t\t\t\t\t\tSingle Candlestick patterns (Part 2)",
        url: "https://zerodha.com/varsity/chapter/single-candlestick-patterns-part-2/",
      },
      {
        title: "7.\t\t\t\t\t\tSingle Candlestick patterns (Part 3)",
        url: "https://zerodha.com/varsity/chapter/single-candlestick-patterns-part-3/",
      },
      {
        title: "8.\t\t\t\t\t\tMultiple candlestick patterns (Part 1)",
        url: "https://zerodha.com/varsity/chapter/multiple-candlestick-patterns-part-1/",
      },
      {
        title: "9.\t\t\t\t\t\tMultiple Candlestick Patterns (Part 2)",
        url: "https://zerodha.com/varsity/chapter/multiple-candlestick-patterns-part-2/",
      },
      {
        title: "10.\t\t\t\t\t\tMultiple Candlestick Patterns (Part 3)",
        url: "https://zerodha.com/varsity/chapter/multiple-candlestick-patterns-part-3/",
      },
      {
        title: "11.\t\t\t\t\t\tThe Support and Resistance",
        url: "https://zerodha.com/varsity/chapter/support-resistance/",
      },
      {
        title: "12.\t\t\t\t\t\tVolumes",
        url: "https://zerodha.com/varsity/chapter/volumes/",
      },
      {
        title: "13.\t\t\t\t\t\tMoving Averages",
        url: "https://zerodha.com/varsity/chapter/moving-averages/",
      },
      {
        title: "14.\t\t\t\t\t\tIndicators (Part 1)",
        url: "https://zerodha.com/varsity/chapter/indicators-part-1/",
      },
      {
        title: "15.\t\t\t\t\t\tIndicators (Part 2)",
        url: "https://zerodha.com/varsity/chapter/indicators-part-2/",
      },
      {
        title: "16.\t\t\t\t\t\tThe Fibonacci Retracements",
        url: "https://zerodha.com/varsity/chapter/fibonacci-retracements/",
      },
      {
        title: "17.\t\t\t\t\t\tThe Dow Theory (Part 1)",
        url: "https://zerodha.com/varsity/chapter/dow-theory-part-1/",
      },
      {
        title: "18.\t\t\t\t\t\tThe Dow Theory (Part 2)",
        url: "https://zerodha.com/varsity/chapter/dow-theory-part-2/",
      },
      {
        title: "19.\t\t\t\t\t\tThe Finale – Helping you get started",
        url: "https://zerodha.com/varsity/chapter/finale-helping-get-started/",
      },
      {
        title: "20.\t\t\t\t\t\tOther indicators",
        url: "https://zerodha.com/varsity/chapter/supplementary-notes-1/",
      },
      {
        title: "21.\t\t\t\t\t\tInteresting features on TradingView",
        url: "https://zerodha.com/varsity/chapter/interesting-features-on-tradingview/",
      },
      {
        title: "22.\t\t\t\t\t\tThe Central Pivot Range",
        url: "https://zerodha.com/varsity/chapter/the-central-pivot-range/",
      },
    ],
  },
  {
    id: 3,
    title: "Fundamental Analysis",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tIntroduction to Fundamental Analysis",
        url: "https://zerodha.com/varsity/chapter/introduction-fundamental-analysis/",
      },
      {
        title: "2.\t\t\t\t\t\tMindset of an Investor",
        url: "https://zerodha.com/varsity/chapter/mindset-investor/",
      },
      {
        title: "3.\t\t\t\t\t\tHow to Read the Annual Report of a Company",
        url: "https://zerodha.com/varsity/chapter/read-annual-report-company/",
      },
      {
        title: "4.\t\t\t\t\t\tUnderstanding the P&L Statement (Part 1)",
        url: "https://zerodha.com/varsity/chapter/understanding-pl-statement-part1/",
      },
      {
        title: "5.\t\t\t\t\t\tUnderstanding P&L Statement (Part 2)",
        url: "https://zerodha.com/varsity/chapter/understanding-pl-statement-part2/",
      },
      {
        title: "6.\t\t\t\t\t\tUnderstanding Balance Sheet Statement (Part 1)",
        url: "https://zerodha.com/varsity/chapter/understanding-balance-sheet-statement-part-1/",
      },
      {
        title:
          "7.\t\t\t\t\t\tUnderstanding the Balance Sheet Statement (Part 2)",
        url: "https://zerodha.com/varsity/chapter/understanding-balance-sheet-statement-part-2/",
      },
      {
        title: "8.\t\t\t\t\t\tThe Cash Flow statement",
        url: "https://zerodha.com/varsity/chapter/cash-flow-statement/",
      },
      {
        title: "9.\t\t\t\t\t\tThe Financial Ratio Analysis (Part 1)",
        url: "https://zerodha.com/varsity/chapter/financial-ratio-analysis/",
      },
      {
        title: "10.\t\t\t\t\t\tThe Financial Ratio Analysis (Part 2)",
        url: "https://zerodha.com/varsity/chapter/financial-ratios-part-2/",
      },
      {
        title: "11.\t\t\t\t\t\tThe Financial Ratio Analysis (Part 3)",
        url: "https://zerodha.com/varsity/chapter/financial-ratios-part-3/",
      },
      {
        title: "12.\t\t\t\t\t\tThe Investment Due Diligence",
        url: "https://zerodha.com/varsity/chapter/investment-due-diligence/",
      },
      {
        title: "13.\t\t\t\t\t\tEquity Research (Part 1)",
        url: "https://zerodha.com/varsity/chapter/equity-research-part-1/",
      },
      {
        title: "14.\t\t\t\t\t\tDCF Primer",
        url: "https://zerodha.com/varsity/chapter/dcf-primer/",
      },
      {
        title: "15.\t\t\t\t\t\tEquity Research (Part 2)",
        url: "https://zerodha.com/varsity/chapter/equity-research-part-2/",
      },
      {
        title: "16.\t\t\t\t\t\tThe Finale",
        url: "https://zerodha.com/varsity/chapter/finale/",
      },
    ],
  },
  {
    id: 4,
    title: "Futures Trading",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tBackground – Forwards Market",
        url: "https://zerodha.com/varsity/chapter/background-forwards-market/",
      },
      {
        title: "2.\t\t\t\t\t\tIntroducing Futures Contract",
        url: "https://zerodha.com/varsity/chapter/introducing-futures-contract/",
      },
      {
        title: "3.\t\t\t\t\t\tThe Futures Trade",
        url: "https://zerodha.com/varsity/chapter/futures-trade/",
      },
      {
        title: "4.\t\t\t\t\t\tLeverage & Payoff",
        url: "https://zerodha.com/varsity/chapter/leverage-payoff/",
      },
      {
        title: "5.\t\t\t\t\t\tMargin & M2M",
        url: "https://zerodha.com/varsity/chapter/margin-m2m/",
      },
      {
        title: "6.\t\t\t\t\t\tMargin Calculator (Part 1)",
        url: "https://zerodha.com/varsity/chapter/margin-calculator-part-1/",
      },
      {
        title: "7.\t\t\t\t\t\tMargin Calculator (Part 2)",
        url: "https://zerodha.com/varsity/chapter/margin-calculator-part-2/",
      },
      {
        title: "8.\t\t\t\t\t\tAll about Shorting",
        url: "https://zerodha.com/varsity/chapter/shorting/",
      },
      {
        title: "9.\t\t\t\t\t\tThe Nifty Futures",
        url: "https://zerodha.com/varsity/chapter/nifty-futures/",
      },
      {
        title: "10.\t\t\t\t\t\tThe Futures Pricing",
        url: "https://zerodha.com/varsity/chapter/futures-pricing/",
      },
      {
        title: "11.\t\t\t\t\t\tHedging with Futures",
        url: "https://zerodha.com/varsity/chapter/hedging-futures/",
      },
      {
        title: "12.\t\t\t\t\t\tOpen Interest",
        url: "https://zerodha.com/varsity/chapter/open-interest/",
      },
      {
        title: "13.\t\t\t\t\t\tQuick Note on Physical Settlement",
        url: "https://zerodha.com/varsity/chapter/quick-note-on-physical-settlement/",
      },
    ],
  },
  {
    id: 5,
    title: "Options Theory for Professional Trading",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tCall Option Basics",
        url: "https://zerodha.com/varsity/chapter/call-option-basics/",
      },
      {
        title: "2.\t\t\t\t\t\tBasic Option Jargons",
        url: "https://zerodha.com/varsity/chapter/basic-option-jargons/",
      },
      {
        title: "3.\t\t\t\t\t\tBuying a Call Option",
        url: "https://zerodha.com/varsity/chapter/buying-a-call-option/",
      },
      {
        title: "4.\t\t\t\t\t\tSelling/Writing a Call Option",
        url: "https://zerodha.com/varsity/chapter/sellingwriting-a-call-option/",
      },
      {
        title: "5.\t\t\t\t\t\tThe Put Option Buying",
        url: "https://zerodha.com/varsity/chapter/the-put-option-buying/",
      },
      {
        title: "6.\t\t\t\t\t\tThe Put Option selling",
        url: "https://zerodha.com/varsity/chapter/the-put-option-selling/",
      },
      {
        title: "7.\t\t\t\t\t\tSummarizing Call & Put Options",
        url: "https://zerodha.com/varsity/chapter/summarizing-call-put-options/",
      },
      {
        title: "8.\t\t\t\t\t\tMoneyness of an Option Contract",
        url: "https://zerodha.com/varsity/chapter/moneyness-of-an-option-contract/",
      },
      {
        title: "9.\t\t\t\t\t\tThe Option Greeks (Delta) Part 1",
        url: "https://zerodha.com/varsity/chapter/the-option-greeks-delta-part-1/",
      },
      {
        title: "10.\t\t\t\t\t\tDelta (Part 2)",
        url: "https://zerodha.com/varsity/chapter/delta-part-2/",
      },
      {
        title: "11.\t\t\t\t\t\tDelta (Part 3)",
        url: "https://zerodha.com/varsity/chapter/delta-part-3/",
      },
      {
        title: "12.\t\t\t\t\t\tGamma (Part 1)",
        url: "https://zerodha.com/varsity/chapter/gamma-part-1/",
      },
      {
        title: "13.\t\t\t\t\t\tGamma (Part 2)",
        url: "https://zerodha.com/varsity/chapter/gamma-part-2/",
      },
      {
        title: "14.\t\t\t\t\t\tTheta",
        url: "https://zerodha.com/varsity/chapter/theta/",
      },
      {
        title: "15.\t\t\t\t\t\tVolatility Basics",
        url: "https://zerodha.com/varsity/chapter/understanding-volatility-part-1/",
      },
      {
        title: "16.\t\t\t\t\t\tVolatility Calculation (Historical)",
        url: "https://zerodha.com/varsity/chapter/volatility-calculation-historical/",
      },
      {
        title: "17.\t\t\t\t\t\tVolatility & Normal Distribution",
        url: "https://zerodha.com/varsity/chapter/volatility-normal-distribution/",
      },
      {
        title: "18.\t\t\t\t\t\tVolatility Applications",
        url: "https://zerodha.com/varsity/chapter/volatility-applications/",
      },
      {
        title: "19.\t\t\t\t\t\tVega",
        url: "https://zerodha.com/varsity/chapter/vega/",
      },
      {
        title: "20.\t\t\t\t\t\tGreek Interactions",
        url: "https://zerodha.com/varsity/chapter/greek-interactions/",
      },
      {
        title: "21.\t\t\t\t\t\tGreek Calculator",
        url: "https://zerodha.com/varsity/chapter/greek-calculator/",
      },
      {
        title: "22.\t\t\t\t\t\tRe-introducing Call & Put Options",
        url: "https://zerodha.com/varsity/chapter/re-introducing-call-put-options/",
      },
      {
        title: "23.\t\t\t\t\t\tCase studies – wrapping it all up!",
        url: "https://zerodha.com/varsity/chapter/case-studies-wrapping-it-all-up/",
      },
      {
        title: "24.\t\t\t\t\t\tQuick note on Physical Settlement",
        url: "https://zerodha.com/varsity/chapter/quick-note-on-physical-settlement-2/",
      },
      {
        title: "25.\t\t\t\t\t\tOptions M2M and P&L calculation",
        url: "https://zerodha.com/varsity/chapter/options-m2m-and-pl/",
      },
    ],
  },
  {
    id: 6,
    title: "Option Strategies",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tOrientation",
        url: "https://zerodha.com/varsity/chapter/orientation/",
      },
      {
        title: "2.\t\t\t\t\t\tBull Call Spread",
        url: "https://zerodha.com/varsity/chapter/bull-call-spread/",
      },
      {
        title: "3.\t\t\t\t\t\tBull Put Spread",
        url: "https://zerodha.com/varsity/chapter/bull-put-spread/",
      },
      {
        title: "4.\t\t\t\t\t\tCall Ratio Back Spread",
        url: "https://zerodha.com/varsity/chapter/call-ratio-back-spread/",
      },
      {
        title: "5.\t\t\t\t\t\tBear Call Ladder",
        url: "https://zerodha.com/varsity/chapter/bear-call-ladder/",
      },
      {
        title: "6.\t\t\t\t\t\tSynthetic Long & Arbitrage",
        url: "https://zerodha.com/varsity/chapter/synthetic-long-arbitrage/",
      },
      {
        title: "7.\t\t\t\t\t\tBear Put Spread",
        url: "https://zerodha.com/varsity/chapter/bear-put-spread/",
      },
      {
        title: "8.\t\t\t\t\t\tBear Call Spread",
        url: "https://zerodha.com/varsity/chapter/bear-call-spread/",
      },
      {
        title: "9.\t\t\t\t\t\tPut Ratio Back spread",
        url: "https://zerodha.com/varsity/chapter/put-ratio-back-spread/",
      },
      {
        title: "10.\t\t\t\t\t\tThe Long Straddle",
        url: "https://zerodha.com/varsity/chapter/the-long-straddle/",
      },
      {
        title: "11.\t\t\t\t\t\tThe Short Straddle",
        url: "https://zerodha.com/varsity/chapter/the-short-straddle/",
      },
      {
        title: "12.\t\t\t\t\t\tThe Long & Short Strangle",
        url: "https://zerodha.com/varsity/chapter/the-long-short-strangle/",
      },
      {
        title: "13.\t\t\t\t\t\tMax Pain & PCR Ratio",
        url: "https://zerodha.com/varsity/chapter/max-pain-pcr-ratio/",
      },
      {
        title: "14.\t\t\t\t\t\tIron Condor",
        url: "https://zerodha.com/varsity/chapter/iron-condor/",
      },
    ],
  },
  {
    id: 7,
    title: "Markets and Taxation",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tIntroduction (Setting the Context)",
        url: "https://zerodha.com/varsity/chapter/introduction-setting-the-context/",
      },
      {
        title: "2.\t\t\t\t\t\tBasics",
        url: "https://zerodha.com/varsity/chapter/basics/",
      },
      {
        title: "3.\t\t\t\t\t\tClassifying Your Market Activity",
        url: "https://zerodha.com/varsity/chapter/classifying-your-market-activity/",
      },
      {
        title: "4.\t\t\t\t\t\tTaxation for Investors",
        url: "https://zerodha.com/varsity/chapter/taxation-for-investors/",
      },
      {
        title: "5.\t\t\t\t\t\tTaxation for Traders",
        url: "https://zerodha.com/varsity/chapter/taxation-for-traders/",
      },
      {
        title: "6.\t\t\t\t\t\tTurnover, Balance Sheet, and P&L",
        url: "https://zerodha.com/varsity/chapter/turnover-balance-sheet-and-pl/",
      },
      {
        title: "7.\t\t\t\t\t\tITR Forms (The Finale)",
        url: "https://zerodha.com/varsity/chapter/itr-forms/",
      },
      {
        title: "8.\t\t\t\t\t\tForeign Stocks and Taxation",
        url: "https://zerodha.com/varsity/chapter/foreign-stocks-and-taxation/",
      },
    ],
  },
  {
    id: 8,
    title: "Currency, Commodity, and Government Securities",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tCurrency Basics",
        url: "https://zerodha.com/varsity/chapter/currency-basics/",
      },
      {
        title: "2.\t\t\t\t\t\tReference Rates & Impact of events",
        url: "https://zerodha.com/varsity/chapter/reference-rates-impact-of-events/",
      },
      {
        title: "3.\t\t\t\t\t\tImpact of events (Brexit) & Interest Rate Parity",
        url: "https://zerodha.com/varsity/chapter/impact-of-events-brexit-interest-rate-parity/",
      },
      {
        title: "4.\t\t\t\t\t\tThe USD INR Pair (Part 1)",
        url: "https://zerodha.com/varsity/chapter/the-usd-inr-pair/",
      },
      {
        title: "5.\t\t\t\t\t\tThe USD INR Pair (Part 2)",
        url: "https://zerodha.com/varsity/chapter/the-usd-inr-pair-part-2/",
      },
      {
        title: "6.\t\t\t\t\t\tEUR, GBP, and JPY",
        url: "https://zerodha.com/varsity/chapter/eur-gbp-and-jpy/",
      },
      {
        title: "7.\t\t\t\t\t\tGold (Part 1)",
        url: "https://zerodha.com/varsity/chapter/gold-part-1/",
      },
      {
        title: "8.\t\t\t\t\t\tGold (Part 2)",
        url: "https://zerodha.com/varsity/chapter/gold-part-2/",
      },
      {
        title: "9.\t\t\t\t\t\tSilver",
        url: "https://zerodha.com/varsity/chapter/silver/",
      },
      {
        title: "10.\t\t\t\t\t\tCrude Oil (Part 1), digging the past",
        url: "https://zerodha.com/varsity/chapter/crude-oil-part-1-digging-the-past/",
      },
      {
        title: "11.\t\t\t\t\t\tCrude Oil (Part 2), the crude oil eco system",
        url: "https://zerodha.com/varsity/chapter/crude-oil-part-2-the-crude-oil-eco-system/",
      },
      {
        title: "12.\t\t\t\t\t\tCrude Oil (Part 3), the crude oil contract",
        url: "https://zerodha.com/varsity/chapter/crude-oil-part-3-the-crude-oil-contract/",
      },
      {
        title: "13.\t\t\t\t\t\tCopper & Aluminium",
        url: "https://zerodha.com/varsity/chapter/copper-aluminium/",
      },
      {
        title: "14.\t\t\t\t\t\tLead & Nickel",
        url: "https://zerodha.com/varsity/chapter/lead-nickel/",
      },
      {
        title: "15.\t\t\t\t\t\tCardamom & Mentha Oil",
        url: "https://zerodha.com/varsity/chapter/cardamom-mentha-oil/",
      },
      {
        title: "16.\t\t\t\t\t\tNatural Gas",
        url: "https://zerodha.com/varsity/chapter/natural-gas/",
      },
      {
        title: "17.\t\t\t\t\t\tCommodity Options",
        url: "https://zerodha.com/varsity/chapter/commodity-options/",
      },
      {
        title: "18.\t\t\t\t\t\tCross Currency Pairs",
        url: "https://zerodha.com/varsity/chapter/cross-currency-pairs/",
      },
      {
        title: "19.\t\t\t\t\t\tGovernment Securities",
        url: "https://zerodha.com/varsity/chapter/government-securities/",
      },
      {
        title: "20.\t\t\t\t\t\tElectricity Derivatives",
        url: "https://zerodha.com/varsity/chapter/electricity-derivatives/",
      },
    ],
  },

  {
    id: 9,
    title: "Risk Management and Trading Psychology",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tOrientation note",
        url: "https://zerodha.com/varsity/chapter/orientation-note/",
      },
      {
        title: "2.\t\t\t\t\t\tRisk (Part 1)",
        url: "https://zerodha.com/varsity/chapter/risk-part-1/",
      },
      {
        title: "3.\t\t\t\t\t\tRisk (Part 2) – Variance & Covariance",
        url: "https://zerodha.com/varsity/chapter/risk-part-2-variance-covariance/",
      },
      {
        title: "4.\t\t\t\t\t\tRisk (Part 3) – Variance & Covariance Matrix",
        url: "https://zerodha.com/varsity/chapter/risk-part-3-_variance-covariance-matrix/",
      },
      {
        title:
          "5.\t\t\t\t\t\tRisk (Part 4) – Correlation Matrix & Portfolio Variance",
        url: "https://zerodha.com/varsity/chapter/risk-part-4-correlation-matrix-portfolio-variance/",
      },
      {
        title: "6.\t\t\t\t\t\tEquity Curve",
        url: "https://zerodha.com/varsity/chapter/equity-curve/",
      },
      {
        title: "7.\t\t\t\t\t\tExpected Returns",
        url: "https://zerodha.com/varsity/chapter/expected-returns/",
      },
      {
        title: "8.\t\t\t\t\t\tPortfolio Optimization (Part 1)",
        url: "https://zerodha.com/varsity/chapter/port-opt/",
      },
      {
        title: "9.\t\t\t\t\t\tPortfolio Optimization (Part 2)",
        url: "https://zerodha.com/varsity/chapter/po2/",
      },
      {
        title: "10.\t\t\t\t\t\tValue at Risk",
        url: "https://zerodha.com/varsity/chapter/var/",
      },
      {
        title: "11.\t\t\t\t\t\tPosition Sizing for active trader",
        url: "https://zerodha.com/varsity/chapter/position-sizing/",
      },
      {
        title: "12.\t\t\t\t\t\tPosition Sizing for active traders (Part 2)",
        url: "https://zerodha.com/varsity/chapter/position-sizing-active-traders-part-2/",
      },
      {
        title: "13.\t\t\t\t\t\tPosition Sizing for active traders (Part 3)",
        url: "https://zerodha.com/varsity/chapter/position-sizing-active-traders-part-3/",
      },
      {
        title: "14.\t\t\t\t\t\tKelly’s Criterion",
        url: "https://zerodha.com/varsity/chapter/kellys-criterion/",
      },
      {
        title: "15.\t\t\t\t\t\tTrading Biases",
        url: "https://zerodha.com/varsity/chapter/trading-biases/",
      },
      {
        title: "16.\t\t\t\t\t\tTrading Biases (Part 2)",
        url: "https://zerodha.com/varsity/chapter/tradingbiases-p2/",
      },
    ],
  },

  {
    id: 10,
    title: "Trading Systems",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tWhat to expect?",
        url: "https://zerodha.com/varsity/chapter/what-to-expect/",
      },
      {
        title: "2.\t\t\t\t\t\tPair Trading logic",
        url: "https://zerodha.com/varsity/chapter/pair-trading-basics/",
      },
      {
        title:
          "3.\t\t\t\t\t\tPair Trading, Method 1, Chapter 1 (PTM1, C1) -Tracking Pairs",
        url: "https://zerodha.com/varsity/chapter/tracking-pairs/",
      },
      {
        title: "4.\t\t\t\t\t\tPTM1, C2 – Pair stats",
        url: "https://zerodha.com/varsity/chapter/pair-stats/",
      },
      {
        title: "5.\t\t\t\t\t\tPTM1, C3 – Pre trade setup",
        url: "https://zerodha.com/varsity/chapter/pre-trade-setup/",
      },
      {
        title: "6.\t\t\t\t\t\tPTM1, C4 – The Density Curve",
        url: "https://zerodha.com/varsity/chapter/the-density-curve/",
      },
      {
        title: "7.\t\t\t\t\t\tPTM1,C5 – The Pair Trade",
        url: "https://zerodha.com/varsity/chapter/the-pair-trade/",
      },
      {
        title:
          "8.\t\t\t\t\t\tPair trade Method 2, Chapter 1 (PTM2, C1) – Straight line Equation",
        url: "https://zerodha.com/varsity/chapter/straight-line-equation/",
      },
      {
        title: "9.\t\t\t\t\t\tPTM2, C2 – Linear Regression",
        url: "https://zerodha.com/varsity/chapter/linear-regression/",
      },
      {
        title: "10.\t\t\t\t\t\tPTM2, C3 – The Error Ratio",
        url: "https://zerodha.com/varsity/chapter/the-error-ratio/",
      },
      {
        title: "11.\t\t\t\t\t\tPTM2, C4 – The ADF test",
        url: "https://zerodha.com/varsity/chapter/the-adf-test/",
      },
      {
        title: "12.\t\t\t\t\t\tTrade Identification",
        url: "https://zerodha.com/varsity/chapter/trade-identification/",
      },
      {
        title: "13.\t\t\t\t\t\tLive Example -1",
        url: "https://zerodha.com/varsity/chapter/live-example/",
      },
      {
        title: "14.\t\t\t\t\t\tLive Example – 2",
        url: "https://zerodha.com/varsity/chapter/live-example-2/",
      },
      {
        title: "15.\t\t\t\t\t\tCalendar Spreads",
        url: "https://zerodha.com/varsity/chapter/calendar-spreads/",
      },
      {
        title: "16.\t\t\t\t\t\tMomentum Portfolios",
        url: "https://zerodha.com/varsity/chapter/momentum-portfolios/",
      },
    ],
  },

  {
    id: 11,
    title: "Personal Finance - Mutual Funds",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tBackground and Orientation",
        url: "https://zerodha.com/varsity/chapter/background-and-orientation/",
      },
      {
        title: "2.\t\t\t\t\t\tPersonal Finance Math (Part 1)",
        url: "https://zerodha.com/varsity/chapter/personal-finance-math-part-1/",
      },
      {
        title: "3.\t\t\t\t\t\tPersonal Finance Math (Part 2)",
        url: "https://zerodha.com/varsity/chapter/personal-finance-math-part-2/",
      },
      {
        title: "4.\t\t\t\t\t\tThe retirement problem (Part 1)",
        url: "https://zerodha.com/varsity/chapter/the-retirement-problem-part-1/",
      },
      {
        title: "5.\t\t\t\t\t\tThe retirement problem (Part 2)",
        url: "https://zerodha.com/varsity/chapter/the-retirement-problem-part-2/",
      },
      {
        title: "6.\t\t\t\t\t\tIntroduction to Mutual Funds",
        url: "https://zerodha.com/varsity/chapter/introduction-to-mutual-funds/",
      },
      {
        title: "7.\t\t\t\t\t\tConcept of fund & NAV",
        url: "https://zerodha.com/varsity/chapter/concept-of-fund-nav/",
      },
      {
        title: "8.\t\t\t\t\t\tThe mutual fund fact-sheet",
        url: "https://zerodha.com/varsity/chapter/the-mutual-fund-fact-sheet/",
      },
      {
        title: "9.\t\t\t\t\t\tThe Equity scheme (Part 1)",
        url: "https://zerodha.com/varsity/chapter/the-equity-scheme-part-1/",
      },
      {
        title: "10.\t\t\t\t\t\tEquity Scheme (Part 2)",
        url: "https://zerodha.com/varsity/chapter/equity-scheme-part-2/",
      },
      {
        title: "11.\t\t\t\t\t\tThe Debt funds (Part 1)",
        url: "https://zerodha.com/varsity/chapter/the-debt-funds-part-1/",
      },
      {
        title: "12.\t\t\t\t\t\tThe Debt funds (Part 2)",
        url: "https://zerodha.com/varsity/chapter/the-debt-funds-part-2/",
      },
      {
        title: "13.\t\t\t\t\t\tThe Debt funds (Part 3)",
        url: "https://zerodha.com/varsity/chapter/the-debt-funds-part-3/",
      },
      {
        title: "14.\t\t\t\t\t\tThe Debt Funds (Part 4)",
        url: "https://zerodha.com/varsity/chapter/the-debt-funds-part-4/",
      },
      {
        title: "15.\t\t\t\t\t\tInvesting in Bonds",
        url: "https://zerodha.com/varsity/chapter/investing-in-bonds/",
      },
      {
        title: "16.\t\t\t\t\t\tIndex Funds",
        url: "https://zerodha.com/varsity/chapter/introduction-to-index-funds/",
      },
      {
        title: "17.\t\t\t\t\t\tArbitrage Funds",
        url: "https://zerodha.com/varsity/chapter/arbitrage-funds/",
      },
      {
        title: "18.\t\t\t\t\t\tMeasuring Mutual fund Returns",
        url: "https://zerodha.com/varsity/chapter/measuring-mutual-fund-returns/",
      },
      {
        title: "19.\t\t\t\t\t\tRolling Returns",
        url: "https://zerodha.com/varsity/chapter/rolling-returns/",
      },
      {
        title:
          "20.\t\t\t\t\t\tMutual fund Expense Ratio, Direct, and Regular plans",
        url: "https://zerodha.com/varsity/chapter/mutual-fund-expense-ratio-direct-and-regular-plans/",
      },
      {
        title: "21.\t\t\t\t\t\tMutual Benchmarking",
        url: "https://zerodha.com/varsity/chapter/mutual-benchmarking/",
      },
      {
        title: "22.\t\t\t\t\t\tMutual Fund Beta, SD, and Sharpe Ratio",
        url: "https://zerodha.com/varsity/chapter/mutual-fund-risk-metrics/",
      },
      {
        title: "23.\t\t\t\t\t\tSortino and the Capture Ratios",
        url: "https://zerodha.com/varsity/chapter/sortino-and-the-capture-ratios/",
      },
      {
        title: "24.\t\t\t\t\t\tHow to analyse an Equity Mutual fund?",
        url: "https://zerodha.com/varsity/chapter/how-to-analyse-an-equity-mutual-fund/",
      },
      {
        title: "25.\t\t\t\t\t\tHow to analyze a debt mutual fund?",
        url: "https://zerodha.com/varsity/chapter/how-to-analyze-a-debt-mutual-fund/",
      },
      {
        title: "26.\t\t\t\t\t\tThe Mutual Fund Portfolio",
        url: "https://zerodha.com/varsity/chapter/the-mutual-fund-portfolio/",
      },
      {
        title: "27.\t\t\t\t\t\tSmart-beta funds",
        url: "https://zerodha.com/varsity/chapter/smart-beta-funds/",
      },
      {
        title: "28.\t\t\t\t\t\tAsset Allocation, An Introduction",
        url: "https://zerodha.com/varsity/chapter/asset-allocation-an-introduction/",
      },
      {
        title: "29.\t\t\t\t\t\tExchange-traded funds (ETF)",
        url: "https://zerodha.com/varsity/chapter/exchange-traded-funds-etf/",
      },
      {
        title: "30.\t\t\t\t\t\tBasics of Macro Economics",
        url: "https://zerodha.com/varsity/chapter/basics-of-macro-economics/",
      },
      {
        title: "31.\t\t\t\t\t\tPersonal finance review (Part 1)",
        url: "https://zerodha.com/varsity/chapter/personal-finance-review-part-1/",
      },
      {
        title: "32.\t\t\t\t\t\tPersonal finance review (Part 2)",
        url: "https://zerodha.com/varsity/chapter/personal-finance-review-part-2/",
      },
      {
        title: "33.\t\t\t\t\t\tKnow your fund",
        url: "https://zerodha.com/varsity/chapter/know-your-fund/",
      },
    ],
  },

  {
    id: 12,
    title: "Innerworth - Mind over markets",
    chapters: [
      {
        title: "1. Introducing ‘Innerworth – Mind over markets’",
        url: "https://zerodha.com/varsity/chapter/introducing-innerworth-mind-over-markets/",
      },
      {
        title: "2. Accurate Perceptions of Loss and Risk Aversion",
        url: "https://zerodha.com/varsity/chapter/accurate-perceptions-of-loss-and-risk-aversion/",
      },
      {
        title: "3. Accepting Criticism",
        url: "https://zerodha.com/varsity/chapter/accepting-criticism/",
      },
      {
        title: "4. Trading Capital: Size Matters",
        url: "https://zerodha.com/varsity/chapter/trading-capital-size-matters/",
      },
      {
        title: "5. Action Oriented and Winning",
        url: "https://zerodha.com/varsity/chapter/action-oriented-and-winning/",
      },
      {
        title: "6. Focus on the Action, Not the Prize",
        url: "https://zerodha.com/varsity/chapter/focus-on-the-action-not-the-prize/",
      },
      {
        title: "7. Detailed Action Plans: A Precursor For Trading Success",
        url: "https://zerodha.com/varsity/chapter/detailed-action-plans-a-precursor-for-trading-success/",
      },
      {
        title: "8. A Trading Fable",
        url: "https://zerodha.com/varsity/chapter/a-trading-fable/",
      },
      {
        title: "9. It’s Easier to Face Fear than Avoid It",
        url: "https://zerodha.com/varsity/chapter/its-easier-to-face-fear-than-avoid-it/",
      },
      {
        title: "10. Regret: A Powerful Emotion You Must Face",
        url: "https://zerodha.com/varsity/chapter/regret-a-powerful-emotion-you-must-face/",
      },
      {
        title: "11. The Unconscious Drive to Fail",
        url: "https://zerodha.com/varsity/chapter/the-unconscious-drive-to-fail/",
      },
      {
        title: "12. False Consensus Effects",
        url: "https://zerodha.com/varsity/chapter/false-consensus-effects/",
      },
      {
        title: "13. Making Sense of it All",
        url: "https://zerodha.com/varsity/chapter/making-sense-of-it-all/",
      },
      {
        title: "14. Fear of a Sudden Turn of Events",
        url: "https://zerodha.com/varsity/chapter/fear-of-a-sudden-turn-of-events/",
      },
      {
        title: "15. Refuting Core Beliefs: A Remedy for the Fear of Failure",
        url: "https://zerodha.com/varsity/chapter/refuting-core-beliefs-a-remedy-for-the-fear-of-failure/",
      },
      {
        title: "16. Paralyzed by a Fear of Failure",
        url: "https://zerodha.com/varsity/chapter/paralyzed-by-a-fear-of-failure/",
      },
      {
        title: "17. Getting Worked Up For Nothing",
        url: "https://zerodha.com/varsity/chapter/getting-worked-up-for-nothing/",
      },
      {
        title: "18. Loss is Feedback, Not Failure",
        url: "https://zerodha.com/varsity/chapter/loss-is-feedback-not-failure/",
      },
      {
        title: "19. First in Line and Ready for Action",
        url: "https://zerodha.com/varsity/chapter/first-in-line-and-ready-for-action/",
      },
      {
        title: "20. The Flexible Trader",
        url: "https://zerodha.com/varsity/chapter/the-flexible-trader/",
      },
      {
        title: "21. Flexible and Open to Possibilities",
        url: "https://zerodha.com/varsity/chapter/flexible-and-open-to-possibilities/",
      },
      {
        title: "22. The Flexible and Disciplined Trader",
        url: "https://zerodha.com/varsity/chapter/the-flexible-and-disciplined-trader/",
      },
      {
        title: "23. Be Flexible Enough to Stand Aside",
        url: "https://zerodha.com/varsity/chapter/be-flexible-enough-to-stand-aside/",
      },
      {
        title: "24. Peak Performance Trading",
        url: "https://zerodha.com/varsity/chapter/peak-performance-trading/",
      },
      {
        title: "25. The Fly and the Tree",
        url: "https://zerodha.com/varsity/chapter/the-fly-and-the-tree/",
      },
      {
        title: "26. Focused on the Trade",
        url: "https://zerodha.com/varsity/chapter/focused-on-the-trade/",
      },
      {
        title: "27. Concentrate On the Trade",
        url: "https://zerodha.com/varsity/chapter/concentrate-on-the-trade/",
      },
      {
        title: "28. Focusing on the Positive",
        url: "https://zerodha.com/varsity/chapter/focusing-on-the-positive/",
      },
      {
        title: "29. Knowing when to Fold",
        url: "https://zerodha.com/varsity/chapter/knowing-when-to-fold/",
      },
      {
        title: "30. Following your Passion",
        url: "https://zerodha.com/varsity/chapter/following-your-passion/",
      },
      {
        title: "31. Forward Thinking",
        url: "https://zerodha.com/varsity/chapter/forward-thinking/",
      },
      {
        title: "32. The Right Frame of Reference",
        url: "https://zerodha.com/varsity/chapter/the-right-frame-of-reference/",
      },
      {
        title: "33. Trading offers Freedom",
        url: "https://zerodha.com/varsity/chapter/trading-offers-freedom/",
      },
      {
        title: "34. Free and Easy Trading",
        url: "https://zerodha.com/varsity/chapter/free-and-easy-trading/",
      },
      {
        title: "35. Free Up Psychological Energy by Relieving Stress",
        url: "https://zerodha.com/varsity/chapter/free-up-psychological-energy-by-relieving-stress/",
      },
      {
        title: "36. Organize your Workspace and Relieve Stress",
        url: "https://zerodha.com/varsity/chapter/organize-your-workspace-and-relieve-stress/",
      },
      {
        title: "37. Market Frustration: Stay Calm; It’s not Personal",
        url: "https://zerodha.com/varsity/chapter/market-frustration-stay-calm-its-not-personal/",
      },
      {
        title: "38. Building Up Frustration Tolerance",
        url: "https://zerodha.com/varsity/chapter/building-up-frustration-tolerance/",
      },
      {
        title: "39. Fear of Success: Is it relevant for Traders?",
        url: "https://zerodha.com/varsity/chapter/fear-of-success-is-it-relevant-for-traders/",
      },
      {
        title: "40. Take Responsibility and Take Control",
        url: "https://zerodha.com/varsity/chapter/take-responsibility-and-take-control/",
      },
      {
        title: "41. The Mindset of a Professional Gambler",
        url: "https://zerodha.com/varsity/chapter/the-mindset-of-a-professional-gambler/",
      },
      {
        title: "42. Closing the Gap",
        url: "https://zerodha.com/varsity/chapter/closing-the-gap/",
      },
      {
        title: "43. Developing New Trading Ideas",
        url: "https://zerodha.com/varsity/chapter/developing-new-trading-ideas/",
      },
      {
        title: "44. Back On the Right Course",
        url: "https://zerodha.com/varsity/chapter/back-on-the-right-course/",
      },
      {
        title: "45. Take Credit for Your Efforts",
        url: "https://zerodha.com/varsity/chapter/take-credit-for-your-efforts/",
      },
      {
        title: "46. Getting Ready to Trade",
        url: "https://zerodha.com/varsity/chapter/getting-ready-to-trade/",
      },
      {
        title: "47. Realistic Optimism Keeps You Grounded",
        url: "https://zerodha.com/varsity/chapter/realistic-optimism-keeps-you-grounded/",
      },
      {
        title: "48. Don’t Forget to Take a Break",
        url: "https://zerodha.com/varsity/chapter/dont-forget-to-take-a-break/",
      },
      {
        title: "49. They Say it Couldn’t be Done",
        url: "https://zerodha.com/varsity/chapter/they-say-it-couldnt-be-done/",
      },
      {
        title: "50. Waiting for the Payoff",
        url: "https://zerodha.com/varsity/chapter/waiting-for-the-payoff/",
      },
      {
        title: "51. Modest and Realistic Goals",
        url: "https://zerodha.com/varsity/chapter/modest-and-realistic-goals/",
      },
      {
        title: "52. Clear and Specific Goals",
        url: "https://zerodha.com/varsity/chapter/clear-and-specific-goals/",
      },
      {
        title: "53. Setting Goals for the New Year",
        url: "https://zerodha.com/varsity/chapter/setting-goals-for-the-new-year/",
      },
      {
        title: "54. Goal Setting Enhances Motivation",
        url: "https://zerodha.com/varsity/chapter/goal-setting-enhances-motivation/",
      },
      {
        title: "55. Go For It",
        url: "https://zerodha.com/varsity/chapter/go-for-it/",
      },
      {
        title:
          "56. The Golden Mean: Real Trading Phenomenon or Just Wishful Thinking?",
        url: "https://zerodha.com/varsity/chapter/the-golden-mean-real-trading-phenomenon-or-just-wishful-thinking/",
      },
      {
        title: "57. Putting Up a Good Fight",
        url: "https://zerodha.com/varsity/chapter/putting-up-a-good-fight/",
      },
      {
        title: "58. A Good Mood Is More Important Than You Think",
        url: "https://zerodha.com/varsity/chapter/a-good-mood-is-more-important-than-you-think/",
      },
      {
        title: "59. The Dynamics of Greed",
        url: "https://zerodha.com/varsity/chapter/the-dynamics-of-greed/",
      },
      {
        title: "60. Don’t Be a Grinch: Relax and Seek Out Balance",
        url: "https://zerodha.com/varsity/chapter/dont-be-a-grinch-relax-and-seek-out-balance/",
      },
      {
        title: "61. Grounded and Objective",
        url: "https://zerodha.com/varsity/chapter/grounded-and-objective/",
      },
      {
        title: "62. A Guidebook for Work Productivity",
        url: "https://zerodha.com/varsity/chapter/a-guidebook-for-work-productivity/",
      },
      {
        title: "63. Conquering Guilt and Moving Forward",
        url: "https://zerodha.com/varsity/chapter/conquering-guilt-and-moving-forward/",
      },
      {
        title: "64. Working Through Guilt and Moving On",
        url: "https://zerodha.com/varsity/chapter/working-through-guilt-and-moving-on/",
      },
      {
        title: "65. Guilt: Protection Or Distraction",
        url: "https://zerodha.com/varsity/chapter/guilt-protection-or-distraction/",
      },
      {
        title: "66. Going With Your Gut",
        url: "https://zerodha.com/varsity/chapter/going-with-your-gut/",
      },
      {
        title: "67. Cold, Hard Facts: Look Honestly and Make Adjustments",
        url: "https://zerodha.com/varsity/chapter/cold-hard-facts-look-honestly-and-make-adjustments/",
      },
      {
        title: "68. A Good Hard Look at the Facts",
        url: "https://zerodha.com/varsity/chapter/a-good-hard-look-at-the-facts/",
      },
      {
        title: "69. Commitment to Trading: Why It’s So Difficult",
        url: "https://zerodha.com/varsity/chapter/commitment-to-trading-why-its-so-difficult/",
      },
      {
        title: "70. Head-and-Shoulders Pattern is a Psychological Map",
        url: "https://zerodha.com/varsity/chapter/head-and-shoulders-pattern-is-a-psychological-map/",
      },
      {
        title: "71. A Healthy Approach to Trading Success",
        url: "https://zerodha.com/varsity/chapter/a-healthy-approach-to-trading-success/",
      },
      {
        title: "72. Having, Doing, and Being: Which State of Mind Drives You?",
        url: "https://zerodha.com/varsity/chapter/having-doing-and-being-which-state-of-mind-drives-you/",
      },
      {
        title: "73. The Conscious Member of the Herd",
        url: "https://zerodha.com/varsity/chapter/you-may-be-giving-into-a-natural-inclination-to-follow-the-crowd-it-may-seem-routine-but-if-you-arent-fully-conscious-of-your-actions-you-may-find-yourself-giving-back-profits/",
      },
      {
        title: "74. The Herd Mentality",
        url: "https://zerodha.com/varsity/chapter/the-herd-mentality/",
      },
      {
        title: "75. Pulling the Trigger Decisively",
        url: "https://zerodha.com/varsity/chapter/pulling-the-trigger-decisively/",
      },
      {
        title: "76. Hesitation: A Plethora of Reasons",
        url: "https://zerodha.com/varsity/chapter/hesitation-a-plethora-of-reasons/",
      },
      {
        title: "77. Trading in a Higher Psychological Sphere",
        url: "https://zerodha.com/varsity/chapter/trading-in-a-higher-psychological-sphere/",
      },
      {
        title: "78. The Highly Motivated Trader",
        url: "https://zerodha.com/varsity/chapter/the-highly-motivated-trader/",
      },
      {
        title: "79. Everything Seems Obvious In Hindsight",
        url: "https://zerodha.com/varsity/chapter/everything-seems-obvious-in-hindsight/",
      },
      {
        title: "80. The Benefits of Hindsight",
        url: "https://zerodha.com/varsity/chapter/the-benefits-of-hindsight/",
      },
      {
        title: "81. The Future Is Never Certain",
        url: "https://zerodha.com/varsity/chapter/the-future-is-never-certain/",
      },
      {
        title:
          "82. Using the Success History Search To Cultivate a Winning Attitude",
        url: "https://zerodha.com/varsity/chapter/using-the-success-history-search-to-cultivate-a-winning-attitude/",
      },
      {
        title: "83. Don’t Dig the Hole Deeper",
        url: "https://zerodha.com/varsity/chapter/dont-dig-the-hole-deeper/",
      },
      {
        title: "84. Trading From Home: Avoiding the Traps",
        url: "https://zerodha.com/varsity/chapter/trading-from-home-avoiding-the-traps/",
      },
      {
        title: "85. High Hopes",
        url: "https://zerodha.com/varsity/chapter/high-hopes/",
      },
      {
        title: "86. Next Time You Get a Hot Tip…Beware",
        url: "https://zerodha.com/varsity/chapter/next-time-you-get-a-hot-tipbeware/",
      },
      {
        title: "87. It’s How You Play the Game That Matters",
        url: "https://zerodha.com/varsity/chapter/its-how-you-play-the-game-that-matters/",
      },
      {
        title: "88. A Humble and Modest Approach",
        url: "https://zerodha.com/varsity/chapter/a-humble-and-modest-approach/",
      },
      {
        title: "89. Winning Traders Are Humble",
        url: "https://zerodha.com/varsity/chapter/winning-traders-are-humble/",
      },
      {
        title: "90. The Humble Trader is the Winning Trader",
        url: "https://zerodha.com/varsity/chapter/the-humble-trader-is-the-winning-trader/",
      },
      {
        title: "91. Humility",
        url: "https://zerodha.com/varsity/chapter/humility/",
      },
      {
        title: "92. Striving for an Ideal: Art or Science?",
        url: "https://zerodha.com/varsity/chapter/striving-for-an-ideal-art-or-science/",
      },
      {
        title: "93. Idealism: Dare to Dream",
        url: "https://zerodha.com/varsity/chapter/idealism-dare-to-dream/",
      },
      {
        title: "94. Striving for Ideals",
        url: "https://zerodha.com/varsity/chapter/striving-for-ideals/",
      },
      {
        title: "95. How Much Are You Making?",
        url: "https://zerodha.com/varsity/chapter/how-much-are-you-making/",
      },
      {
        title:
          "96. Intuition: It May Be Illogical But It’s A Trader’s Most Valuable Asset",
        url: "https://zerodha.com/varsity/chapter/intuition-it-may-be-illogical-but-its-a-traders-most-valuable-asset/",
      },
      {
        title: "97. The Power of Positive Imagery",
        url: "https://zerodha.com/varsity/chapter/the-power-of-positive-imagery/",
      },
      {
        title: "98. It’s Not Personal",
        url: "https://zerodha.com/varsity/chapter/its-not-personal/",
      },
      {
        title: "99. Acting On Impulse",
        url: "https://zerodha.com/varsity/chapter/acting-on-impulse/",
      },
      {
        title: "100. Controlling Your Impulses",
        url: "https://zerodha.com/varsity/chapter/controlling-your-impulses/",
      },
      {
        title: "101. Impulsive Trading: Possible Causes and Cures",
        url: "https://zerodha.com/varsity/chapter/impulsive-trading-possible-causes-and-cures/",
      },
      {
        title: "102. Impulse Control Strategies",
        url: "https://zerodha.com/varsity/chapter/impulse-control-strategies/",
      },
      {
        title: "103. Impulse Buys",
        url: "https://zerodha.com/varsity/chapter/impulse-buys/",
      },
      {
        title: "104. Facing Temptation With Discipline",
        url: "https://zerodha.com/varsity/chapter/facing-temptation-with-discipline/",
      },
      {
        title: "105. Increasing the Odds of Success",
        url: "https://zerodha.com/varsity/chapter/increasing-the-odds-of-success/",
      },
      {
        title: "106. The Independent Minded Trader",
        url: "https://zerodha.com/varsity/chapter/the-independent-minded-trader/",
      },
      {
        title: "107. The Independent and Confident Trader",
        url: "https://zerodha.com/varsity/chapter/the-independent-and-confident-trader/",
      },
      {
        title: "108. Independent Minded and Carefree",
        url: "https://zerodha.com/varsity/chapter/independent-minded-and-carefree/",
      },
      {
        title: "109. Striving for Independence",
        url: "https://zerodha.com/varsity/chapter/striving-for-independence/",
      },
      {
        title: "110. Information Anxiety",
        url: "https://zerodha.com/varsity/chapter/information-anxiety/",
      },
      {
        title: "111. In the Mood",
        url: "https://zerodha.com/varsity/chapter/in-the-mood/",
      },
      {
        title: "112. Discovering Your Inner-worth",
        url: "https://zerodha.com/varsity/chapter/discovering-your-inner-worth/",
      },
      {
        title: "113. Looking Inward For Your Mental Edge",
        url: "https://zerodha.com/varsity/chapter/looking-inward-for-your-mental-edge/",
      },
      {
        title: "114. Mastering the Inner-game",
        url: "https://zerodha.com/varsity/chapter/mastering-the-inner-game/",
      },
      {
        title: "115. Appreciating Your Inner-worth",
        url: "https://zerodha.com/varsity/chapter/appreciating-your-inner-worth/",
      },
      {
        title: "116. Putting the Trade in the Right Perspective",
        url: "https://zerodha.com/varsity/chapter/putting-the-trade-in-the-right-perspective/",
      },
      {
        title: "117. Insufficient Justification",
        url: "https://zerodha.com/varsity/chapter/insufficient-justification/",
      },
      {
        title: "118. Stay in the Moment",
        url: "https://zerodha.com/varsity/chapter/stay-in-the-moment/",
      },
      {
        title:
          "119. Buy on Weakness, Sell on Strength: An Example of a Contrary Approach",
        url: "https://zerodha.com/varsity/chapter/buy-on-weakness-sell-on-strength-an-example-of-a-contrary-approach/",
      },
      {
        title: "120. The Intuitive Mind",
        url: "https://zerodha.com/varsity/chapter/the-intuitive-mind/",
      },
      {
        title: "121. Trusting Your Intuition",
        url: "https://zerodha.com/varsity/chapter/trusting-your-intuition/",
      },
      {
        title: "122. Trusting Your Intuition Part 2",
        url: "https://zerodha.com/varsity/chapter/trusting-your-intuition-part-2/",
      },
      {
        title: "123. Using Your Intuition",
        url: "https://zerodha.com/varsity/chapter/using-your-intuition/",
      },
      {
        title: "124. The Intuitive Trader",
        url: "https://zerodha.com/varsity/chapter/the-intuitive-trader/",
      },
      {
        title: "125. When Intuition Fails",
        url: "https://zerodha.com/varsity/chapter/when-intuition-fails/",
      },
      {
        title: "126. Investing in Yourself",
        url: "https://zerodha.com/varsity/chapter/investing-in-yourself/",
      },
      {
        title: "127. Getting the Job Done",
        url: "https://zerodha.com/varsity/chapter/getting-the-job-done/",
      },
      {
        title: "128. An Action-Oriented Approach",
        url: "https://zerodha.com/varsity/chapter/an-action-oriented-approach/",
      },
      {
        title: "129. Be Adaptive",
        url: "https://zerodha.com/varsity/chapter/be-adaptive/",
      },
      {
        title: "130. Addicted to Trading",
        url: "https://zerodha.com/varsity/chapter/addicted-to-trading/",
      },
      {
        title: "131. Transformed Through Adversity",
        url: "https://zerodha.com/varsity/chapter/transformed-through-adversity/",
      },
      {
        title: "132. Affirm To Win",
        url: "https://zerodha.com/varsity/chapter/affirm-to-win/",
      },
      {
        title: "133. What Is a Good Company?",
        url: "https://zerodha.com/varsity/chapter/what-is-a-good-company/",
      },
      {
        title: "134. All By Myself and Loving It",
        url: "https://zerodha.com/varsity/chapter/all-by-myself-and-loving-it/",
      },
      {
        title: "135. You Don’t Need To Be Perfect To Win",
        url: "https://zerodha.com/varsity/chapter/you-dont-need-to-be-perfect-to-win/",
      },
      {
        title:
          "136. Alternative Rewards: A Way to Keep Trading During Setbacks",
        url: "https://zerodha.com/varsity/chapter/alternative-rewards-a-way-to-keep-trading-during-setbacks/",
      },
      {
        title: "137. Driving Ambition",
        url: "https://zerodha.com/varsity/chapter/driving-ambition/",
      },
      {
        title: "138. A Must Trade: Sometimes It’s Better To Stand Aside",
        url: "https://zerodha.com/varsity/chapter/a-must-trade-sometimes-its-better-to-stand-aside/",
      },
      {
        title: "139. Analysis Paralysis",
        url: "https://zerodha.com/varsity/chapter/analysis-paralysis/",
      },
      {
        title: "140. Anticipating Outcomes",
        url: "https://zerodha.com/varsity/chapter/anticipating-outcomes/",
      },
      {
        title: "141. Avoid a Potential Disaster: Anticipate Earnings Reports",
        url: "https://zerodha.com/varsity/chapter/avoid-a-potential-disaster-anticipate-earnings-reports/",
      },
      {
        title: "142. Don’t Be Caught Off-Guard: The Art of Anticipation",
        url: "https://zerodha.com/varsity/chapter/dont-be-caught-off-guard-the-art-of-anticipation/",
      },
      {
        title: "143. Keeping Up Appearances: A Dangerous Activity",
        url: "https://zerodha.com/varsity/chapter/keeping-up-appearances-a-dangerous-activity/",
      },
      {
        title: "144. Getting in Sync with the Market",
        url: "https://zerodha.com/varsity/chapter/getting-in-sync-with-the-market/",
      },
      {
        title: "145. Don’t Get Too Attached",
        url: "https://zerodha.com/varsity/chapter/dont-get-too-attached/",
      },
      {
        title: "146. The Automatic Trader",
        url: "https://zerodha.com/varsity/chapter/the-automatic-trader/",
      },
      {
        title: "147. Dare To Be Average",
        url: "https://zerodha.com/varsity/chapter/dare-to-be-average/",
      },
      {
        title: "148. Avoid Denial: Confront Unacceptable Ideas",
        url: "https://zerodha.com/varsity/chapter/avoid-denial-confront-unacceptable-ideas/",
      },
      {
        title: "149. The Background Factors That Throw Us Off",
        url: "https://zerodha.com/varsity/chapter/the-background-factors-that-throw-us-off/",
      },
      {
        title: "150. One More Thing in the Back of Your Mind",
        url: "https://zerodha.com/varsity/chapter/one-more-thing-in-the-back-of-your-mind/",
      },
      {
        title: "151. When You Fall Off the Horse",
        url: "https://zerodha.com/varsity/chapter/when-you-fall-off-the-horse/",
      },
      {
        title: "152. Getting Back Up",
        url: "https://zerodha.com/varsity/chapter/getting-back-up/",
      },
      {
        title: "153. Emotional Baggage: How to Unload It",
        url: "https://zerodha.com/varsity/chapter/emotional-baggage-how-to-unload-it/",
      },
      {
        title: "154. Happy Traders Seek Out Balance",
        url: "https://zerodha.com/varsity/chapter/happy-traders-seek-out-balance/",
      },
      {
        title: "155. Balanced Optimism",
        url: "https://zerodha.com/varsity/chapter/balanced-optimism/",
      },
      {
        title: "156. Beaten But Still Hanging In There",
        url: "https://zerodha.com/varsity/chapter/beaten-but-still-hanging-in-there/",
      },
      {
        title: "157. Beat Stress Before It Beats You",
        url: "https://zerodha.com/varsity/chapter/beat-stress-before-it-beats-you/",
      },
      {
        title: "158. Who’s Behind the Curtain?",
        url: "https://zerodha.com/varsity/chapter/whos-behind-the-curtain/",
      },
      {
        title: "159. Appreciating the Beauty of the Markets",
        url: "https://zerodha.com/varsity/chapter/appreciating-the-beauty-of-the-markets/",
      },
      {
        title: "160. The Best Laid Plans",
        url: "https://zerodha.com/varsity/chapter/the-best-laid-plans/",
      },
      {
        title: "161. Don’t Be Afraid To Be Yourself",
        url: "https://zerodha.com/varsity/chapter/dont-be-afraid-to-be-yourself/",
      },
      {
        title: "162. How Accurately Do You Track Your Performance?",
        url: "https://zerodha.com/varsity/chapter/how-accurately-do-you-track-your-performance/",
      },
      {
        title: "163. Getting Ready for the One Big Moment",
        url: "https://zerodha.com/varsity/chapter/getting-ready-for-the-one-big-moment/",
      },
      {
        title: "164. The Big Picture",
        url: "https://zerodha.com/varsity/chapter/the-big-picture/",
      },
      {
        title: "165. Taking Big Risks",
        url: "https://zerodha.com/varsity/chapter/taking-big-risks/",
      },
      {
        title: "166. The Big Win",
        url: "https://zerodha.com/varsity/chapter/the-big-win/",
      },
      {
        title: "167. Paying Your Dues",
        url: "https://zerodha.com/varsity/chapter/paying-your-dues/",
      },
      {
        title: "168. Fighting Boredom",
        url: "https://zerodha.com/varsity/chapter/fighting-boredom/",
      },
      {
        title: "169. Don’t Overwork: Take a Break",
        url: "https://zerodha.com/varsity/chapter/dont-overwork-take-a-break/",
      },
      {
        title: "170. Breaking Away From the Herd",
        url: "https://zerodha.com/varsity/chapter/breaking-away-from-the-herd/",
      },
      {
        title: "171. The Breakeven Point",
        url: "https://zerodha.com/varsity/chapter/the-breakeven-point/",
      },
      {
        title: "172. Out with the old and in with the new",
        url: "https://zerodha.com/varsity/chapter/out-with-the-old-and-in-with-the-new/",
      },
      {
        title: "173. Looking on the Bright Side",
        url: "https://zerodha.com/varsity/chapter/looking-on-the-bright-side/",
      },
      {
        title: "174. A Brutally Honest Look",
        url: "https://zerodha.com/varsity/chapter/a-brutally-honest-look/",
      },
      {
        title: "175. Easing the Burden of Decision",
        url: "https://zerodha.com/varsity/chapter/easing-the-burden-of-decision/",
      },
      {
        title: "176. Hustle and Bustle Trading",
        url: "https://zerodha.com/varsity/chapter/hustle-and-bustle-trading/",
      },
      {
        title: "177. Stranded But Profitable",
        url: "https://zerodha.com/varsity/chapter/stranded-but-profitable/",
      },
      {
        title: "178. Staying Calm Under Pressure",
        url: "https://zerodha.com/varsity/chapter/staying-calm-under-pressure/",
      },
      {
        title: "179. Maintaining a Carefree Attitude",
        url: "https://zerodha.com/varsity/chapter/maintaining-a-carefree-attitude/",
      },
      {
        title: "180. Carefree and Easy",
        url: "https://zerodha.com/varsity/chapter/carefree-and-easy/",
      },
      {
        title: "181. Cautious Optimism",
        url: "https://zerodha.com/varsity/chapter/cautious-optimism/",
      },
      {
        title: "182. The Centered Trader",
        url: "https://zerodha.com/varsity/chapter/the-centered-trader/",
      },
      {
        title: "183. Motivated To Change",
        url: "https://zerodha.com/varsity/chapter/motivated-to-change/",
      },
      {
        title: "184. What Do You Do When the Markets Change?",
        url: "https://zerodha.com/varsity/chapter/what-do-you-do-when-the-markets-change/",
      },
      {
        title: "185. Classic Chart Patterns: Know How to Use Them",
        url: "https://zerodha.com/varsity/chapter/classic-chart-patterns-know-how-to-use-them/",
      },
      {
        title: "186. Accepting the Chaos",
        url: "https://zerodha.com/varsity/chapter/accepting-the-chaos/",
      },
      {
        title: "187. Clear and Immediate Payoffs",
        url: "https://zerodha.com/varsity/chapter/clear-and-immediate-payoffs/",
      },
      {
        title: "188. At Least You Know What to Expect",
        url: "https://zerodha.com/varsity/chapter/at-least-you-know-what-to-expect/",
      },
      {
        title: "189. Facing the Cold, Hard Facts",
        url: "https://zerodha.com/varsity/chapter/facing-the-cold-hard-facts/",
      },
      {
        title: "190. The Big Comeback",
        url: "https://zerodha.com/varsity/chapter/the-big-comeback/",
      },
      {
        title: "191. Appreciating Your Comfort Zone",
        url: "https://zerodha.com/varsity/chapter/appreciating-your-comfort-zone/",
      },
      {
        title: "192. Going All the Way",
        url: "https://zerodha.com/varsity/chapter/going-all-the-way/",
      },
      {
        title: "193. Matching Commitments To Expectations",
        url: "https://zerodha.com/varsity/chapter/matching-commitments-to-expectations/",
      },
      {
        title: "194. Commit to Trading Success",
        url: "https://zerodha.com/varsity/chapter/commit-to-trading-success/",
      },
      {
        title: "195. Comparisons Can Be Harmful To Your Ego",
        url: "https://zerodha.com/varsity/chapter/comparisons-can-be-harmful-to-your-ego/",
      },
      {
        title: "196. The Detrimental Comparison",
        url: "https://zerodha.com/varsity/chapter/the-detrimental-comparison/",
      },
      {
        title: "197. Keep to Yourself and Trade Independently",
        url: "https://zerodha.com/varsity/chapter/keep-to-yourself-and-trade-independently/",
      },
      {
        title: "198. The Competitive Spirit: Learn to Tame It",
        url: "https://zerodha.com/varsity/chapter/the-competitive-spirit-learn-to-tame-it/",
      },
      {
        title: "199. Drawn to Complexity: When Keeping it Simple is Better",
        url: "https://zerodha.com/varsity/chapter/drawn-to-complexity-when-keeping-it-simple-is-better/",
      },
      {
        title: "200. Complex and Always in Flux",
        url: "https://zerodha.com/varsity/chapter/complex-and-always-in-flux/",
      },
      {
        title: "201. Full and Intense Concentration",
        url: "https://zerodha.com/varsity/chapter/full-and-intense-concentration/",
      },
      {
        title: "202. The Art of Concentration",
        url: "https://zerodha.com/varsity/chapter/the-art-of-concentration/",
      },
      {
        title: "203. Self-confidence: A Prerequisite for Financial Success",
        url: "https://zerodha.com/varsity/chapter/self-confidence-a-prerequisite-for-financial-success/",
      },
      {
        title: "204. The Confident Trader",
        url: "https://zerodha.com/varsity/chapter/the-confident-trader/",
      },
      {
        title: "205. The Self-Confident Trader",
        url: "https://zerodha.com/varsity/chapter/the-self-confident-trader/",
      },
      {
        title: "206. Pleasant Moods Reduce Confirmation Bias",
        url: "https://zerodha.com/varsity/chapter/pleasant-moods-reduce-confirmation-bias/",
      },
      {
        title: "207. Don’t Be Afraid to Go Your Own Way",
        url: "https://zerodha.com/varsity/chapter/dont-be-afraid-to-go-your-own-way/",
      },
      {
        title: "208. You Can Go Your Own Way",
        url: "https://zerodha.com/varsity/chapter/you-can-go-your-own-way/",
      },
      {
        title: "209. The Consistent Trader",
        url: "https://zerodha.com/varsity/chapter/the-consistent-trader/",
      },
      {
        title: "210. The Quest for Consistency",
        url: "https://zerodha.com/varsity/chapter/the-quest-for-consistency/",
      },
      {
        title: "211. Don’t Catch a Bad Mood",
        url: "https://zerodha.com/varsity/chapter/dont-catch-a-bad-mood/",
      },
      {
        title: "212. Contagious Behavior of the Mass",
        url: "https://zerodha.com/varsity/chapter/contagious-behavior-of-the-mass/",
      },
      {
        title: "213. Contagious Moods: Don’t Catch a Bad Mood",
        url: "https://zerodha.com/varsity/chapter/contagious-moods-dont-catch-a-bad-mood/",
      },
      {
        title: "214. Overcoming an Emotional Vulnerability to Losses",
        url: "https://zerodha.com/varsity/chapter/overcoming-an-emotional-vulnerability-to-losses/",
      },
      {
        title: "215. Don’t Let Your Profits Define Your Self-Worth",
        url: "https://zerodha.com/varsity/chapter/dont-let-your-profits-define-your-self-worth/",
      },
      {
        title: "216. Going Your Own Way",
        url: "https://zerodha.com/varsity/chapter/going-your-own-way/",
      },
      {
        title: "217. Breaking Away From the Masses",
        url: "https://zerodha.com/varsity/chapter/breaking-away-from-the-masses/",
      },
      {
        title: "218. The Courage to Follow Your Gut",
        url: "https://zerodha.com/varsity/chapter/the-courage-to-follow-your-gut/",
      },
      {
        title: "219. Controlling Your Impulses",
        url: "https://zerodha.com/varsity/chapter/controlling-your-impulses-2/",
      },
      {
        title: "220. Self-Controlled and Profitable",
        url: "https://zerodha.com/varsity/chapter/self-controlled-and-profitable/",
      },
      {
        title: "221. Self-Control: A Limited Resource",
        url: "https://zerodha.com/varsity/chapter/self-control-a-limited-resource/",
      },
      {
        title: "222. Coping with Uncertainty",
        url: "https://zerodha.com/varsity/chapter/coping-with-uncertainty/",
      },
      {
        title: "223. Learn the Rules Before You Decide to Break Them",
        url: "https://zerodha.com/varsity/chapter/learn-the-rules-before-you-decide-to-break-them/",
      },
      {
        title: "224. How Do You Talk Trading?",
        url: "https://zerodha.com/varsity/chapter/how-do-you-talk-trading/",
      },
      {
        title: "225. Coping Gracefully",
        url: "https://zerodha.com/varsity/chapter/coping-gracefully/",
      },
      {
        title: "226. Coping Skillfully To Achieve Success",
        url: "https://zerodha.com/varsity/chapter/coping-skillfully-to-achieve-success/",
      },
      {
        title: "227. The Courageous Trader",
        url: "https://zerodha.com/varsity/chapter/the-courageous-trader/",
      },
      {
        title: "228. Cracking Under Pressure",
        url: "https://zerodha.com/varsity/chapter/cracking-under-pressure/",
      },
      {
        title: "229. Your Creative Potential",
        url: "https://zerodha.com/varsity/chapter/your-creative-potential/",
      },
      {
        title: "230. Creative, Winning Trading Plans",
        url: "https://zerodha.com/varsity/chapter/creative-winning-trading-plans/",
      },
      {
        title: "231. A New Creative Idea",
        url: "https://zerodha.com/varsity/chapter/a-new-creative-idea/",
      },
      {
        title: "232. Behavioral Finance: A More Credible Field",
        url: "https://zerodha.com/varsity/chapter/behavioral-finance-a-more-credible-field/",
      },
      {
        title: "233. Maintaining a Crystal Clear Perspective",
        url: "https://zerodha.com/varsity/chapter/maintaining-a-crystal-clear-perspective/",
      },
      {
        title: "234. The Cynic and the Realist",
        url: "https://zerodha.com/varsity/chapter/the-cynic-and-the-realist/",
      },
      {
        title: "235. For the Love of Data",
        url: "https://zerodha.com/varsity/chapter/for-the-love-of-data/",
      },
      {
        title: "236. Matching Expectations To Skill Level",
        url: "https://zerodha.com/varsity/chapter/matching-expectations-to-skill-level/",
      },
      {
        title: "237. Decisive and Responsible Trading",
        url: "https://zerodha.com/varsity/chapter/decisive-and-responsible-trading/",
      },
      {
        title: "238. Taking Quick, Decisive Action",
        url: "https://zerodha.com/varsity/chapter/taking-quick-decisive-action/",
      },
      {
        title: "239. Decision-Making Biases: A Primer",
        url: "https://zerodha.com/varsity/chapter/decision-making-biases-a-primer/",
      },
      {
        title: "240. Decision Making Styles",
        url: "https://zerodha.com/varsity/chapter/decision-making-styles/",
      },
      {
        title: "241. Realistically on the Defensive",
        url: "https://zerodha.com/varsity/chapter/realistically-on-the-defensive/",
      },
      {
        title: "242. The Cautious and Deliberate Trader",
        url: "https://zerodha.com/varsity/chapter/the-cautious-and-deliberate-trader/",
      },
      {
        title: "243. Trying to Stay Detached",
        url: "https://zerodha.com/varsity/chapter/trying-to-stay-detached/",
      },
      {
        title: "244. Stay Detached and Impersonal: It’s Not Always About You",
        url: "https://zerodha.com/varsity/chapter/stay-detached-and-impersonal-its-not-always-about-you/",
      },
      {
        title: "245. Don’t Take It Personally",
        url: "https://zerodha.com/varsity/chapter/dont-take-it-personally/",
      },
      {
        title: "246. Detached and Objective",
        url: "https://zerodha.com/varsity/chapter/detached-and-objective/",
      },
      {
        title: "247. Diary of Your Thoughts",
        url: "https://zerodha.com/varsity/chapter/dairy-of-your-thoughts/",
      },
      {
        title: "248. Stop Kicking Yourself For Making An Obvious Mistake",
        url: "https://zerodha.com/varsity/chapter/stop-kicking-yourself-for-making-an-obvious-mistake/",
      },
      {
        title: "249. Winning Traders Are Disciplined",
        url: "https://zerodha.com/varsity/chapter/winning-traders-are-disciplined/",
      },
      {
        title: "250. Dynamics of Discipline",
        url: "https://zerodha.com/varsity/chapter/dynamics-of-discipline/",
      },
      {
        title: "251. Maintaining Discipline",
        url: "https://zerodha.com/varsity/chapter/maintaining-discipline/",
      },
      {
        title: "252. Increasing Discipline and Self-Control",
        url: "https://zerodha.com/varsity/chapter/increasing-discipline-and-self-control/",
      },
      {
        title: "253. Discipline Takes Practice",
        url: "https://zerodha.com/varsity/chapter/discipline-takes-practice/",
      },
      {
        title: "254. Discipline and Self Control: Monitor It and Increase It",
        url: "https://zerodha.com/varsity/chapter/discipline-and-self-control-monitor-it-and-increase-it/",
      },
      {
        title: "255. The Quest for Discipline",
        url: "https://zerodha.com/varsity/chapter/the-quest-for-discipline/",
      },
      {
        title:
          "256. Maintaining Discipline: When Past Choices Influence Future Decisions",
        url: "https://zerodha.com/varsity/chapter/maintaining-discipline-when-past-choices-influence-future-decisions/",
      },
      {
        title: "257. The Disconnected Self",
        url: "https://zerodha.com/varsity/chapter/the-disconnected-self/",
      },
      {
        title: "258. False Hope",
        url: "https://zerodha.com/varsity/chapter/false-hope/",
      },
      {
        title: "259. Extreme Patience",
        url: "https://zerodha.com/varsity/chapter/extreme-patience/",
      },
      {
        title: "260. Building On What You Do Best",
        url: "https://zerodha.com/varsity/chapter/building-on-what-you-do-best/",
      },
      {
        title: "261. They Say It Couldn’t Be Done",
        url: "https://zerodha.com/varsity/chapter/they-say-it-couldnt-be-done-2/",
      },
      {
        title: "262. The Drama of the Markets",
        url: "https://zerodha.com/varsity/chapter/the-drama-of-the-markets/",
      },
      {
        title: "263. The Drawdown Mentality",
        url: "https://zerodha.com/varsity/chapter/the-drawdown-mentality/",
      },
      {
        title: "264. Don’t Make a Drawdown Even Worse",
        url: "https://zerodha.com/varsity/chapter/dont-make-a-drawdown-even-worse/",
      },
      {
        title: "265. Just Drop It and Move On",
        url: "https://zerodha.com/varsity/chapter/just-drop-it-and-move-on/",
      },
      {
        title: "266. Are You Preparing For a Crash?",
        url: "https://zerodha.com/varsity/chapter/are-you-preparing-for-a-crash/",
      },
      {
        title: "267. Developing Your Psychological Edge",
        url: "https://zerodha.com/varsity/chapter/developing-your-psychological-edge/",
      },
      {
        title: "268. The Efficient and Successful Trader",
        url: "https://zerodha.com/varsity/chapter/the-efficient-and-successful-trader/",
      },
      {
        title: "269. Taking It One Step at a Time",
        url: "https://zerodha.com/varsity/chapter/taking-it-one-step-at-a-time/",
      },
      {
        title: "270. Slowing Building Up True Self-Confidence",
        url: "https://zerodha.com/varsity/chapter/slowing-building-up-true-self-confidence/",
      },
      {
        title: "271. A Big Ego Boost",
        url: "https://zerodha.com/varsity/chapter/a-big-ego-boost/",
      },
      {
        title: "272. The Big Ego: Knowing When To Control It",
        url: "https://zerodha.com/varsity/chapter/the-big-ego-knowing-when-to-control-it/",
      },
      {
        title: "273. Combating Ego Shock",
        url: "https://zerodha.com/varsity/chapter/combating-ego-shock/",
      },
      {
        title: "274. Motivating Emotions",
        url: "https://zerodha.com/varsity/chapter/motivating-emotions/",
      },
      {
        title: "275. Emotion Control Isn’t Emotional Suppression",
        url: "https://zerodha.com/varsity/chapter/emotion-control-isnt-emotional-suppression/",
      },
      {
        title: "276. The Emotionally Controlled Trader",
        url: "https://zerodha.com/varsity/chapter/the-emotionally-controlled-trader/",
      },
      {
        title: "277. Emotional Influences on Trading Decisions",
        url: "https://zerodha.com/varsity/chapter/emotional-influences-on-trading-decisions/",
      },
      {
        title: "278. Building Up Your Emotional Resilience",
        url: "https://zerodha.com/varsity/chapter/building-up-your-emotional-resilience/",
      },
      {
        title: "279. A Time and Place For Emotions",
        url: "https://zerodha.com/varsity/chapter/a-time-and-place-for-emotions/",
      },
      {
        title: "280. Emotions in Context",
        url: "https://zerodha.com/varsity/chapter/emotions-in-context/",
      },
      {
        title: "281. Emotions and Trading",
        url: "https://zerodha.com/varsity/chapter/emotions-and-trading/",
      },
      {
        title: "282. Do the Ends Justify the Means?",
        url: "https://zerodha.com/varsity/chapter/do-the-ends-justify-the-means/",
      },
      {
        title: "283. Enjoying the Trading Experience",
        url: "https://zerodha.com/varsity/chapter/enjoying-the-trading-experience/",
      },
      {
        title: "284. Your Proper Trading Environment",
        url: "https://zerodha.com/varsity/chapter/your-proper-trading-environment/",
      },
      {
        title: "285. Genuine Self-Esteem: The Key to Independent Thinking",
        url: "https://zerodha.com/varsity/chapter/genuine-self-esteem-the-key-to-independent-thinking/",
      },
      {
        title: "286. Win or Lose: You Are A Winner Every Day",
        url: "https://zerodha.com/varsity/chapter/win-or-lose-you-are-a-winner-every-day/",
      },
      {
        title: "287. Fighting the Boredom",
        url: "https://zerodha.com/varsity/chapter/fighting-the-boredom/",
      },
      {
        title: "288. Expanding Your Psychological Limits",
        url: "https://zerodha.com/varsity/chapter/expanding-your-psychological-limits/",
      },
      {
        title: "289. Getting Even With the Markets",
        url: "https://zerodha.com/varsity/chapter/getting-even-with-the-markets/",
      },
      {
        title: "290. Set Realistic Expectations",
        url: "https://zerodha.com/varsity/chapter/set-realistic-expectations/",
      },
      {
        title: "291. Accepting a Potential Loss: A Skill to Develop",
        url: "https://zerodha.com/varsity/chapter/accepting-a-potential-loss-a-skill-to-develop/",
      },
      {
        title:
          "292. Learning By Doing: The Benefits of Gaining Real World Experience",
        url: "https://zerodha.com/varsity/chapter/learning-by-doing-the-benefits-of-gaining-real-world-experience/",
      },
      {
        title: "293. Getting the Job Done",
        url: "https://zerodha.com/varsity/chapter/getting-the-job-done-2/",
      },
      {
        title: "294. Don’t Deliberate; Just Do It",
        url: "https://zerodha.com/varsity/chapter/dont-deliberate-just-do-it/",
      },
      {
        title: "295. Trading With Discipline",
        url: "https://zerodha.com/varsity/chapter/trading-with-discipline/",
      },
      {
        title: "296. Justified versus Unjustified Wins",
        url: "https://zerodha.com/varsity/chapter/justified-versus-unjustified-wins/",
      },
      {
        title: "297. Riding the Wave Works…Sometimes",
        url: "https://zerodha.com/varsity/chapter/riding-the-wave-workssometimes/",
      },
      {
        title: "298. Keep It to Yourself",
        url: "https://zerodha.com/varsity/chapter/keep-it-to-yourself/",
      },
      {
        title: "299. The Art of Knowing",
        url: "https://zerodha.com/varsity/chapter/the-art-of-knowing/",
      },
      {
        title: "300. Acknowledge Limitations But Think Positively",
        url: "https://zerodha.com/varsity/chapter/acknowledge-limitations-but-think-positively/",
      },
      {
        title: "301. Consider All Possibilities",
        url: "https://zerodha.com/varsity/chapter/consider-all-possibilities/",
      },
      {
        title: "302. Seeking Learning Goals",
        url: "https://zerodha.com/varsity/chapter/learning-from-past-mistakes/",
      },
      {
        title: "303. Goal Setting: Don’t Set Performance Goals Too High",
        url: "https://zerodha.com/varsity/chapter/goal-setting-dont-set-performance-goals-too-high/",
      },
      {
        title: "304. Learning From Past Mistakes",
        url: "https://zerodha.com/varsity/chapter/learning-from-past-mistakes-2/",
      },
      {
        title: "305. Accepting Inconsistency and Uncertainty",
        url: "https://zerodha.com/varsity/chapter/accepting-inconsistency-and-uncertainty/",
      },
      {
        title: "306. Letting Go of the Past",
        url: "https://zerodha.com/varsity/chapter/letting-go-of-the-past/",
      },
      {
        title: "307. Psychological Limits of the Mind",
        url: "https://zerodha.com/varsity/chapter/psychological-limits-of-the-mind/",
      },
      {
        title: "308. The Little Things That Get In The Way",
        url: "https://zerodha.com/varsity/chapter/thinking-of-the-big-picture/",
      },
      {
        title: "309. Living With Reality",
        url: "https://zerodha.com/varsity/chapter/living-with-reality/",
      },
      {
        title: "310. Thinking of the Big Picture",
        url: "https://zerodha.com/varsity/chapter/thinking-of-the-big-picture-2/",
      },
      {
        title: "311. Losing Your Money and Objectivity",
        url: "https://zerodha.com/varsity/chapter/losing-your-money-and-objectivity/",
      },
      {
        title: "312. Cutting Your Losses",
        url: "https://zerodha.com/varsity/chapter/cutting-your-losses/",
      },
      {
        title: "313. The Complex Emotions of Loss",
        url: "https://zerodha.com/varsity/chapter/the-complex-emotions-of-loss/",
      },
      {
        title: "314. Taking a Loss: Getting Over It Isn’t Always Easy",
        url: "https://zerodha.com/varsity/chapter/taking-a-loss-getting-over-it-isnt-always-easy/",
      },
      {
        title: "315. Learning How to Take a Loss",
        url: "https://zerodha.com/varsity/chapter/learning-how-to-take-a-loss/",
      },
      {
        title: "316. It’s Just a Loss, Isn’t It?",
        url: "https://zerodha.com/varsity/chapter/its-just-a-loss-isnt-it/",
      },
      {
        title: "317. Turning a Loss Into a Gain",
        url: "https://zerodha.com/varsity/chapter/turning-a-loss-into-a-gain/",
      },
      {
        title: "318. Don’t Let a Setback Get You Down",
        url: "https://zerodha.com/varsity/chapter/dont-let-a-setback-get-you-down/",
      },
      {
        title: "319. Rekindle Your Hidden Passion for Trading",
        url: "https://zerodha.com/varsity/chapter/rekindle-your-hidden-passion-for-trading/",
      },
      {
        title: "320. The Lottery Mindset",
        url: "https://zerodha.com/varsity/chapter/the-lottery-mindset/",
      },
      {
        title: "321. Trading for the Pure Love of the Game",
        url: "https://zerodha.com/varsity/chapter/trading-for-the-pure-love-of-the-game/",
      },
      {
        title: "322. When Low Probability Setups Seem Attractive",
        url: "https://zerodha.com/varsity/chapter/when-low-probability-setups-seem-attractive/",
      },
      {
        title: "323. Enduring Success",
        url: "https://zerodha.com/varsity/chapter/enduring-success/",
      },
      {
        title: "324. Don’t Make the Odds Even Lower",
        url: "https://zerodha.com/varsity/chapter/dont-make-the-odds-even-lower/",
      },
      {
        title: "325. Money Management and the Big Picture",
        url: "https://zerodha.com/varsity/chapter/money-management-and-the-big-picture/",
      },
      {
        title: "326. Staying Calm Through the Ups and Downs",
        url: "https://zerodha.com/varsity/chapter/staying-calm-through-the-ups-and-downs/",
      },
      {
        title: "327. The Dangers of Anthropomorphizing the Market",
        url: "https://zerodha.com/varsity/chapter/the-dangers-of-anthropomorphizing-the-market/",
      },
      {
        title: "328. Staying Ahead of Market Moods",
        url: "https://zerodha.com/varsity/chapter/staying-ahead-of-market-moods/",
      },
      {
        title: "329. Another Martha Story",
        url: "https://zerodha.com/varsity/chapter/another-martha-story/",
      },
      {
        title: "330. Media News and the Behavior of the Masses",
        url: "https://zerodha.com/varsity/chapter/media-news-and-the-behavior-of-the-masses/",
      },
      {
        title: "331. Sharpening Your Mental Edge",
        url: "https://zerodha.com/varsity/chapter/sharpening-your-mental-edge/",
      },
      {
        title: "332. Remember to Celebrate: You Deserve It",
        url: "https://zerodha.com/varsity/chapter/remember-to-celebrate-you-deserve-it/",
      },
      {
        title: "333. Mean Reversion: When Prices Fail to Meet Expectations",
        url: "https://zerodha.com/varsity/chapter/mean-reversion-when-prices-fail-to-meet-expectations/",
      },
      {
        title: "334. A Quiet and Meditative Place",
        url: "https://zerodha.com/varsity/chapter/a-quiet-and-meditative-place/",
      },
      {
        title: "335. Moving Beyond Mediocrity",
        url: "https://zerodha.com/varsity/chapter/moving-beyond-mediocrity/",
      },
      {
        title: "336. It’s About You and No One Else",
        url: "https://zerodha.com/varsity/chapter/its-about-you-and-no-one-else/",
      },
      {
        title: "337. Increasing Mental Capacity",
        url: "https://zerodha.com/varsity/chapter/increasing-mental-capacity/",
      },
      {
        title: "338. The Disciplined Mindset",
        url: "https://zerodha.com/varsity/chapter/the-disciplined-mindset/",
      },
      {
        title: "339. Minimizing the Impact",
        url: "https://zerodha.com/varsity/chapter/minimizing-the-impact/",
      },
      {
        title: "340. Matching Your Trading Goals To Your Skills",
        url: "https://zerodha.com/varsity/chapter/matching-your-trading-goals-to-your-skills/",
      },
      {
        title: "341. Fear of Leaving Money on the Table",
        url: "https://zerodha.com/varsity/chapter/fear-of-leaving-money-on-the-table/",
      },
      {
        title: "342. Appreciating the Moment",
        url: "https://zerodha.com/varsity/chapter/appreciating-the-moment/",
      },
      {
        title: "343. Building Mental Momentum",
        url: "https://zerodha.com/varsity/chapter/building-mental-momentum/",
      },
      {
        title: "344. It’s For the Money",
        url: "https://zerodha.com/varsity/chapter/its-for-the-money/",
      },
      {
        title: "345. Mood Repair: How To Do It and When It Works",
        url: "https://zerodha.com/varsity/chapter/controlling-your-mood-and-maintaining-discipline/",
      },
      {
        title: "346. Mood Repair: How To Do It and When It Works",
        url: "https://zerodha.com/varsity/chapter/mood-repair-how-to-do-it-and-when-it-works/",
      },
      {
        title: "347. Getting Motivated and Ready to Go",
        url: "https://zerodha.com/varsity/chapter/getting-motivated-and-ready-to-go/",
      },
      {
        title: "348. Motivating Images",
        url: "https://zerodha.com/varsity/chapter/motivating-images/",
      },
      {
        title: "349. Trading in a Higher Psychological Sphere",
        url: "https://zerodha.com/varsity/chapter/trading-in-a-higher-psychological-sphere-2/",
      },
      {
        title: "350. Take Time to Recover",
        url: "https://zerodha.com/varsity/chapter/take-time-to-recover/",
      },
      {
        title: "351. Don’t Hesitate, Move On",
        url: "https://zerodha.com/varsity/chapter/dont-hesitate-move-on/",
      },
      {
        title: "352. Taking on Greater Levels of Risk",
        url: "https://zerodha.com/varsity/chapter/taking-on-greater-levels-of-risk/",
      },
      {
        title: "353. Learning To Let Go",
        url: "https://zerodha.com/varsity/chapter/learning-to-let-go/",
      },
      {
        title: "354. The Multi-faceted Self Concept",
        url: "https://zerodha.com/varsity/chapter/the-multi-faceted-self-concept/",
      },
      {
        title: "355. Fighting Murphy’s Law",
        url: "https://zerodha.com/varsity/chapter/fighting-murphys-law/",
      },
      {
        title: "356. Don’t Be So Grandiose",
        url: "https://zerodha.com/varsity/chapter/dont-be-so-grandiose/",
      },
      {
        title: "357. The Natural Born Trader",
        url: "https://zerodha.com/varsity/chapter/the-natural-born-trader/",
      },
      {
        title: "358. You Don’t Always Need To Be Right",
        url: "https://zerodha.com/varsity/chapter/you-dont-always-need-to-be-right/",
      },
      {
        title: "359. A Fresh Start",
        url: "https://zerodha.com/varsity/chapter/a-fresh-start/",
      },
      {
        title: "360. A Brand New Day",
        url: "https://zerodha.com/varsity/chapter/a-brand-new-day/",
      },
      {
        title: "361. Giving Into the Markets",
        url: "https://zerodha.com/varsity/chapter/giving-into-the-markets/",
      },
      {
        title: "362. Seeing a Creative New Idea",
        url: "https://zerodha.com/varsity/chapter/seeing-a-creative-new-idea/",
      },
      {
        title: "363. Accepting the Uncertainty of the Markets",
        url: "https://zerodha.com/varsity/chapter/accepting-the-uncertainty-of-the-markets/",
      },
      {
        title: "364. The Mindset of the Short Term Trader",
        url: "https://zerodha.com/varsity/chapter/the-mindset-of-the-short-term-trader/",
      },
      {
        title: "365. The News of the Day",
        url: "https://zerodha.com/varsity/chapter/the-news-of-the-day/",
      },
      {
        title: "366. Plans for the New Year",
        url: "https://zerodha.com/varsity/chapter/plans-for-the-new-year/",
      },
      {
        title: "367. Trying Not to Care",
        url: "https://zerodha.com/varsity/chapter/trying-not-to-care/",
      },
      {
        title: "368. Nothing to Lose",
        url: "https://zerodha.com/varsity/chapter/nothing-to-lose/",
      },
      {
        title: "369. What’s Next?",
        url: "https://zerodha.com/varsity/chapter/whats-next/",
      },
      {
        title: "370. Objectify the Trade",
        url: "https://zerodha.com/varsity/chapter/objectify-the-trade/",
      },
      {
        title: "371. Don’t Take It Personally: Objectify",
        url: "https://zerodha.com/varsity/chapter/dont-take-it-personally-objectify/",
      },
      {
        title: "372. Finding Objectivity in the Face of Uncertainty",
        url: "https://zerodha.com/varsity/chapter/finding-objectivity-in-the-face-of-uncertainty/",
      },
      {
        title: "373. Objective and Unemotional: The Ideal Mindset",
        url: "https://zerodha.com/varsity/chapter/objective-and-unemotional-the-ideal-mindset/",
      },
      {
        title: "374. It’s Not Personal: Staying Detached and Objective",
        url: "https://zerodha.com/varsity/chapter/its-not-personal-staying-detached-and-objective/",
      },
      {
        title: "375. Remembering the Obvious",
        url: "https://zerodha.com/varsity/chapter/remembering-the-obvious/",
      },
      {
        title: "376. Accentuate the Obvious",
        url: "https://zerodha.com/varsity/chapter/accentuate-the-obvious/",
      },
      {
        title: "377. Overconfidence: Old Habits are Hard to Break",
        url: "https://zerodha.com/varsity/chapter/overconfidence-old-habits-are-hard-to-break/",
      },
      {
        title: "378. Flexible and Open to Change",
        url: "https://zerodha.com/varsity/chapter/flexible-and-open-to-change/",
      },
      {
        title: "379. Open to All Possibilities",
        url: "https://zerodha.com/varsity/chapter/open-to-all-possibilities/",
      },
      {
        title: "380. Winning Traders Are Flexible",
        url: "https://zerodha.com/varsity/chapter/winning-traders-are-flexible/",
      },
      {
        title:
          "381. Don’t Self-Sabotage: Think Optimistically and Take Advantage of New Market Opportunities",
        url: "https://zerodha.com/varsity/chapter/dont-self-sabotage-think-optimistically-and-take-advantage-of-new-market-opportunities/",
      },
      {
        title: "382. Persistence In the Face of Uncertainty",
        url: "https://zerodha.com/varsity/chapter/persistence-in-the-face-of-uncertainty/",
      },
      {
        title: "383. Unrealistic Optimism and Misperceptions of Risk",
        url: "https://zerodha.com/varsity/chapter/unrealistic-optimism-and-misperceptions-of-risk/",
      },
      {
        title: "384. Cool and Organized",
        url: "https://zerodha.com/varsity/chapter/cool-and-organized/",
      },
      {
        title: "385. The Origins of Self-Sabotage",
        url: "https://zerodha.com/varsity/chapter/the-origins-of-self-sabotage/",
      },
      {
        title: "386. Coping with Uncertainty",
        url: "https://zerodha.com/varsity/chapter/coping-with-uncertainty-2/",
      },
      {
        title: "387. Don’t Overanalyze: Just Trade",
        url: "https://zerodha.com/varsity/chapter/dont-overanalyze-just-trade/",
      },
      {
        title: "388. Learning to Defeat Past Learning and Instincts",
        url: "https://zerodha.com/varsity/chapter/learning-to-defeat-past-learning-and-instincts/",
      },
      {
        title: "389. Overcoming Big Setbacks",
        url: "https://zerodha.com/varsity/chapter/overcoming-big-setbacks/",
      },
      {
        title:
          "390. Walking the Tightrope Between Confidence and Overconfidence",
        url: "https://zerodha.com/varsity/chapter/walking-the-tightrope-between-confidence-and-overconfidence/",
      },
      {
        title:
          "391. Handling Unexpected Success and Controlling Overconfidence",
        url: "https://zerodha.com/varsity/chapter/handling-unexpected-success-and-controlling-overconfidence/",
      },
      {
        title: "392. Confident But Not Over-Confident",
        url: "https://zerodha.com/varsity/chapter/confident-but-not-over-confident/",
      },
      {
        title: "393. Overconfidence, Risk, and Rewards",
        url: "https://zerodha.com/varsity/chapter/overconfidence-risk-and-rewards/",
      },
      {
        title: "394. Overconfidence: The Behavioral View",
        url: "https://zerodha.com/varsity/chapter/overconfidence-the-behavioral-view/",
      },
      {
        title: "395. Overconfidence: Cognitive Information Processing",
        url: "https://zerodha.com/varsity/chapter/overconfidence-cognitive-information-processing/",
      },
      {
        title: "396. Controlling Overconfidence",
        url: "https://zerodha.com/varsity/chapter/overconfidence-the-behavioral-view-2/",
      },
      {
        title: "397. The Benefits of Under-Trading",
        url: "https://zerodha.com/varsity/chapter/the-benefits-of-under-trading/",
      },
      {
        title: "398. Overtrading and Bad Ideas",
        url: "https://zerodha.com/varsity/chapter/overtrading-and-bad-ideas/",
      },
      {
        title: "399. Your Own Worst Enemy",
        url: "https://zerodha.com/varsity/chapter/your-own-worst-enemy/",
      },
      {
        title: "400. Finding Your Own Style",
        url: "https://zerodha.com/varsity/chapter/finding-your-own-style/",
      },
      {
        title: "401. Working on Your Own Terms",
        url: "https://zerodha.com/varsity/chapter/working-on-your-own-terms/",
      },
      {
        title: "402. In Your Own Time and On Your Own Terms",
        url: "https://zerodha.com/varsity/chapter/in-your-own-time-and-on-your-own-terms/",
      },
      {
        title: "403. The Calm, Perceptive Trader",
        url: "https://zerodha.com/varsity/chapter/the-calm-perceptive-trader/",
      },
      {
        title: "404. Dealing With Panic",
        url: "https://zerodha.com/varsity/chapter/dealing-with-panic/",
      },
      {
        title: "405. In a State of Panic",
        url: "https://zerodha.com/varsity/chapter/in-a-state-of-panic/",
      },
      {
        title: "406. Paradox of Control",
        url: "https://zerodha.com/varsity/chapter/paradox-of-control/",
      },
      {
        title: "407. The Paranoid Trader",
        url: "https://zerodha.com/varsity/chapter/the-paranoid-trader/",
      },
      {
        title: "408. Holiday Parties: Stay Humble and Quiet",
        url: "https://zerodha.com/varsity/chapter/holiday-parties-stay-humble-and-quiet/",
      },
      {
        title: "409. Passion in Everyday Life",
        url: "https://zerodha.com/varsity/chapter/passion-in-everyday-life/",
      },
      {
        title: "410. Money Isn’t Everything",
        url: "https://zerodha.com/varsity/chapter/money-isnt-everything/",
      },
      {
        title: "411. Following a Passion for Trading",
        url: "https://zerodha.com/varsity/chapter/following-a-passion-for-trading/",
      },
      {
        title: "412. It’s Not the Money, But the Challenge",
        url: "https://zerodha.com/varsity/chapter/its-not-the-money-but-the-challenge/",
      },
      {
        title: "413. Conquering Passivity",
        url: "https://zerodha.com/varsity/chapter/conquering-passivity/",
      },
      {
        title: "414. Overcoming the Past",
        url: "https://zerodha.com/varsity/chapter/overcoming-the-past/",
      },
      {
        title: "415. Patience is a Virtue",
        url: "https://zerodha.com/varsity/chapter/patience-is-a-virtue/",
      },
      {
        title: "416. The Winning Trader is the Patient Trader",
        url: "https://zerodha.com/varsity/chapter/the-winning-trader-is-the-patient-trader/",
      },
      {
        title: "417. Waiting Patiently For Your Financial Dreams To Come True",
        url: "https://zerodha.com/varsity/chapter/waiting-patiently-for-your-financial-dreams-to-come-true/",
      },
      {
        title: "418. Flow and the Peak Performance Mindset",
        url: "https://zerodha.com/varsity/chapter/flow-and-the-peak-performance-mindset/",
      },
      {
        title: "419. You Don’t Need to Be Perfect",
        url: "https://zerodha.com/varsity/chapter/you-dont-need-to-be-perfect/",
      },
      {
        title: "420. Reach for the Sky, But Don’t Overdo It",
        url: "https://zerodha.com/varsity/chapter/reach-for-the-sky-but-dont-overdo-it/",
      },
      {
        title: "421. Making a Change and Making It Stick",
        url: "https://zerodha.com/varsity/chapter/making-a-change-and-making-it-stick/",
      },
      {
        title: "422. Staging A Comeback",
        url: "https://zerodha.com/varsity/chapter/staging-a-comeback/",
      },
      {
        title: "423. The Anatomy of Persistence",
        url: "https://zerodha.com/varsity/chapter/the-anatomy-of-persistence/",
      },
      {
        title: "424. The Ideal Trader Personality: Finding the Right Blend",
        url: "https://zerodha.com/varsity/chapter/the-ideal-trader-personality-finding-the-right-blend/",
      },
      {
        title: "425. Viewing a Single Trade from the Right Perspective",
        url: "https://zerodha.com/varsity/chapter/viewing-a-single-trade-from-the-right-perspective/",
      },
      {
        title: "426. Pessimistic Biases",
        url: "https://zerodha.com/varsity/chapter/pessimistic-biases/",
      },
      {
        title: "427. Pick Yourself Up and Move On",
        url: "https://zerodha.com/varsity/chapter/pick-yourself-up-and-move-on/",
      },
      {
        title: "428. Don’t Plan to Fail",
        url: "https://zerodha.com/varsity/chapter/dont-plan-to-fail/",
      },
      {
        title: "429. Taking the Plunge",
        url: "https://zerodha.com/varsity/chapter/taking-the-plunge/",
      },
      {
        title: "430. Trader as Pollster",
        url: "https://zerodha.com/varsity/chapter/trader-as-pollster/",
      },
      {
        title: "431. Considering All Possibilities",
        url: "https://zerodha.com/varsity/chapter/considering-all-possibilities/",
      },
      {
        title: "432. It Makes Sense When You Think About It, Doesn’t It?",
        url: "https://zerodha.com/varsity/chapter/it-makes-sense-when-you-think-about-it-doesnt-it/",
      },
      {
        title: "433. Power and Control",
        url: "https://zerodha.com/varsity/chapter/power-and-control/",
      },
      {
        title:
          "434. The Difference Between What Should Happen and What Does Happen",
        url: "https://zerodha.com/varsity/chapter/the-difference-between-what-should-happen-and-what-does-happen/",
      },
      {
        title: "435. Self-Control Takes Practice",
        url: "https://zerodha.com/varsity/chapter/self-control-takes-practice/",
      },
      {
        title: "436. Preparing for Losses",
        url: "https://zerodha.com/varsity/chapter/preparing-for-losses/",
      },
      {
        title: "437. Under Pressure",
        url: "https://zerodha.com/varsity/chapter/under-pressure/",
      },
      {
        title: "438. Too Proud to Think Clearly",
        url: "https://zerodha.com/varsity/chapter/too-proud-to-think-clearly/",
      },
      {
        title: "439. It’s the Process that Matters, Not the Prize",
        url: "https://zerodha.com/varsity/chapter/its-the-process-that-matters-not-the-prize/",
      },
      {
        title: "440. Your Mood May Bias Your Estimates of Success",
        url: "https://zerodha.com/varsity/chapter/your-mood-may-bias-your-estimates-of-success/",
      },
      {
        title: "441. Thinking in Terms of Probabilities",
        url: "https://zerodha.com/varsity/chapter/thinking-in-terms-of-probabilities/",
      },
      {
        title: "442. The Unbridled Quest for Profits",
        url: "https://zerodha.com/varsity/chapter/the-unbridled-quest-for-profits/",
      },
      {
        title: "443. The Proper Mindset",
        url: "https://zerodha.com/varsity/chapter/the-proper-mindset/",
      },
      {
        title: "444. A Little Extra Protection Goes a Long Way",
        url: "https://zerodha.com/varsity/chapter/a-little-extra-protection-goes-a-long-way/",
      },
      {
        title: "445. Psychic Income",
        url: "https://zerodha.com/varsity/chapter/psychic-income/",
      },
      {
        title: "446. The Extra Weight of Psychological Baggage",
        url: "https://zerodha.com/varsity/chapter/the-extra-weight-of-psychological-baggage/",
      },
      {
        title: "447. The Masses Can Be Right…Sometimes",
        url: "https://zerodha.com/varsity/chapter/the-masses-can-be-rightsometimes/",
      },
      {
        title: "448. For the Pure Love of the Game",
        url: "https://zerodha.com/varsity/chapter/for-the-pure-love-of-the-game/",
      },
      {
        title: "449. A Little Extra Protection Goes a Long Way",
        url: "https://zerodha.com/varsity/chapter/a-little-extra-protection-goes-a-long-way-2/",
      },
      {
        title: "450. Trading With Purpose",
        url: "https://zerodha.com/varsity/chapter/trading-with-purpose/",
      },
      {
        title: "451. Putting Up a Strong Defense",
        url: "https://zerodha.com/varsity/chapter/putting-up-a-strong-defense/",
      },
      {
        title: "452. Quick Decisions",
        url: "https://zerodha.com/varsity/chapter/quick-decisions/",
      },
      {
        title: "453. Rambo Trader",
        url: "https://zerodha.com/varsity/chapter/rambo-trader/",
      },
      {
        title: "454. Beliefs About Randomness: Do They Impact Profits?",
        url: "https://zerodha.com/varsity/chapter/beliefs-about-randomness-do-they-impact-profits/",
      },
      {
        title: "455. Psyched Up and Ready For Action",
        url: "https://zerodha.com/varsity/chapter/psyched-up-and-ready-for-action/",
      },
      {
        title: "456. Thinking Realistically, Even If It Hurts",
        url: "https://zerodha.com/varsity/chapter/thinking-realistically-even-if-it-hurts/",
      },
      {
        title: "457. Realistic Levels of Commitment",
        url: "https://zerodha.com/varsity/chapter/realistic-levels-of-commitment/",
      },
      {
        title: "458. The Utility of an Optimistic Outlook",
        url: "https://zerodha.com/varsity/chapter/the-utility-of-an-optimistic-outlook/",
      },
      {
        title: "459. Realistic Goals, Realistic Profits",
        url: "https://zerodha.com/varsity/chapter/realistic-goals-realistic-profits/",
      },
      {
        title: "460. Optimistic Yet Realistic",
        url: "https://zerodha.com/varsity/chapter/optimistic-yet-realistic/",
      },
      {
        title: "461. Calm, Relaxed, and Ready to Trade",
        url: "https://zerodha.com/varsity/chapter/calm-relaxed-and-ready-to-trade/",
      },
      {
        title: "462. Realistic and Ready to Trade",
        url: "https://zerodha.com/varsity/chapter/realistic-and-ready-to-trade/",
      },
      {
        title: "463. The Need for Reassurance",
        url: "https://zerodha.com/varsity/chapter/the-need-for-reassurance/",
      },
      {
        title: "464. Rebuilding Momentum",
        url: "https://zerodha.com/varsity/chapter/rebuilding-momentum/",
      },
      {
        title: "465. Reduce Stress During the Trading Day",
        url: "https://zerodha.com/varsity/chapter/reduce-stress-during-the-trading-day/",
      },
      {
        title: "466. Conditioned Reflexes",
        url: "https://zerodha.com/varsity/chapter/conditioned-reflexes/",
      },
      {
        title: "467. Controlled and Relaxed",
        url: "https://zerodha.com/varsity/chapter/controlled-and-relaxed/",
      },
      {
        title: "468. Making A New Beginning",
        url: "https://zerodha.com/varsity/chapter/making-a-new-beginning/",
      },
      {
        title: "469. Mean Reversion: Missing Expectations",
        url: "https://zerodha.com/varsity/chapter/mean-reversion-missing-expectations/",
      },
      {
        title: "470. Regaining Poise, Focus, and Profitability",
        url: "https://zerodha.com/varsity/chapter/c-focus-and-profitability/",
      },
      {
        title: "471. The New Year: A Time for Psychological Renewal",
        url: "https://zerodha.com/varsity/chapter/the-new-year-a-time-for-psychological-renewal/",
      },
      {
        title: "472. Disappointment and Regret: The Other Trading Emotions",
        url: "https://zerodha.com/varsity/chapter/disappointment-and-regret-the-other-trading-emotions/",
      },
      {
        title: "473. Seeking Pride and Avoiding Regret",
        url: "https://zerodha.com/varsity/chapter/seeking-pride-and-avoiding-regret/",
      },
      {
        title: "474. Controlling Disappointment and Regret",
        url: "https://zerodha.com/varsity/chapter/controlling-disappointment-and-regret/",
      },
      {
        title: "475. The Dynamics of Regret",
        url: "https://zerodha.com/varsity/chapter/the-dynamics-of-regret/",
      },
      {
        title: "476. When Regret Motivates",
        url: "https://zerodha.com/varsity/chapter/when-regret-motivates/",
      },
      {
        title: "477. Reprogramming Your Instincts",
        url: "https://zerodha.com/varsity/chapter/resilient-and-ready-for-profits/",
      },
      {
        title: "478. Resilient and Ready For Profits",
        url: "https://zerodha.com/varsity/chapter/resilient-and-ready-for-profits-2/",
      },
      {
        title: "479. Don’t Seek Revenge",
        url: "https://zerodha.com/varsity/chapter/dont-seek-revenge/",
      },
      {
        title: "480. Don’t Forget to Reward Yourself",
        url: "https://zerodha.com/varsity/chapter/dont-forget-to-reward-yourself/",
      },
      {
        title: "481. Everyone Needs R & R",
        url: "https://zerodha.com/varsity/chapter/everyone-needs-r-r/",
      },
      {
        title: "482. New Year’s Resolutions: How to Keep Them",
        url: "https://zerodha.com/varsity/chapter/new-years-resolutions-how-to-keep-them/",
      },
      {
        title: "483. Riding Through the Downers",
        url: "https://zerodha.com/varsity/chapter/riding-through-the-downers/",
      },
      {
        title: "484. Don’t Stress Out: Rest Up During the Holidays",
        url: "https://zerodha.com/varsity/chapter/dont-stress-out-rest-up-during-the-holidays/",
      },
      {
        title: "485. Mad and Ready for Action",
        url: "https://zerodha.com/varsity/chapter/mad-and-ready-for-action/",
      },
      {
        title: "486. Rested, Relaxed, and Ready for the Market Action",
        url: "https://zerodha.com/varsity/chapter/rested-relaxed-and-ready-for-the-market-action/",
      },
      {
        title: "487. Take a Break, Relax, and Rejuvenate",
        url: "https://zerodha.com/varsity/chapter/take-a-break-relax-and-rejuvenate/",
      },
      {
        title: "488. Curbing a Vengeful Spirit",
        url: "https://zerodha.com/varsity/chapter/curbing-a-vengeful-spirit/",
      },
      {
        title: "489. Setting the Right Goals: It Makes All the Difference",
        url: "https://zerodha.com/varsity/chapter/setting-the-right-goals-it-makes-all-the-difference/",
      },
      {
        title: "490. The Right Mindset",
        url: "https://zerodha.com/varsity/chapter/the-right-mindset/",
      },
      {
        title: "491. Finding the Right Mindset",
        url: "https://zerodha.com/varsity/chapter/finding-the-right-mindset/",
      },
      {
        title: "492. Is Risk Management Really Important?",
        url: "https://zerodha.com/varsity/chapter/is-risk-management-really-important/",
      },
      {
        title: "493. To Risk or Not to Risk",
        url: "https://zerodha.com/varsity/chapter/to-risk-or-not-to-risk/",
      },
      {
        title: "494. Cut Your Losses",
        url: "https://zerodha.com/varsity/chapter/cut-your-losses/",
      },
      {
        title: "495. Searching for a Winning Strategy",
        url: "https://zerodha.com/varsity/chapter/searching-for-a-winning-strategy/",
      },
      {
        title: "496. Protecting Your Interests",
        url: "https://zerodha.com/varsity/chapter/protecting-your-interests/",
      },
      {
        title: "497. Taking the Risk and Living with the Consequences",
        url: "https://zerodha.com/varsity/chapter/taking-the-risk-and-living-with-the-consequences/",
      },
      {
        title: "498. Risk Aversion: The Trader’s Fundamental Handicap",
        url: "https://zerodha.com/varsity/chapter/risk-aversion-the-traders-fundamental-handicap/",
      },
      {
        title: "499. Always Manage Risk",
        url: "https://zerodha.com/varsity/chapter/always-manage-risk/",
      },
      {
        title: "500. Accepting Uncertainty and Risk",
        url: "https://zerodha.com/varsity/chapter/accepting-uncertainty-and-risk/",
      },
      {
        title: "501. Accepting and Reducing Risk",
        url: "https://zerodha.com/varsity/chapter/accepting-and-reducing-risk/",
      },
      {
        title: "502. Taking Risks and Reaping Rewards",
        url: "https://zerodha.com/varsity/chapter/taking-risks-and-reaping-rewards/",
      },
      {
        title: "503. Risk Seeking: A Lack of Discipline May Be Personal",
        url: "https://zerodha.com/varsity/chapter/risk-seeking-a-lack-of-discipline-may-be-personal/",
      },
      {
        title: "504. Security or Excitement: Which Do You Prefer?",
        url: "https://zerodha.com/varsity/chapter/security-or-excitement-which-do-you-prefer/",
      },
      {
        title: "505. Rock Solid Confidence",
        url: "https://zerodha.com/varsity/chapter/rock-solid-confidence/",
      },
      {
        title: "506. Rogue Trader: Hiding Out From Yourself and Others",
        url: "https://zerodha.com/varsity/chapter/rogue-trader-hiding-out-from-yourself-and-others/",
      },
      {
        title: "507. Don’t Get Stuck in a Rut: Get Out Fast",
        url: "https://zerodha.com/varsity/chapter/dont-get-stuck-in-a-rut-get-out-fast/",
      },
      {
        title: "508. Self-Sabotage: Identify the Tendency Early",
        url: "https://zerodha.com/varsity/chapter/self-sabotage-identify-the-tendency-early/",
      },
      {
        title: "509. The Right Place at the Right Time",
        url: "https://zerodha.com/varsity/chapter/the-right-place-at-the-right-time/",
      },
      {
        title: "510. Rosy Glow Optimists Versus Defensive Pessimists",
        url: "https://zerodha.com/varsity/chapter/rosy-glow-optimists-versus-defensive-pessimists/",
      },
      {
        title: "511. Risk Tolerance: How Much Safety Do You Need?",
        url: "https://zerodha.com/varsity/chapter/risk-tolerance-how-much-safety-do-you-need/",
      },
      {
        title: "512. Relatively Safe Trading",
        url: "https://zerodha.com/varsity/chapter/relatively-safe-trading/",
      },
      {
        title: "513. Detailed Trading Plans: The Ultimate Safety Net",
        url: "https://zerodha.com/varsity/chapter/detailed-trading-plans-the-ultimate-safety-net/",
      },
      {
        title: "514. Running Hot and Cold",
        url: "https://zerodha.com/varsity/chapter/running-hot-and-cold/",
      },
      {
        title: "515. The Rush of the Pit",
        url: "https://zerodha.com/varsity/chapter/the-rush-of-the-pit/",
      },
      {
        title: "516. Caught in a Psychological Slump",
        url: "https://zerodha.com/varsity/chapter/caught-in-a-psychological-slump/",
      },
      {
        title: "517. Rumination: Don’t Make Losses Even Worse",
        url: "https://zerodha.com/varsity/chapter/rumination-dont-make-losses-even-worse/",
      },
      {
        title: "518. Beliefs About Money: A Possible Source of Self-Sabotage",
        url: "https://zerodha.com/varsity/chapter/beliefs-about-money-a-possible-source-of-self-sabotage/",
      },
      {
        title: "519. Discipline in Everyday Life",
        url: "https://zerodha.com/varsity/chapter/discipline-in-everyday-life/",
      },
      {
        title: "520. The Doubting Trader",
        url: "https://zerodha.com/varsity/chapter/the-doubting-trader/",
      },
      {
        title: "521. Setting Goals",
        url: "https://zerodha.com/varsity/chapter/setting-goals/",
      },
      {
        title: "522. The Drive To Succeed",
        url: "https://zerodha.com/varsity/chapter/the-drive-to-succeed/",
      },
      {
        title: "523. Sure and Steady Progress",
        url: "https://zerodha.com/varsity/chapter/sure-and-steady-progress/",
      },
      {
        title: "524. The Thoughtful and Aware Trader",
        url: "https://zerodha.com/varsity/chapter/the-thoughtful-and-aware-trader/",
      },
      {
        title: "525. Increasing Self-Control",
        url: "https://zerodha.com/varsity/chapter/increasing-self-control/",
      },
      {
        title: "526. Cutting Emotional Strings That Bind Losses to Ego",
        url: "https://zerodha.com/varsity/chapter/cutting-emotional-strings-that-bind-losses-to-ego/",
      },
      {
        title: "527. The Self-Fulfilling Prophecy",
        url: "https://zerodha.com/varsity/chapter/the-self-fulfilling-prophecy/",
      },
      {
        title: "528. Dynamics of Self-Control",
        url: "https://zerodha.com/varsity/chapter/dynamics-of-self-control/",
      },
      {
        title: "529. The Self Control Experiment",
        url: "https://zerodha.com/varsity/chapter/the-self-control-experiment/",
      },
      {
        title: "530. Shifting Gears",
        url: "https://zerodha.com/varsity/chapter/shifting-gears/",
      },
      {
        title: "531. I Should Have Known…",
        url: "https://zerodha.com/varsity/chapter/i-should-have-known/",
      },
      {
        title: "532. Sifting Through the News",
        url: "https://zerodha.com/varsity/chapter/sifting-through-the-news/",
      },
      {
        title: "533. The Search for Significance",
        url: "https://zerodha.com/varsity/chapter/the-search-for-significance/",
      },
      {
        title: "534. Slips Can Be Expected",
        url: "https://zerodha.com/varsity/chapter/slips-can-be-expected/",
      },
      {
        title: "535. Taking Slow Easy Steps",
        url: "https://zerodha.com/varsity/chapter/taking-slow-easy-steps/",
      },
      {
        title: "536. Are You Really In a Slump?",
        url: "https://zerodha.com/varsity/chapter/are-you-really-in-a-slump/",
      },
      {
        title: "537. Surviving a Slump",
        url: "https://zerodha.com/varsity/chapter/surviving-a-slump/",
      },
      {
        title: "538. Small Things Matter Too",
        url: "https://zerodha.com/varsity/chapter/small-things-matter-too/",
      },
      {
        title: "539. Self-Monitoring: Facing Facts and Taking Action",
        url: "https://zerodha.com/varsity/chapter/self-monitoring-facing-facts-and-taking-action/",
      },
      {
        title: "540. Socially Responsible Investing",
        url: "https://zerodha.com/varsity/chapter/socially-responsible-investing/",
      },
      {
        title: "541. Enhancing Performance Through Social Support",
        url: "https://zerodha.com/varsity/chapter/enhancing-performance-through-social-support/",
      },
      {
        title: "542. The Sporting Life",
        url: "https://zerodha.com/varsity/chapter/the-sporting-life/",
      },
      {
        title:
          "543. The Standard Error: Why the Opinion of the Masses Can Never Be Measured Precisely",
        url: "https://zerodha.com/varsity/chapter/the-standard-error-why-the-opinion-of-the-masses-can-never-be-measured-precisely/",
      },
      {
        title: "544. High Standards: Can They Ever Be Too High?",
        url: "https://zerodha.com/varsity/chapter/high-standards-can-they-ever-be-too-high/",
      },
      {
        title: "545. In a Trading State of Mind",
        url: "https://zerodha.com/varsity/chapter/in-a-trading-state-of-mind/",
      },
      {
        title: "546. In a Trading State of Mind 2",
        url: "https://zerodha.com/varsity/chapter/in-a-trading-state-of-mind-2/",
      },
      {
        title: "547. Stay Detached from the Outcome of Your Trades",
        url: "https://zerodha.com/varsity/chapter/stay-detached-from-the-outcome-of-your-trades/",
      },
      {
        title: "548. Stay Objective",
        url: "https://zerodha.com/varsity/chapter/stay-objective/",
      },
      {
        title: "549. Stay Calm, Relaxed, and Ready: Don’t Crack Under Pressure",
        url: "https://zerodha.com/varsity/chapter/stay-calm-relaxed-and-ready-dont-crack-under-pressure/",
      },
      {
        title: "550. The Advertiser’s Dream",
        url: "https://zerodha.com/varsity/chapter/the-advertisers-dream/",
      },
      {
        title: "551. Stereotyped Trading",
        url: "https://zerodha.com/varsity/chapter/stereotyped-trading/",
      },
      {
        title: "552. Sticking to the Plan",
        url: "https://zerodha.com/varsity/chapter/sticking-to-the-plan/",
      },
      {
        title: "553. Seeking Out Protection In a Risky World",
        url: "https://zerodha.com/varsity/chapter/seeking-out-protection-in-a-risky-world/",
      },
      {
        title: "554. The Psychology of Stops",
        url: "https://zerodha.com/varsity/chapter/the-psychology-of-stops/",
      },
      {
        title: "555. Stressed Out and Vulnerable",
        url: "https://zerodha.com/varsity/chapter/stressed-out-and-vulnerable/",
      },
      {
        title: "556. The Mentally Tough Trader",
        url: "https://zerodha.com/varsity/chapter/the-mentally-tough-trader/",
      },
      {
        title: "557. The Stress Free Trader",
        url: "https://zerodha.com/varsity/chapter/the-stress-free-trader/",
      },
      {
        title: "558. Controlling Stress Ensures Lasting Success",
        url: "https://zerodha.com/varsity/chapter/controlling-stress-ensures-lasting-success/",
      },
      {
        title: "559. Are You Stressed Out?",
        url: "https://zerodha.com/varsity/chapter/are-you-stressed-out/",
      },
      {
        title: "560. Controlling Fear through Stress Prevention",
        url: "https://zerodha.com/varsity/chapter/controlling-fear-through-stress-prevention/",
      },
      {
        title: "561. Striving for Consistency",
        url: "https://zerodha.com/varsity/chapter/striving-for-consistency/",
      },
      {
        title: "562. Stuck and Paralyzed",
        url: "https://zerodha.com/varsity/chapter/stuck-and-paralyzed/",
      },
      {
        title:
          "563. Finding the Right Fit Between Your Personality and Trading Style",
        url: "https://zerodha.com/varsity/chapter/finding-the-right-fit-between-your-personality-and-trading-style/",
      },
      {
        title:
          "564. Does Your Personality Style Influence Your Trading Decisions?",
        url: "https://zerodha.com/varsity/chapter/does-your-personality-style-influence-your-trading-decisions/",
      },
      {
        title: "565. Subconscious Influences on Trading Decisions",
        url: "https://zerodha.com/varsity/chapter/subconscious-influences-on-trading-decisions/",
      },
      {
        title: "566. Staying Successful",
        url: "https://zerodha.com/varsity/chapter/staying-successful/",
      },
      {
        title: "567. Sunk Cost Effect",
        url: "https://zerodha.com/varsity/chapter/sunk-cost-effect/",
      },
      {
        title: "568. Sunk Costs in Everyday Life and in Trading",
        url: "https://zerodha.com/varsity/chapter/sunk-costs-in-everyday-life-and-in-trading/",
      },
      {
        title: "569. Sunk Costs",
        url: "https://zerodha.com/varsity/chapter/sunk-costs/",
      },
      {
        title: "570. The Influence of Sunk Costs",
        url: "https://zerodha.com/varsity/chapter/the-influence-of-sunk-costs/",
      },
      {
        title: "571. Going Your Own Way",
        url: "https://zerodha.com/varsity/chapter/going-your-own-way-2/",
      },
      {
        title: "572. Support and Resistance: More Solid than Ever",
        url: "https://zerodha.com/varsity/chapter/support-and-resistance-more-solid-than-ever/",
      },
      {
        title: "573. A Little Too Big Headed",
        url: "https://zerodha.com/varsity/chapter/a-little-too-big-headed/",
      },
      {
        title: "574. Can’t Pull the Trigger: There Are Alternatives",
        url: "https://zerodha.com/varsity/chapter/cant-pull-the-trigger-there-are-alternatives/",
      },
      {
        title: "575. Taking Responsibility and Taking Control",
        url: "https://zerodha.com/varsity/chapter/taking-responsibility-and-taking-control/",
      },
      {
        title: "576. Looking Inward and Gaining Control",
        url: "https://zerodha.com/varsity/chapter/looking-inward-and-gaining-control/",
      },
      {
        title: "577. Take It Easy: Work Around Your Natural Inclinations",
        url: "https://zerodha.com/varsity/chapter/take-it-easy-work-around-your-natural-inclinations/",
      },
      {
        title: "578. Develop Your Skill Set:  Taking a Loss",
        url: "https://zerodha.com/varsity/chapter/develop-your-skill-set-taking-a-loss/",
      },
      {
        title: "579. Take Profits and Relax",
        url: "https://zerodha.com/varsity/chapter/take-profits-and-relax/",
      },
      {
        title:
          "580. It’s Not My Fault: Why It’s So Hard to Take Responsibility",
        url: "https://zerodha.com/varsity/chapter/its-not-my-fault-why-its-so-hard-to-take-responsibility/",
      },
      {
        title: "581. The Need to Take Risks",
        url: "https://zerodha.com/varsity/chapter/the-need-to-take-risks/",
      },
      {
        title: "582. Staying On Target",
        url: "https://zerodha.com/varsity/chapter/staying-on-target/",
      },
      {
        title: "583. Testing Your Intuition",
        url: "https://zerodha.com/varsity/chapter/testing-your-intuition/",
      },
      {
        title: "584. Happy Thanksgiving",
        url: "https://zerodha.com/varsity/chapter/happy-thanksgiving/",
      },
      {
        title: "585. A Long and Winding Road",
        url: "https://zerodha.com/varsity/chapter/a-long-and-winding-road/",
      },
      {
        title: "586. The Gambling Analogy: Consider the Advantages",
        url: "https://zerodha.com/varsity/chapter/the-gambling-analogy-consider-the-advantages/",
      },
      {
        title: "587. The Intrinsic Rewards of Trading",
        url: "https://zerodha.com/varsity/chapter/the-intrinsic-rewards-of-trading/",
      },
      {
        title: "588. Thinking Optimistically",
        url: "https://zerodha.com/varsity/chapter/thinking-optimistically/",
      },
      {
        title: "589. Third Eye View",
        url: "https://zerodha.com/varsity/chapter/third-eye-view/",
      },
      {
        title: "590. A Tale of Three Traders",
        url: "https://zerodha.com/varsity/chapter/a-tale-of-three-traders/",
      },
      {
        title: "591. The Thrill Seekers",
        url: "https://zerodha.com/varsity/chapter/the-thrill-seekers/",
      },
      {
        title: "592. Fighting the Urge to Seek Out Excitement",
        url: "https://zerodha.com/varsity/chapter/fighting-the-urge-to-seek-out-excitement/",
      },
      {
        title: "593. The Efficient Trader",
        url: "https://zerodha.com/varsity/chapter/the-efficient-trader/",
      },
      {
        title: "594. Time Flies: But It’s Only Fun When You Get Work Done",
        url: "https://zerodha.com/varsity/chapter/time-flies-but-its-only-fun-when-you-get-work-done/",
      },
      {
        title: "595. Be Receptive to Multiple Time Frames",
        url: "https://zerodha.com/varsity/chapter/be-receptive-to-multiple-time-frames/",
      },
      {
        title: "596. Manage Your Time",
        url: "https://zerodha.com/varsity/chapter/manage-your-time/",
      },
      {
        title: "597. Timely and Decisive Action",
        url: "https://zerodha.com/varsity/chapter/timely-and-decisive-action/",
      },
      {
        title:
          "598. Risk Tolerance: Knowing Your Limitations and Working Around Them",
        url: "https://zerodha.com/varsity/chapter/risk-tolerance-knowing-your-limitations-and-working-around-them/",
      },
      {
        title: "599. Confident But Not Over-Confident",
        url: "https://zerodha.com/varsity/chapter/confident-but-not-over-confident-2/",
      },
      {
        title: "600. Top Down versus Bottom Up Stock Picking Strategies",
        url: "https://zerodha.com/varsity/chapter/top-down-versus-bottom-up-stock-picking-strategies/",
      },
      {
        title: "601. Building Emotional Toughness",
        url: "https://zerodha.com/varsity/chapter/building-emotional-toughness/",
      },
      {
        title: "602. Knowing When to Walk Away",
        url: "https://zerodha.com/varsity/chapter/knowing-when-to-walk-away/",
      },
      {
        title: "603. Controlling Your Trading Emotions",
        url: "https://zerodha.com/varsity/chapter/controlling-your-trading-emotions/",
      },
    ],
  },
  {
    id: 13,
    title: "Integrated Financial Modelling",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tIntroduction to Financial Modelling",
        url: "https://zerodha.com/varsity/chapter/introduction-to-financial-modelling/",
      },
      {
        title: "2.\t\t\t\t\t\tExcel workbook setup",
        url: "https://zerodha.com/varsity/chapter/excel-workbook-setup/",
      },
      {
        title: "3.\t\t\t\t\t\tHistorical Data",
        url: "https://zerodha.com/varsity/chapter/historical-data/",
      },
      {
        title: "4.\t\t\t\t\t\tAssumptions (Part 1)",
        url: "https://zerodha.com/varsity/chapter/assumptions-part-1/",
      },
      {
        title: "5.\t\t\t\t\t\tAssumptions (Part 2)",
        url: "https://zerodha.com/varsity/chapter/financial-model-assumptions-part-2-pl-inventory-ratios/",
      },
      {
        title: "6.\t\t\t\t\t\tRevenue model",
        url: "https://zerodha.com/varsity/chapter/revenue-model/",
      },
      {
        title: "7.\t\t\t\t\t\tAsset Schedule (Part 1)",
        url: "https://zerodha.com/varsity/chapter/asset-schedule/",
      },
      {
        title: "8.\t\t\t\t\t\tAsset Schedule (Part 2)",
        url: "https://zerodha.com/varsity/chapter/asset-schedule-part-2/",
      },
      {
        title: "9.\t\t\t\t\t\tDebt Schedule",
        url: "https://zerodha.com/varsity/chapter/debt-schedule/",
      },
      {
        title: "10.\t\t\t\t\t\tReserves Schedule (Part 1)",
        url: "https://zerodha.com/varsity/chapter/reserves-schedule-part-1/",
      },
      {
        title: "11.\t\t\t\t\t\tReserves Schedule (Part 2)",
        url: "https://zerodha.com/varsity/chapter/reserves-schedule-part-2/",
      },
      {
        title: "12.\t\t\t\t\t\tProjections",
        url: "https://zerodha.com/varsity/chapter/projections/",
      },
      {
        title: "13.\t\t\t\t\t\tCash flow statement",
        url: "https://zerodha.com/varsity/chapter/cash-flow-statement-2/",
      },
      {
        title: "14.\t\t\t\t\t\tValuation (Part 1) – Overview",
        url: "https://zerodha.com/varsity/chapter/valuation-part-1-overview/",
      },
      {
        title: "15.\t\t\t\t\t\tValuation (Part 2) – FCFF & FCFE",
        url: "https://zerodha.com/varsity/chapter/fcff-fcfe/",
      },
      {
        title: "16.\t\t\t\t\t\tValuation (Part 3) – Risk Premium & Tax Shield",
        url: "https://zerodha.com/varsity/chapter/valuation-part-3-risk-premium-tax-shield/",
      },
      {
        title:
          "17.\t\t\t\t\t\tWeighted average cost of capital and Terminal Growth",
        url: "https://zerodha.com/varsity/chapter/weighted-average-cost-of-capital-and-terminal-growth/",
      },
      {
        title: "18.\t\t\t\t\t\tDiscounted Cash Flow Analysis (DCF)",
        url: "https://zerodha.com/varsity/chapter/discounted-cash-flow-analysis-dcf/",
      },
    ],
  },
  {
    id: 14,
    title: "Personal Finance - Insurance",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tIntroduction",
        url: "https://zerodha.com/varsity/chapter/introduction/",
      },
      {
        title: "2.\t\t\t\t\t\tPerverse Incentives",
        url: "https://zerodha.com/varsity/chapter/perverse-incentives/",
      },
      {
        title: "3.\t\t\t\t\t\tThe nudge",
        url: "https://zerodha.com/varsity/chapter/the-nudge/",
      },
      {
        title: "4.\t\t\t\t\t\tSkin in the game",
        url: "https://zerodha.com/varsity/chapter/skin-in-the-game/",
      },
      {
        title: "5.\t\t\t\t\t\tDunning Kruger effect",
        url: "https://zerodha.com/varsity/chapter/dunning-kruger-effect/",
      },
      {
        title: "6.\t\t\t\t\t\tA mighty defence",
        url: "https://zerodha.com/varsity/chapter/a-mighty-defence/",
      },
      {
        title: "7.\t\t\t\t\t\tNo free lunch",
        url: "https://zerodha.com/varsity/chapter/no-free-lunch/",
      },
      {
        title: "8.\t\t\t\t\t\tGimmick or not (Part 1)",
        url: "https://zerodha.com/varsity/chapter/gimmik-or-not-part-1/",
      },
      {
        title: "9.\t\t\t\t\t\tGimmick or not (Part 2)",
        url: "https://zerodha.com/varsity/chapter/gimmik-or-not-part-2/",
      },
    ],
  },
  {
    id: 15,
    title: "Sector Analysis",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tSector analysis overview",
        url: "https://zerodha.com/varsity/chapter/sector-analysis-overview/",
      },
      {
        title: "2.\t\t\t\t\t\tCement",
        url: "https://zerodha.com/varsity/chapter/cement/",
      },
      {
        title: "3.\t\t\t\t\t\tInsurance (Part 1)",
        url: "https://zerodha.com/varsity/chapter/insurance-part-1/",
      },
      {
        title: "4.\t\t\t\t\t\tInsurance (Part 2)",
        url: "https://zerodha.com/varsity/chapter/understanding-insurance-sector-part-2/",
      },
      {
        title: "5.\t\t\t\t\t\tInformation Technology",
        url: "https://zerodha.com/varsity/chapter/information-technology/",
      },
      {
        title: "6.\t\t\t\t\t\tAutomobiles (Part 1)",
        url: "https://zerodha.com/varsity/chapter/automobiles-part-1/",
      },
      {
        title: "7.\t\t\t\t\t\tAutomobiles (Part 2)",
        url: "https://zerodha.com/varsity/chapter/automobiles-part-2/",
      },
      {
        title: "8.\t\t\t\t\t\tBanking (Part 1)",
        url: "https://zerodha.com/varsity/chapter/banking-part-1/",
      },
      {
        title: "9.\t\t\t\t\t\tBanking (Part 2)",
        url: "https://zerodha.com/varsity/chapter/banking-part-2/",
      },
      {
        title: "10.\t\t\t\t\t\tSteel (Part 1)",
        url: "https://zerodha.com/varsity/chapter/steel-part-1/",
      },
      {
        title: "11.\t\t\t\t\t\tSteel (Part 2)",
        url: "https://zerodha.com/varsity/chapter/steel-part-2/",
      },
      {
        title: "12.\t\t\t\t\t\tHotels (Part 1)",
        url: "https://zerodha.com/varsity/chapter/hotels-part-1/",
      },
      {
        title: "13.\t\t\t\t\t\tHotels (Part 2)",
        url: "https://zerodha.com/varsity/chapter/hotels-part-2/",
      },
      {
        title: "14.\t\t\t\t\t\tRetail (Part 1)",
        url: "https://zerodha.com/varsity/chapter/retail-part-1/",
      },
      {
        title: "15.\t\t\t\t\t\tRetail (Part 2)",
        url: "https://zerodha.com/varsity/chapter/retail-part-2/",
      },
      {
        title: "16.\t\t\t\t\t\tReal Estate (Part 1)",
        url: "https://zerodha.com/varsity/chapter/real-estate-part-1/",
      },
      {
        title: "17.\t\t\t\t\t\tReal Estate (Part 2)",
        url: "https://zerodha.com/varsity/chapter/real-estate-part-2/",
      },
    ],
  },
  {
    id: 16,
    title: "Social Stock Exchanges (SSEs)",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tSocial Stock Exchanges – An Introduction",
        url: "https://zerodha.com/varsity/chapter/social-stock-exchanges-an-introduction/",
      },
      {
        title: "2.\t\t\t\t\t\tWho can raise funds on SSE?",
        url: "https://zerodha.com/varsity/chapter/who-can-raise-funds-on-sse/",
      },
      {
        title:
          "3.\t\t\t\t\t\tModes of raising funds (Part 1) : ZCZP and other instruments",
        url: "https://zerodha.com/varsity/chapter/modes-of-raising-funds-part-1-zczp-and-other-instruments/",
      },
      {
        title: "4.\t\t\t\t\t\tModes of raising funds (Part 2)",
        url: "https://zerodha.com/varsity/chapter/modes-of-raising-funds-part-2/",
      },
    ],
  },
  {
    id: 17,
    title: "NPS: National Pension System",
    chapters: [
      {
        title: "1.\t\t\t\t\t\tIntroduction to NPS",
        url: "https://zerodha.com/varsity/chapter/national-pension-system-nps/",
      },
      {
        title: "2.\t\t\t\t\t\tNPS vs. other retirement plans",
        url: "https://zerodha.com/varsity/chapter/nps-vs-other-retirement-plans/",
      },
      {
        title: "3.\t\t\t\t\t\tInvestment Options in NPS",
        url: "https://zerodha.com/varsity/chapter/investment-options-in-nps/",
      },
      {
        title: "4.\t\t\t\t\t\tNPS: Exit & Withdrawals",
        url: "https://zerodha.com/varsity/chapter/exit-withdrawals/",
      },
      {
        title: "5.\t\t\t\t\t\tNPS Tier II Account",
        url: "https://zerodha.com/varsity/chapter/nps-tier-ii-account/",
      },
      {
        title: "6.\t\t\t\t\t\tNPS Tax rules & benefits",
        url: "https://zerodha.com/varsity/chapter/nps-tax-rules-benefits/",
      },
      {
        title:
          "7.\t\t\t\t\t\tNPS structure, fees, how to open an account, and start a SIP",
        url: "https://zerodha.com/varsity/chapter/nps-structure-fees-how-to-open-an-account-and-start-a-sip/",
      },
      {
        title: "8.\t\t\t\t\t\tNPS Vatsalya",
        url: "https://zerodha.com/varsity/chapter/nps-vatsalya/",
      },
      {
        title: "9.\t\t\t\t\t\tCorporate NPS",
        url: "https://zerodha.com/varsity/chapter/corporate-nps/",
      },
    ],
  },
]
