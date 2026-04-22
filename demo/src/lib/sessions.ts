import type { Evaluator } from 'poulpy-js/server'

// Module-level singleton — survives across requests in the same Node.js process.
declare global {
  // eslint-disable-next-line no-var
  var __pouplySessions: Map<string, Evaluator> | undefined
}

export const sessions: Map<string, Evaluator> =
  globalThis.__pouplySessions ?? (globalThis.__pouplySessions = new Map())
