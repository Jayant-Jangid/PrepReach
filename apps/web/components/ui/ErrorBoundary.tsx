'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught exception:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-500 mb-4">An unexpected rendering error occurred.</p>
          <Button onClick={() => window.location.reload()} size="sm">Reload Page</Button>
        </div>
      )
    }
    return this.props.children
  }
}
