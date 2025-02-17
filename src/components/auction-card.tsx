// src/components/auction-card.tsx
import { Timer } from "lucide-react";
import { useTimeRemaining } from "@/hooks/use-time-remaining";
import type { Listing } from "@/types/listing";

interface AuctionViewProps {
  listing: Listing;
  onClick: () => void;
}

export function AuctionCard({ listing, onClick }: AuctionViewProps) {
  const timeLeft = useTimeRemaining(listing.end_time);
  const isEnding = timeLeft.includes("m") || timeLeft === "Ended";

  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isEnding ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-medium">{listing.title}</h3>
          <div className="mt-1 text-sm space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">${listing.price.toFixed(2)}</span>
              {listing.shipping_cost !== null && (
                <span className="text-gray-500">
                  +${listing.shipping_cost.toFixed(2)} shipping
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
            isEnding
              ? "bg-orange-100 text-orange-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          <Timer size={14} />
          <span>{timeLeft}</span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span>Seller: {listing.seller_info}</span>
          {listing.rating_percent && (
            <span className="text-green-600">({listing.rating_percent}%)</span>
          )}
        </span>
        <span className="text-xs">
          Ends {new Date(listing.end_time!).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
