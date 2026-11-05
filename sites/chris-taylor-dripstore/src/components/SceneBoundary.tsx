import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

/**
 * If WebGL is unavailable (or the GPU context is lost) the hero keeps its
 * gradient and type instead of taking the page down with it.
 */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.warn('[dripstore] liquid scene disabled:', error.message, info.componentStack)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
