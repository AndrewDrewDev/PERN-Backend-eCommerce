import iuliia from 'iuliia'

const transliterateWord = (word: string): string => {
  return iuliia.translate(word, iuliia.ICAO_DOC_9303).replace(/ /, '-')
}

export default transliterateWord
