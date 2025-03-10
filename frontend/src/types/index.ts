interface ModelDetails {
  format: string
  fmaily: string
  families: string | null // has typo
  paramater_size: string
  quantization_level: string
}
export interface Model {
  name: string
  digest: string
  modified_at: string
  size: number
  details: ModelDetails
}
