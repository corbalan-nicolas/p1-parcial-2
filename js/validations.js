function isEmptyString(value) {
  return (typeof value === 'string' && value.trim() === '')
}

function isNumber(value) {
  return !isNaN(Number(value))
}

function isBetweenNumbers(value, min, max = Infinity) {
  return !isNaN(Number(value)) && (value >= min && value <= max)
}

function areDifferentStrings(value1, value2, caseSensitive = false) {
  if(caseSensitive) {
    return (typeof value1 === 'string' && typeof value2 === 'string') && value1.trim() !== value2.trim()
  }else {
    return (typeof value1 === 'string' && typeof value2 === 'string') && value1.trim().toLowerCase() !== value2.trim().toLowerCase()
  }
}

function isValidEmail(value) {
  value = value.trim()
  const bannedCharacters = ['?', '“', '#', '$', '%', '&', '`', '*', '+', '–', '_', '.', '/', '|', '\\', '^', '{', '}', '~']

  const localPart = value.substring(0, value.indexOf('@'))
  const domain = value.substring(value.indexOf('@'))
  
  const cond1 = domain.includes('@')
  const cond2 = localPart.length > 0
  const cond3 = domain.slice(2).includes('.')
  const cond4 = localPart.length <= 64
  let cond5 = true
  for(let chara of bannedCharacters) {
    if((localPart[0].includes(chara) || localPart[localPart.length - 1].includes(chara))) {
      cond5 = false
    }
  }
  
  if(cond1 && cond2 && cond3 && cond4 && cond5){
    return true    
  }else {
    return false
  }
}