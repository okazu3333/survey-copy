"use client";

import { AlertTriangle } from "lucide-react";
import { Component, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-brand-error mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            エラーが発生しました
          </h2>
          <p className="text-text-secondary mb-4">
            申し訳ございませんが、予期しないエラーが発生しました。
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary"
          >
            再試行
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
