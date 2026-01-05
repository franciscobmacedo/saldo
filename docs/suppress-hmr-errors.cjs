// Suppress HMR ping errors (known issue with Next.js 15 + Turbopack + Nextra)
// This is a non-fatal error that occurs due to HMR protocol compatibility
process.on('unhandledRejection', (error) => {
  if (error?.message?.includes('unrecognized HMR message')) {
    // Silently ignore HMR ping errors - they're non-fatal and don't affect functionality
    return
  }
  // Re-throw other unhandled rejections
  throw error
})

