import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.group('🚨 Error Report');
    console.error('Error:', errorData);
    console.groupEnd();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6 border border-red-100 dark:border-gray-700">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                  We're sorry, but something unexpected happened.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Our team has been notified and we're working to fix this issue.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={this.handleReload}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </button>
              </div>
            </div>

            {isDevelopment && this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                  Development Error Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Error Message:</h4>
                    <code className="block bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-sm text-red-800 dark:text-red-200 overflow-x-auto">
                      {this.state.error.message}
                    </code>
                  </div>
                  
                  {this.state.error.stack && (
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Stack Trace:</h4>
                      <pre className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-xs text-red-800 dark:text-red-200 overflow-x-auto max-h-60 overflow-y-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Component Stack:</h4>
                      <pre className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-xs text-red-800 dark:text-red-200 overflow-x-auto max-h-40 overflow-y-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;