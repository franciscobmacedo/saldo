// Format currency values
export function formatCurrency(value, locale = 'pt-PT') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Format percentage values
export function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`
}

// Format bracket limit
export function formatBracketLimit(bracket, locale = 'pt-PT') {
  if (bracket.signal === "min") {
    return `≥ ${formatCurrency(bracket.limit, locale)}`
  } else {
    return `≤ ${formatCurrency(bracket.limit, locale)}`
  }
}

// Format date range from YYYY-MM-DD_YYYY-MM-DD to human readable format
export function formatDateRange(dateRange, locale = 'en-US') {
  if (!dateRange || typeof dateRange !== 'string') return dateRange
  
  const [startDate, endDate] = dateRange.split('_')
  if (!startDate || !endDate) return dateRange
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const startFormatted = start.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric' 
    })
    const endFormatted = end.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric' 
    })
    const year = start.getFullYear()
    
    return `${startFormatted} - ${endFormatted}, ${year}`
  } catch {
    return dateRange
  }
}

// Generate GitHub URL for a tax table
export function generateGitHubUrl(tableId) {
  const baseUrl = "https://github.com/franciscobmacedo/saldo/blob/main/src/data/retention-tax-tables"
  return `${baseUrl}/${tableId}.json`
}
