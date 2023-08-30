import React from "react";

interface State {
  error: Error | null | undefined
}

export interface ErrorBoundaryProps {
  id?: string
  errorMessage?: React.ReactNode | string;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<ErrorBoundaryProps>> {

  state: State = {
    error: null
  };

  static getDerivedStateFromError(error: Error) {
    return { error: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Uncaught error in component ${this.props.id ?? "unknown"}`, error, errorInfo);
  }

  render() {

    if (this.state.error) {
      if (typeof this.props.errorMessage === "string") {
        return <span>{this.props.errorMessage}</span>;
      } else {
        return this.props.errorMessage;
      }
    }

    return this.props.children;
  }
}
