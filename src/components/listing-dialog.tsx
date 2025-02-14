// src/components/listing-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import type { Listing } from "@/types/listing";

interface ListingDialogProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ListingDialog({
  listing,
  isOpen,
  onClose,
}: ListingDialogProps) {
  if (!listing) return null;

  const standoutFeatures = [];
  if (listing.price_vs_official && listing.price_vs_official < -100) {
    standoutFeatures.push("Significantly below MSRP");
  }
  if (listing.rating_percent && listing.rating_percent > 98) {
    standoutFeatures.push("Highly rated seller");
  }
  if (listing.feedback_count && listing.feedback_count > 1000) {
    standoutFeatures.push("Experienced seller");
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{listing.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Price Details</h3>
              <div className="space-y-1">
                <p>Base Price: ${listing.price.toFixed(2)}</p>
                {listing.shipping_cost !== null && (
                  <p>Shipping: ${listing.shipping_cost.toFixed(2)}</p>
                )}
                {listing.total_cost !== null && (
                  <p>Total: ${listing.total_cost.toFixed(2)}</p>
                )}
                {listing.price_vs_official !== null && (
                  <p
                    className={
                      listing.price_vs_official < 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    vs MSRP: ${listing.price_vs_official.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Seller Information</h3>
              <div className="space-y-1">
                {listing.rating_percent && (
                  <p>Rating: {listing.rating_percent}%</p>
                )}
                {listing.feedback_count && (
                  <p>Feedback: {listing.feedback_count}</p>
                )}
                <p>Info: {listing.seller_info}</p>
              </div>
            </div>
          </div>

          {standoutFeatures.length > 0 && (
            <div>
              <h3 className="font-semibold">Standout Features</h3>
              <ul className="list-disc list-inside">
                {standoutFeatures.map((feature, index) => (
                  <li key={index} className="text-green-600">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <a
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Listing <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
