import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs'
})

export default withNextra({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle TypeScript files from local packages
    config.resolve.extensions.push('.ts', '.tsx')
    
    // Add the parent src directory to the resolve paths
    if (process.env.NODE_ENV === 'development') {
      config.resolve.modules.push('../src/')
    }
    
    return config
  },
  ...(process.env.NODE_ENV === 'development' && { transpilePackages: ['saldo'] })
})
