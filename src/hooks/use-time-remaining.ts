// src/hooks/use-time-remaining.ts
import { useState, useEffect } from 'react';

export function useTimeRemaining(endTimeStr: string | undefined) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (!endTimeStr) return;

        function updateTimeLeft() {
            const now = new Date();
            const endTime = new Date(endTimeStr as string);
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Ended');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m`);
            }
        }

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [endTimeStr]);

    return timeLeft;
}