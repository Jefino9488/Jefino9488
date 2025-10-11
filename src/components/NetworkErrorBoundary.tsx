import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  retryCount: number;
}

export default function NetworkErrorBoundary({ children, onRetry }: NetworkErrorBoundaryProps) {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isConnected: navigator.onLine, // Use browser's online status
    retryCount: 0,
  });

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true, retryCount: 0 }));
      setShowError(false);
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
      setShowError(true);
    };


    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // For static sites, we don't need aggressive connectivity checks
    // Only rely on browser online/offline events
    // checkConnectivity(); // Disabled for static sites

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networkStatus.retryCount]);

  const handleRetry = async () => {
    setNetworkStatus(prev => ({ ...prev, retryCount: 0 }));
    setShowError(false);
    
    if (onRetry) {
      onRetry();
    }

    // For static sites, just reset the connection status
    // The browser's online/offline events will handle real connectivity
    setNetworkStatus(prev => ({ ...prev, isConnected: navigator.onLine }));
  };

  const isNetworkError = !networkStatus.isOnline || !networkStatus.isConnected;

  return (
    <>
      {children}
      
      <AnimatePresence>
        {isNetworkError && showError && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-96"
          >
            <div className="bg-[#0C0810] border border-[#f38ba8] rounded-xl shadow-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {networkStatus.isOnline ? (
                    <AlertCircle className="w-5 h-5 text-[#f38ba8]" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-[#f38ba8]" />
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-[#f5c2e7] mb-1">
                    {networkStatus.isOnline ? 'Connection Issues' : 'You\'re Offline'}
                  </h3>
                  <p className="text-xs text-[#a6adc8] mb-3">
                    {networkStatus.isOnline 
                      ? 'Unable to connect to our servers. Please check your connection.'
                      : 'Please check your internet connection and try again.'
                    }
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRetry}
                      size="sm"
                      className="bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#11111b] text-xs h-7 px-3"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                    
                    <Button
                      onClick={() => setShowError(false)}
                      variant="outline"
                      size="sm"
                      className="border-[#313244] text-[#cdd6f4] hover:bg-[#313244] text-xs h-7 px-3"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection status indicator */}
      <AnimatePresence>
        {!networkStatus.isOnline && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed top-4 right-4 z-40"
          >
            <div className="bg-[#f38ba8] text-white rounded-full p-2 shadow-lg">
              <WifiOff className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
