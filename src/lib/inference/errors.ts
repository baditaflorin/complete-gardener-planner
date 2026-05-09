import type { GardenInputErrorDetails, GardenInputErrorKind } from './types'

export class GardenInputError extends Error {
  readonly details: GardenInputErrorDetails

  constructor(details: GardenInputErrorDetails) {
    super(details.what)
    this.name = 'GardenInputError'
    this.details = details
  }
}

export function inputError(kind: GardenInputErrorKind, what: string, why: string, nowWhat: string) {
  return new GardenInputError({
    kind,
    what,
    why,
    nowWhat,
    recoverable: true,
  })
}

export function describeCaughtError(caught: unknown): GardenInputErrorDetails {
  if (caught instanceof GardenInputError) {
    return caught.details
  }
  return {
    kind: 'corrupt-image',
    what: 'The photo could not be read.',
    why: caught instanceof Error ? caught.message : 'The browser could not decode the image data.',
    nowWhat: 'Upload the original photo again as a JPEG or PNG.',
    recoverable: true,
  }
}
