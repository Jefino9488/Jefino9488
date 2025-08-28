import { useState } from 'react';
import { Music2, ExternalLink, Headphones, Music } from 'lucide-react';
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
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`group relative bg-gradient-to-br from-[#0C0810] to-[#0D0911] rounded-full shadow-lg border border-[#45475a] transition-all hover:scale-105 hover:shadow-xl ${className}`}
            >
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Music2 className="w-4 h-4 text-[#a6adc8]" />
                    </motion.div>
                    <span className="text-[#a6adc8] text-xs font-medium">Loading...</span>
                </div>

                {/* Subtle loading ring */}
                <div className="absolute inset-0 rounded-full">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#a6adc8]/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.div>
        );
    }

    if (!track || track.name === "Failed to load track" || track.name === "Network error") {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`group relative bg-gradient-to-br from-[#0C0810] to-[#0D0911] rounded-full shadow-lg border border-[#45475a] transition-all hover:scale-105 ${className}`}
            >
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <Headphones className="w-4 h-4 text-[#a6adc8]" />
                    <span className="text-[#a6adc8] text-xs font-medium">
                        {error ? 'Connection error' : 'No music'}
                    </span>
                </div>
            </motion.div>
        );
    }

    const handleClick = () => {
        if (track.url) {
            window.open(track.url, '_blank', 'noopener,noreferrer');
        }
    };

    const isValidTrack = track.name !== "No track available" && track.name !== "Failed to load track";

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative ${
                isValidTrack ? 'cursor-pointer' : 'cursor-default'
            } ${className}`}
            onClick={isValidTrack ? handleClick : undefined}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Main widget with home theme gradient background */}
            <div className="relative bg-gradient-to-br from-[#0C0810] to-[#0D0911] rounded-full shadow-lg border border-[#45475a] transition-all group-hover:border-[#cba6f7]/50 group-hover:shadow-xl">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1.5">
                    {/* Music icon with subtle indication */}
                    <div className="relative">
                        {track.isPlaying ? (
                            <Headphones className="w-4 h-4 text-[#89b4fa]" />
                        ) : (
                            <Music className="w-4 h-4 text-[#a6adc8]" />
                        )}
                    </div>

                    {/* Track name with better typography */}
                    <div className="text-[#cdd6f4] text-xs font-medium max-w-[120px] truncate font-inter">
                        {track.name}
                    </div>

                    {/* External link indicator */}
                    {isValidTrack && track.url && (
                        <motion.div
                            initial={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ExternalLink className="w-3 h-3 text-[#a6adc8] opacity-70 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    )}
                </div>

                {/* Subtle pulse effect for currently playing */}
                {track.isPlaying && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#89b4fa]/10 to-[#cba6f7]/10"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.05, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                )}

                {/* Hover glow effect matching home theme */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#89b4fa]/10 to-[#cba6f7]/10 blur-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Enhanced Tooltip with theme consistency */}
            <AnimatePresence>
                {showTooltip && showDetails && isValidTrack && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="absolute left-full bottom-full mb-3 translate-x-10 ml-4 bg-gradient-to-br from-[#0C0810] to-[#0D0911] rounded-2xl shadow-2xl border border-[#45475a] w-72 p-4 z-50 backdrop-blur-xl"
                    >
                        {/* Fixed tooltip arrow */}
                        <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#45475a]" />

                        <div className="flex items-start gap-4">
                            {/* Album art with loading state */}
                            {track.albumArt && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative flex-shrink-0"
                                >
                                    <img
                                        src={track.albumArt}
                                        alt={`${track.name} album art`}
                                        className="w-16 h-16 rounded-lg object-cover shadow-lg border border-[#45475a]"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    {/* Subtle glow effect on album art */}
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#89b4fa]/5 to-[#cba6f7]/5" />
                                </motion.div>
                            )}

                            <div className="flex-grow min-w-0">
                                {/* Status indicator with icon */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-[#cba6f7] text-xs font-medium mb-2"
                                >
                                    <Music className="w-3 h-3" />
                                    {track.isPlaying ? "Now Playing" : "Recently Played"}
                                </motion.div>

                                {/* Track name with better spacing */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[#cdd6f4] text-sm font-semibold mb-2 line-clamp-2 font-poppins"
                                    title={track.name}
                                >
                                    {track.name}
                                </motion.div>

                                {/* Artist with subtle styling */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-[#a6adc8] text-xs mb-3 line-clamp-1 font-inter"
                                    title={track.artist}
                                >
                                    {track.artist}
                                </motion.div>

                                {/* Call to action with home theme colors */}
                                {track.url && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-2 text-[#89b4fa] text-xs group/cta hover:text-[#f5c2e7] transition-colors cursor-pointer"
                                    >
                                        <ExternalLink className="w-3 h-3 group-hover/cta:scale-110 transition-transform" />
                                        <span className="font-medium">Open in Spotify</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Subtle decorative elements */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#89b4fa] rounded-full opacity-30" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#cba6f7] rounded-full opacity-20" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}