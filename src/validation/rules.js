const NAME_BLACKLIST = ['admin', 'test', 'null', 'undefined', 'fake']

const CARD_BRANDS = [
  { name: 'Visa', prefixes: ['4'], lengths: [16] },
  { name: 'Mastercard', prefixes: ['51', '52', '53', '54', '55'], lengths: [16] },
  { name: 'American Express', prefixes: ['34', '37'], lengths: [15] },
]

function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function validateName(value) {
  const name = String(value ?? '').trim()
  if (!name) return 'Name is required.'
  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
    return 'Use letters, spaces, hyphens, or apostrophes only.'
  }
  if (NAME_BLACKLIST.includes(name.toLowerCase())) {
    return 'That name is not allowed.'
  }
  return ''
}

export function validatePhone(value) {
  const phone = String(value ?? '').trim()
  if (!phone) return 'Phone number is required.'
  if (!/^(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/.test(phone)) {
    return 'Enter a valid North American phone number.'
  }
  return ''
}

export function validatePostalCode(value, country = 'CA') {
  const postal = String(value ?? '').trim().toUpperCase()
  if (!postal) return 'Postal / ZIP code is required.'

  if (country === 'US') {
    if (!/^\d{5}(?:-\d{4})?$/.test(postal)) return 'Enter a valid US ZIP code.'
    return ''
  }

  if (!/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/.test(postal)) {
    return 'Enter a valid Canadian postal code (A1A 1A1).'
  }
  return ''
}

export function detectCardBrand(number) {
  const digits = digitsOnly(number)
  return (
    CARD_BRANDS.find((brand) =>
      brand.prefixes.some((prefix) => digits.startsWith(prefix)),
    ) ?? null
  )
}

export function validateCardNumber(value) {
  const digits = digitsOnly(value)
  if (!digits) return 'Card number is required.'

  const brand = detectCardBrand(digits)
  if (!brand) return 'Card must start with a Visa, Mastercard, or Amex prefix.'
  if (!brand.lengths.includes(digits.length)) {
    return `${brand.name} numbers must be ${brand.lengths.join(' or ')} digits.`
  }
  return ''
}

export function validateExpiry(value) {
  const expiry = String(value ?? '').trim()
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    return 'Use MM/YY format.'
  }

  const [month, year] = expiry.split('/').map(Number)
  const now = new Date()
  const exp = new Date(2000 + year, month)
  if (exp <= now) return 'Card is expired.'
  return ''
}

export function validateCheckout(form) {
  return {
    name: validateName(form.name),
    phone: validatePhone(form.phone),
    postalCode: validatePostalCode(form.postalCode, form.country),
    cardNumber: validateCardNumber(form.cardNumber),
    expiry: validateExpiry(form.expiry),
  }
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}
