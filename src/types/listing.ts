export interface Listing {
    platform: string;
    title: string;
    price: number;
    shipping_cost: number | null;
    total_cost: number | null;
    price_vs_official: number | null;
    seller_info: string;
    feedback_count: number | null;
    rating_percent: number | null;
    link: string;
    category: 'printer' | 'upgrade';
    model: string;
    auction_type: 'Buy It Now' | 'Auction' | 'Hybrid';
    time_remaining?: string;
    seconds_remaining?: number;
    end_time?: string;
}

export interface ListingsData {
    instructions: {
        summary: string;
        key_metrics: string[];
        models: {
            [key: string]: string;
        };
    };
    listings: Listing[];
}