import nextra from 'nextra'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
 
// Set up Nextra with its configuration
const withNextra = nextra({
  // Prefix locale in generated links so navigation works with the locale segment.
  unstable_shouldAddLocaleToLinks: true
})
 
// Export the final Next.js config with Nextra included
export default withNextra({
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
  },
  // Set the correct root directory for Turbopack
  turbopack: {
    root: __dirname
  }
})
