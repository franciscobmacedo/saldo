// Format currency values
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-PT', {
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
export function formatBracketLimit(bracket) {
  if (bracket.signal === "min") {
    return `≥ ${formatCurrency(bracket.limit)}`
  } else {
    return `≤ ${formatCurrency(bracket.limit)}`
  }
}

// Format date range from YYYY-MM-DD_YYYY-MM-DD to human readable format
export function formatDateRange(dateRange) {
  if (!dateRange || typeof dateRange !== 'string') return dateRange
  
  const [startDate, endDate] = dateRange.split('_')
  if (!startDate || !endDate) return dateRange
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Format as "Jan 1 - Jul 31, 2025" or "Jan 1 - Dec 31, 2025"
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    const year = start.getFullYear()
    
    return `${startFormatted} - ${endFormatted}, ${year}`
  } catch (error) {
    // Fallback to original format if parsing fails
    return dateRange
  }
}

// Generate GitHub URL for a tax table
export function generateGitHubUrl(tableId) {
  const baseUrl = "https://github.com/franciscobmacedo/saldo/blob/main/src/data/retention-tax-tables"
  return `${baseUrl}/${tableId}.json`
}
