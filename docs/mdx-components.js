import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import RunCode from './src/components/RunCode'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = components => ({
  ...docsComponents,
  RunCode,
  ...components
})
