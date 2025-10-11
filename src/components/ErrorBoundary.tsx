import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      eventId: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = this.generateEventId();
    
    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  generateEventId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-[#0C0810] border-[#f38ba8] border-2 text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 w-16 h-16 bg-[#f38ba8]/20 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle className="w-8 h-8 text-[#f38ba8]" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-[#f38ba8] mb-2">
                  Oops! Something went wrong
                </CardTitle>
                <p className="text-[#a6adc8]">
                  We encountered an unexpected error. Don't worry, we're working to fix it.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bug className="w-4 h-4 text-[#cba6f7]" />
                      <span className="text-sm font-medium text-[#f5c2e7]">Development Error Details</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[#a6adc8]">Error:</span>
                        <pre className="text-[#f38ba8] mt-1 whitespace-pre-wrap break-words">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <span className="text-[#a6adc8]">Stack Trace:</span>
                          <pre className="text-[#cdd6f4] mt-1 whitespace-pre-wrap break-words text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {this.state.eventId && (
                  <div className="text-center">
                    <p className="text-sm text-[#a6adc8] mb-2">
                      Error ID: <code className="bg-[#313244] px-2 py-1 rounded text-[#cba6f7]">{this.state.eventId}</code>
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleRetry}
                    className="bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#11111b] font-medium"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="border-[#313244] text-[#cdd6f4] hover:bg-[#313244] hover:text-[#f5c2e7]"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-[#a6adc8]">
                    If this problem persists, please{' '}
                    <a
                      href="mailto:jefinojacob9488@gmail.com"
                      className="text-[#89b4fa] hover:text-[#f5c2e7] underline"
                    >
                      contact me
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to catch errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // You can add additional error reporting logic here
  };
}

// Higher-order component for easier error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;
