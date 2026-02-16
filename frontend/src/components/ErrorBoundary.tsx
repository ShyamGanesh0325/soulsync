import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md bg-gray-800 border border-red-500/30 rounded-3xl p-8 shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl text-white">⚡</span>
                        </div>
                        <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Frequency Mismatch</h1>
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            We encountered a soul-synchronization error. The vibes might be too strong for this session.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            Re-Sync Souls
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
