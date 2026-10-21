import { Component } from 'react'
import type { ReactNode } from 'react'

export class ExperienceBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="error-page">
      <p className="scene-eyebrow">A little pause</p>
      <h1 className="scene-heading">Let's try that again.</h1>
      <p className="scene-body">Something didn't quite load. Your story can start again whenever you're ready.</p>
      <button className="primary-button" type="button" onClick={() => window.location.reload()}>Try again</button>
    </main>
    return this.props.children
  }
}
