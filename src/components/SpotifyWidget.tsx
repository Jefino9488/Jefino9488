import { useState } from 'react';
import { Music2, ExternalLink, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotify } from '@/hooks/useSpotify';

interface SpotifyWidgetProps {
    className?: string;
    showDetails?: boolean;
}

export default function SpotifyWidget({ className = '', showDetails = true }: SpotifyWidgetProps) {
    const { track, isLoading, error } = useSpotify(30000); // Update every 30 seconds
    const [showTooltip, setShowTooltip] = useState(false);

    if (isLoading) {
        return (
            <div className={`group bg-[#1DB954] rounded-full shadow-lg border-2 border-[#020203] transition-all hover:scale-105 ${className}`}>
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <Music2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-white text-xs font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    if (!track || track.name === "Failed to load track" || track.name === "Network error") {
        return (
            <div className={`group bg-gray-600 rounded-full shadow-lg border-2 border-[#020203] transition-all hover:scale-105 ${className}`}>
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <Headphones className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">
                        {error ? 'Connection error' : 'No music'}
                    </span>
                </div>
            </div>
        );
    }

    const handleClick = () => {
        if (track.url) {
            window.open(track.url, '_blank', 'noopener,noreferrer');
        }
    };

    const isValidTrack = track.name !== "No track available" && track.name !== "Failed to load track";

    return (
        <div
            className={`group relative bg-[#1DB954] rounded-full shadow-lg border-2 border-[#020203] transition-all hover:scale-105 ${
                isValidTrack ? 'cursor-pointer' : 'cursor-default'
            } ${className}`}
            onClick={isValidTrack ? handleClick : undefined}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5">
                <Music2 
                    className={`w-4 h-4 text-white ${
                        track.isPlaying ? 'animate-pulse' : ''
                    }`} 
                />
                <div className="text-white text-xs font-medium max-w-[120px] truncate">
                    {track.name}
                </div>
                {isValidTrack && track.url && (
                    <ExternalLink className="w-3 h-3 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && showDetails && isValidTrack && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        className="absolute right-0 bottom-full mb-2 bg-[#0C0810] rounded-lg shadow-xl border border-[#313244] w-64 p-3 z-50"
                    >
                        <div className="flex items-start gap-3">
                            {track.albumArt && (
                                <img 
                                    src={track.albumArt} 
                                    alt={`${track.name} album art`}
                                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            )}
                            <div className="flex-grow min-w-0">
                                <div className="text-[#f5c2e7] text-xs font-medium mb-1">
                                    {track.isPlaying ? "Now Playing" : "Recently Played"}
                                </div>
                                <div className="text-white text-sm font-semibold mb-1 line-clamp-2" title={track.name}>
                                    {track.name}
                                </div>
                                <div className="text-[#a6adc8] text-xs line-clamp-1" title={track.artist}>
                                    {track.artist}
                                </div>
                                {track.url && (
                                    <div className="text-[#89b4fa] text-xs mt-1 flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        Click to open in Spotify
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pulse effect for currently playing */}
            {track.isPlaying && (
                <div className="absolute inset-0 rounded-full bg-[#1DB954] animate-ping opacity-20"></div>
            )}
        </div>
    );
}