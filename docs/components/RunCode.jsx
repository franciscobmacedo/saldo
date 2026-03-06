'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FrequencyChoices, simulateDependentWorker, simulateIndependentWorker, Twelfths } from 'saldo'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { getLangFromPath } from '@/lib/i18n'

const COPY = {
  pt: {
    title: 'Exemplo Interativo',
    running: 'A executar...',
    runCode: 'Executar Codigo',
    output: 'Saida da Consola',
    placeholder: `// Exemplo com imports disponiveis automaticamente:
// simulateDependentWorker, simulateIndependentWorker,
// Twelfths e FrequencyChoices

const result = simulateDependentWorker({
  year: 2025,
  income: 2000,
  location: 'continent',
  twelfths: Twelfths.TWO_MONTHS
});

console.log(result.yearly.totalNetIncomeAmount);`,
    referenceError: 'Erro de referencia',
    syntaxError: 'Erro de sintaxe',
    availableSymbols: 'Simbolos disponiveis',
    syntaxHint: 'Verifica a sintaxe JavaScript.',
  },
  en: {
    title: 'Interactive Example',
    running: 'Running...',
    runCode: 'Run Code',
    output: 'Console Output',
    placeholder: `// Example with imports available automatically:
// simulateDependentWorker, simulateIndependentWorker,
// Twelfths and FrequencyChoices

const result = simulateDependentWorker({
  year: 2025,
  income: 2000,
  location: 'continent',
  twelfths: Twelfths.TWO_MONTHS
});

console.log(result.yearly.totalNetIncomeAmount);`,
    referenceError: 'Reference Error',
    syntaxError: 'Syntax Error',
    availableSymbols: 'Available symbols',
    syntaxHint: 'Check your JavaScript syntax.',
  },
}

