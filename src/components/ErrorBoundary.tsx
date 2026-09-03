import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#17191A] text-[#F3EFE4] flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full bg-[#20231F] border border-[#D6553C]/40 p-8 rounded text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#D6553C]/20 flex items-center justify-center text-[#D6553C] font-bold text-xl">
              !
            </div>
            <h1 className="text-xl font-bold mb-2 text-[#F3EFE4]">
              Application Recovery Mode
            </h1>
            <p className="text-sm text-[#9A9D8F] mb-6">
              A client runtime error was caught. Please reload to restore live state.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-[#17191A] text-[#D6553C] p-3 rounded mb-6 text-left overflow-x-auto border border-[#F3EFE4]/10">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E7A335] text-[#171412] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#F0B355] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
