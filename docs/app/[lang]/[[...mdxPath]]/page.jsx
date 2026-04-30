import { notFound } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'

const LOCALES = ['pt', 'en']

export const generateStaticParams = generateStaticParamsFor('mdxPath', 'lang')

export async function generateMetadata(props) {
  const params = await props.params
  if (!LOCALES.includes(params.lang)) notFound()
  try {
    const { metadata } = await importPage(params.mdxPath, params.lang)
    return metadata
  } catch {
    notFound()
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
  const params = await props.params
  if (!LOCALES.includes(params.lang)) notFound()
  let page
  try {
    page = await importPage(params.mdxPath, params.lang)
  } catch {
    notFound()
  }
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = page
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