const RunCode = ({ children, defaultCode }) => {
  const pathname = usePathname()
  const lang = getLangFromPath(pathname)
  const copy = COPY[lang]

  const [code, setCode] = useState(defaultCode || children || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(isDark)
    }
    
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkDarkMode)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkDarkMode)
    }
  }, [])

  const runCode = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const safeGlobals = {
        simulateDependentWorker,
        simulateIndependentWorker,
        Twelfths,
        FrequencyChoices,
        console: {
          log: (...args) => {
            const output = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setResult(prev => prev ? prev + '\n' + output : output)
          },
          error: (...args) => {
            const output = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setResult(prev => prev ? prev + '\nERROR: ' + output : 'ERROR: ' + output)
          },
          warn: (...args) => {
            const output = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setResult(prev => prev ? prev + '\nWARN: ' + output : 'WARN: ' + output)
          }
        },
        JSON,
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Promise,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval
      }
      
      const func = new Function(...Object.keys(safeGlobals), code)
      const result = await func(...Object.values(safeGlobals))

      if (result !== undefined) {
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
        setResult(prev => prev ? prev + '\n' + output : output)
      }
      
    } catch (err) {
      let errorMessage = err.message
      
      if (err.message.includes('ReferenceError')) {
        errorMessage = `${copy.referenceError}: ${err.message}\n\n${copy.availableSymbols}: ${Object.keys(safeGlobals || {}).join(', ')}`
      } else if (err.message.includes('SyntaxError')) {
        errorMessage = `${copy.syntaxError}: ${err.message}\n\n${copy.syntaxHint}`
      }
      
      setError(errorMessage)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .code-editor-theme {
          --w-tc-editor-bgcolor: transparent !important;
          --w-tc-editor-gutters-bgcolor: transparent !important;
          --w-tc-editor-activeline-bgcolor: rgba(59, 130, 246, 0.1) !important;
        }
        
        .code-editor-theme.dark {
          --w-tc-editor-color: #e5e7eb !important;
          --w-tc-editor-selected-text-color: #1f2937 !important;
          --w-tc-editor-selected-text-bgcolor: #3b82f6 !important;
          --w-tc-editor-gutters-color: #6b7280 !important;
          --w-tc-editor-linenumber-color: #6b7280 !important;
          --w-tc-editor-cursor-color: #e5e7eb !important;
          --w-tc-editor-matchingbracket-color: #fbbf24 !important;
          --w-tc-editor-syntax-comment-color: #9ca3af !important;
          --w-tc-editor-syntax-keyword-color: #c084fc !important;
          --w-tc-editor-syntax-atom-color: #34d399 !important;
          --w-tc-editor-syntax-number-color: #34d399 !important;
          --w-tc-editor-syntax-def-color: #60a5fa !important;
          --w-tc-editor-syntax-variable-color: #60a5fa !important;
          --w-tc-editor-syntax-variable-2-color: #60a5fa !important;
          --w-tc-editor-syntax-variable-3-color: #60a5fa !important;
          --w-tc-editor-syntax-property-color: #fbbf24 !important;
          --w-tc-editor-syntax-operator-color: #e5e7eb !important;
          --w-tc-editor-syntax-string-color: #34d399 !important;
          --w-tc-editor-syntax-string-2-color: #34d399 !important;
          --w-tc-editor-syntax-meta-color: #e5e7eb !important;
          --w-tc-editor-syntax-qualifier-color: #c084fc !important;
          --w-tc-editor-syntax-builtin-color: #c084fc !important;
          --w-tc-editor-syntax-bracket-color: #e5e7eb !important;
          --w-tc-editor-syntax-tag-color: #f87171 !important;
          --w-tc-editor-syntax-attribute-color: #fbbf24 !important;
          --w-tc-editor-syntax-header-color: #60a5fa !important;
          --w-tc-editor-syntax-quote-color: #34d399 !important;
          --w-tc-editor-syntax-hr-color: #6b7280 !important;
          --w-tc-editor-syntax-link-color: #60a5fa !important;
          --w-tc-editor-syntax-error-color: #f87171 !important;
          --w-tc-editor-syntax-invalidchar-color: #f87171 !important;
        }
        
        .code-editor-theme.light {
          --w-tc-editor-color: #1f2937 !important;
          --w-tc-editor-selected-text-color: #ffffff !important;
          --w-tc-editor-selected-text-bgcolor: #3b82f6 !important;
          --w-tc-editor-gutters-color: #6b7280 !important;
          --w-tc-editor-linenumber-color: #6b7280 !important;
          --w-tc-editor-cursor-color: #1f2937 !important;
          --w-tc-editor-matchingbracket-color: #d97706 !important;
          --w-tc-editor-syntax-comment-color: #6b7280 !important;
          --w-tc-editor-syntax-keyword-color: #7c3aed !important;
          --w-tc-editor-syntax-atom-color: #059669 !important;
          --w-tc-editor-syntax-number-color: #059669 !important;
          --w-tc-editor-syntax-def-color: #2563eb !important;
          --w-tc-editor-syntax-variable-color: #2563eb !important;
          --w-tc-editor-syntax-variable-2-color: #2563eb !important;
          --w-tc-editor-syntax-variable-3-color: #2563eb !important;
          --w-tc-editor-syntax-property-color: #d97706 !important;
          --w-tc-editor-syntax-operator-color: #1f2937 !important;
          --w-tc-editor-syntax-string-color: #059669 !important;
          --w-tc-editor-syntax-string-2-color: #059669 !important;
          --w-tc-editor-syntax-meta-color: #1f2937 !important;
          --w-tc-editor-syntax-qualifier-color: #7c3aed !important;
          --w-tc-editor-syntax-builtin-color: #7c3aed !important;
          --w-tc-editor-syntax-bracket-color: #1f2937 !important;
          --w-tc-editor-syntax-tag-color: #dc2626 !important;
          --w-tc-editor-syntax-attribute-color: #d97706 !important;
          --w-tc-editor-syntax-header-color: #2563eb !important;
          --w-tc-editor-syntax-quote-color: #059669 !important;
          --w-tc-editor-syntax-hr-color: #6b7280 !important;
          --w-tc-editor-syntax-link-color: #2563eb !important;
          --w-tc-editor-syntax-error-color: #dc2626 !important;
          --w-tc-editor-syntax-invalidchar-color: #dc2626 !important;
        }
      `}</style>
      <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Code Editor Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
              {copy.title}
            </span>
          </div>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {copy.running}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h7m2-13h3a3 3 0 013 3v6a3 3 0 01-3 3h-1" />
                </svg>
                {copy.runCode}
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`relative code-editor-theme ${isDarkMode ? 'dark' : 'light'}`}>
        <CodeEditor
          value={code}
          language="js"
          placeholder={copy.placeholder}
          onChange={(evn) => setCode(evn.target.value)}
          padding={16}
          style={{
            fontSize: 14,
            backgroundColor: 'transparent',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            minHeight: '200px',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
          }}
          data-color-mode={isDarkMode ? 'dark' : 'light'}
        />
      </div>

      {/* Output Section */}
      {(result || error) && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {copy.output}
              </span>
            </div>
          </div>
          <div className="p-4 bg-gray-950 dark:bg-black">
            {error ? (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap flex-1">
                  {error}
                </pre>
              </div>
            ) : (
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {result}
              </pre>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default RunCode
