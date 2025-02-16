"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { groupBy, meanBy } from "lodash";
import { ListingDialog } from "@/components/listing-dialog";
import type { Listing, ListingsData } from "@/types/listing";

export function PrusaAnalysisDashboard() {
  const [data, setData] = useState<ListingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const url = `${basePath}/data/listings.json`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg">Loading data...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  if (!data) return null;

  // Helper functions
  // Add utility functions for auction-related logic
  const getAuctionStatus = (listing: Listing): string => {
    if (listing.auction_type === "Buy It Now") return "Buy It Now";

    if (!listing.auction_time) return listing.auction_type;

    const endTime = new Date(listing.auction_time.end_time);
    const now = new Date();

    if (endTime > now) {
      return "Active Auction";
    } else {
      return "Auction Ended";
    }
  };

  const formatRemainingTime = (listing: Listing): string => {
    if (!listing.auction_time) return "Not an auction";
    return listing.auction_time.time_remaining;
  };

  const findStandoutListings = (listings: Listing[]) => {
    // Categorize standout listings
    const standoutsByCategory = {
      printers: {} as Record<string, Listing[]>,
      upgrades: {} as Record<string, Listing[]>,
    };

    listings.forEach((listing) => {
      const isSignificantlyBelowMSRP =
        listing.price_vs_official !== null && listing.price_vs_official < -100;
      const isHighlyRated =
        listing.rating_percent !== null && listing.rating_percent > 98;
      const hasLargeFeedback =
        listing.feedback_count !== null && listing.feedback_count > 1000;

      const isStandoutListing =
        isSignificantlyBelowMSRP || (isHighlyRated && hasLargeFeedback);

      if (isStandoutListing) {
        const category =
          listing.category === "printer" ? "printers" : "upgrades";

        if (category === "printers") {
          // Group printer standouts by model
          if (!standoutsByCategory.printers[listing.model]) {
            standoutsByCategory.printers[listing.model] = [];
          }
          standoutsByCategory.printers[listing.model].push(listing);
        } else {
          // Group upgrades by type
          const upgradeType = determineUpgradeType(listing.title);
          if (!standoutsByCategory.upgrades[upgradeType]) {
            standoutsByCategory.upgrades[upgradeType] = [];
          }
          standoutsByCategory.upgrades[upgradeType].push(listing);
        }
      }
    });

    return standoutsByCategory;
  };

  const determineUpgradeType = (title: string): string => {
    const lowercaseTitle = title.toLowerCase();
    const upgradeTypes = [
      { type: "Hotend", keywords: ["hotend"] },
      { type: "Frame", keywords: ["frame"] },
      { type: "Nozzle", keywords: ["nozzle"] },
      { type: "Extruder", keywords: ["extruder"] },
      { type: "Sheet", keywords: ["sheet"] },
      { type: "Bondtech", keywords: ["bondtech"] },
      { type: "Bear", keywords: ["bear"] },
      { type: "PINDA", keywords: ["pinda"] },
    ];

    const matchedType = upgradeTypes.find((upgrade) =>
      upgrade.keywords.some((keyword) => lowercaseTitle.includes(keyword))
    );

    return matchedType ? matchedType.type : "Other";
  };

  // Process data for charts
  const modelStats = Object.entries(groupBy(data.listings, "model")).map(
    ([model, listings]) => ({
      model,
      avgPrice: meanBy(listings, "price"),
      count: listings.length,
      belowMSRP: listings.filter(
        (l) => l.price_vs_official !== null && l.price_vs_official < 0
      ).length,
      withShipping: listings.filter((l) => l.shipping_cost !== null).length,
    })
  );

  const upgradeTypes = Object.entries(
    groupBy(
      data.listings.filter((l) => l.category === "upgrade"),
      (l) => {
        const title = l.title.toLowerCase();
        if (title.includes("hotend")) return "Hotend";
        if (title.includes("frame")) return "Frame";
        if (title.includes("nozzle")) return "Nozzle";
        if (title.includes("extruder")) return "Extruder";
        if (title.includes("sheet")) return "Sheet";
        if (title.includes("bondtech")) return "Bondtech";
        if (title.includes("bear")) return "Bear";
        if (title.includes("pinda")) return "PINDA";
        return "Other";
      }
    )
  ).map(([type, items]) => ({
    type,
    count: items.length,
    avgPrice: meanBy(items, "price"),
  }));

  // Sub-components
  const StandoutListingsCard = () => {
    const standoutListings = findStandoutListings(data.listings);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Standout Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Printer Standouts */}
            <div>
              <h3 className="font-bold mb-2 text-lg">Printer Standouts</h3>
              {Object.entries(standoutListings.printers).map(
                ([model, listings]) => (
                  <div key={model} className="mb-3">
                    <h4 className="font-semibold mb-1">{model}</h4>
                    <div className="space-y-2">
                      {listings.map((listing, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedListing(listing)}
                        >
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-gray-600">
                            ${listing.price.toFixed(2)}
                            {listing.price_vs_official !== null && (
                              <span
                                className={
                                  listing.price_vs_official < 0
                                    ? "text-green-600 ml-2"
                                    : "text-red-600 ml-2"
                                }
                              >
                                (${listing.price_vs_official.toFixed(2)} vs
                                MSRP)
                              </span>
                            )}
                            {/* Auction Information */}
                            {listing.auction_type !== "Buy It Now" && (
                              <span className="ml-2 text-xs text-gray-600">
                                {getAuctionStatus(listing)}
                                {listing.auction_time &&
                                  ` (${formatRemainingTime(listing)})`}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Upgrade Standouts */}
            <div>
              <h3 className="font-bold mb-2 text-lg">Upgrade Standouts</h3>
              {Object.entries(standoutListings.upgrades).map(
                ([type, listings]) => (
                  <div key={type} className="mb-3">
                    <h4 className="font-semibold mb-1">{type} Upgrades</h4>
                    <div className="space-y-2">
                      {listings.map((listing, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedListing(listing)}
                        >
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-gray-600">
                            ${listing.price.toFixed(2)}
                            {listing.price_vs_official !== null && (
                              <span
                                className={
                                  listing.price_vs_official < 0
                                    ? "text-green-600 ml-2"
                                    : "text-red-600 ml-2"
                                }
                              >
                                (${listing.price_vs_official.toFixed(2)} vs
                                MSRP)
                              </span>
                            )}
                            {/* Auction Information */}
                            {listing.auction_type !== "Buy It Now" && (
                              <span className="ml-2 text-xs text-gray-600">
                                {getAuctionStatus(listing)}
                                {listing.auction_time &&
                                  ` (${formatRemainingTime(listing)})`}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Add click handlers to model cards
  const ModelCard = ({
    model,
    listings,
  }: {
    model: string;
    listings: Listing[];
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{model}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats section */}
          <div className="space-y-2">
            <p>Count: {listings.length}</p>
            <p>Average Price: ${meanBy(listings, "price").toFixed(2)}</p>
            <p>
              Below MSRP:{" "}
              {
                listings.filter(
                  (l) => l.price_vs_official !== null && l.price_vs_official < 0
                ).length
              }
            </p>
            <p>
              With Shipping:{" "}
              {listings.filter((l) => l.shipping_cost !== null).length}
            </p>
            {/* New Auction Type Distribution */}
            <p>
              Auction Types:{" "}
              {Object.entries(groupBy(listings, "auction_type"))
                .map(
                  ([type, typeListings]) => `${type}: ${typeListings.length}`
                )
                .join(", ")}
            </p>
          </div>

          {/* Best deals section */}
          <div>
            <h4 className="font-medium mb-2">Best Deals</h4>
            {listings
              .filter(
                (l) => l.price_vs_official !== null && l.price_vs_official < 0
              )
              .sort(
                (a, b) =>
                  (a.price_vs_official || 0) - (b.price_vs_official || 0)
              )
              .slice(0, 3)
              .map((listing, idx) => (
                <div
                  key={idx}
                  className="text-sm p-1 cursor-pointer hover:bg-gray-50 rounded"
                  onClick={() => setSelectedListing(listing)}
                >
                  ${listing.price.toFixed(2)} ($
                  {listing.price_vs_official?.toFixed(2)} vs MSRP)
                  {/* Add Auction Information */}
                  {listing.auction_type !== "Buy It Now" && (
                    <span className="ml-2 text-xs text-gray-600">
                      {getAuctionStatus(listing)}
                      {listing.auction_time &&
                        ` (${formatRemainingTime(listing)})`}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="w-full space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Listings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={modelStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="model" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="avgPrice"
                          stroke="#8884d8"
                          name="Avg Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#82ca9d"
                          name="Count"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Total Listings: {data.listings.length}</p>
                    <p>
                      Printers:{" "}
                      {
                        data.listings.filter((l) => l.category === "printer")
                          .length
                      }
                    </p>
                    <p>
                      Upgrades:{" "}
                      {
                        data.listings.filter((l) => l.category === "upgrade")
                          .length
                      }
                    </p>
                    <p>
                      Below MSRP:{" "}
                      {
                        data.listings.filter(
                          (l) =>
                            l.price_vs_official !== null &&
                            l.price_vs_official < 0
                        ).length
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <StandoutListingsCard />
            </div>
          </TabsContent>

          <TabsContent value="models">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupBy(data.listings, "model")).map(
                ([model, listings]) => (
                  <ModelCard key={model} model={model} listings={listings} />
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="upgrades">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={upgradeTypes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          name="Count"
                        />
                        <Line
                          type="monotone"
                          dataKey="avgPrice"
                          stroke="#82ca9d"
                          name="Avg Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upgradeTypes.map((upgrade) => (
                      <div
                        key={upgrade.type}
                        className="border-b pb-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          // Find the lowest priced listing for this upgrade type
                          const lowestPriceListing = data.listings
                            .filter(
                              (l) =>
                                l.category === "upgrade" &&
                                l.title
                                  .toLowerCase()
                                  .includes(upgrade.type.toLowerCase())
                            )
                            .sort((a, b) => a.price - b.price)[0];
                          if (lowestPriceListing) {
                            setSelectedListing(lowestPriceListing);
                          }
                        }}
                      >
                        <p className="font-medium">{upgrade.type}</p>
                        <p>Count: {upgrade.count}</p>
                        <p>Average Price: ${upgrade.avgPrice.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ListingDialog
        listing={selectedListing}
        isOpen={selectedListing !== null}
        onClose={() => setSelectedListing(null)}
      />
    </>
  );
}
