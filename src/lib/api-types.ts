export interface User {
  id: number;
  name: string;
  email: string;
}

export interface MarketRow {
  symbol: string;
  name: string;
  price: number;
  change: number;
  vol: number;
  cap: number;
  cat: string;
}

export interface Holding {
  id: number;
  asset: string;
  symbol: string;
  amount: number;
  value: number;
  pnl: number;
}

export interface JournalEntry {
  id: number;
  date: string;
  pair: string;
  type: "Long" | "Short";
  entry: string;
  exit: string;
  pnl: number;
  emotion: string;
  tags: string[];
  notes: string;
}

export interface AlertRow {
  id: number;
  type: string;
  asset: string;
  condition: string;
  status: string;
  dismissed: boolean;
  time: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  count: number;
}
