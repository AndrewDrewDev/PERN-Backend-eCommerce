import { ProcessEnv } from '../types'

const getEnvVariable = (variableName: keyof ProcessEnv | string): string => {
  const value = process.env[variableName]

  if (variableName && value) {
    return value
  } else {
    throw new Error(
      `Variable {name: ${variableName}, value: ${value}} - not found in .env file`
    )
  }
}

export default getEnvVariable
