import { Listing } from "@/types/listing";
import _ from "lodash";

export const OFFICIAL_PRICES = {
    "MK3S": 799.0,
    "MK4": 799.0,
    "MINI": 379.0,
    "CORE": 399.0
};

export function processModelStats(listings: Listing[]) {
    const modelStats = _.groupBy(listings, 'model');

    return Object.entries(modelStats).map(([model, modelListings]) => ({
        model,
        avgPrice: _.meanBy(modelListings, 'price'),
        count: modelListings.length,
        belowMSRP: modelListings.filter(l => l.price_vs_official !== null && l.price_vs_official < 0).length,
        withShipping: modelListings.filter(l => l.shipping_cost !== null).length
    }));
}

export function processUpgradeTypes(listings: Listing[]) {
    return _.chain(listings)
        .filter(l => l.category === 'upgrade')
        .groupBy(l => {
            const title = l.title.toLowerCase();
            if (title.includes('hotend')) return 'Hotend';
            if (title.includes('frame')) return 'Frame';
            if (title.includes('nozzle')) return 'Nozzle';
            if (title.includes('extruder')) return 'Extruder';
            if (title.includes('sheet')) return 'Sheet';
            if (title.includes('bondtech')) return 'Bondtech';
            if (title.includes('bear')) return 'Bear';
            if (title.includes('pinda')) return 'PINDA';
            return 'Other';
        })
        .map((items, type) => ({
            type,
            count: items.length,
            avgPrice: _.meanBy(items, 'price')
        }))
        .value();
}