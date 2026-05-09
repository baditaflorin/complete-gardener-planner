import type { GardenInputErrorDetails } from './types'

export type PhotoAnalysisState<Result> =
  | { status: 'idle'; requestId: number }
  | { status: 'validating'; requestId: number; filename: string }
  | { status: 'analyzing'; requestId: number; filename: string; progress: string }
  | { status: 'ready'; requestId: number; filename: string; result: Result }
  | { status: 'error-recoverable'; requestId: number; filename?: string; error: GardenInputErrorDetails }
  | { status: 'cancelled'; requestId: number; filename?: string }

export type PhotoAnalysisAction<Result> =
  | { type: 'start'; requestId: number; filename: string }
  | { type: 'progress'; requestId: number; progress: string }
  | { type: 'ready'; requestId: number; filename: string; result: Result }
  | { type: 'error'; requestId: number; filename?: string; error: GardenInputErrorDetails }
  | { type: 'cancel'; requestId: number; filename?: string }
  | { type: 'reset' }

export function photoAnalysisReducer<Result>(
  state: PhotoAnalysisState<Result>,
  action: PhotoAnalysisAction<Result>,
): PhotoAnalysisState<Result> {
  if ('requestId' in action && action.requestId < state.requestId) {
    return state
  }

  switch (action.type) {
    case 'start':
      return { status: 'validating', requestId: action.requestId, filename: action.filename }
    case 'progress':
      return state.requestId === action.requestId
        ? {
            status: 'analyzing',
            requestId: action.requestId,
            filename: 'filename' in state && state.filename ? state.filename : 'photo',
            progress: action.progress,
          }
        : state
    case 'ready':
      return {
        status: 'ready',
        requestId: action.requestId,
        filename: action.filename,
        result: action.result,
      }
    case 'error':
      return {
        status: 'error-recoverable',
        requestId: action.requestId,
        filename: action.filename,
        error: action.error,
      }
    case 'cancel':
      return { status: 'cancelled', requestId: action.requestId, filename: action.filename }
    case 'reset':
      return { status: 'idle', requestId: state.requestId }
  }
}
