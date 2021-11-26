const isApiError = (error: unknown): boolean => {
  return typeof error === 'object'
}

export default isApiError
