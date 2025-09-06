'use client'

import { useState } from 'react'
import { simulateDependentWorker } from 'saldo'
import CodeEditor from '@uiw/react-textarea-code-editor'

const RunCode = ({ children, defaultCode }) => {
  const [code, setCode] = useState(defaultCode || children || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      // Create a safe execution environment
      const safeGlobals = {
        simulateDependentWorker,
        console: {
          log: (...args) => {
            const output = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
            setResult(prev => prev ? prev + '\n' + output : output)
          }
        }
      }

      // Create function with safe globals
      const func = new Function(...Object.keys(safeGlobals), code)
      
      // Execute the code
      await func(...Object.values(safeGlobals))
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRunning(false)
    }
  }

  return (
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
              Interactive Example
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
                Running...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h7m2-13h3a3 3 0 013 3v6a3 3 0 01-3 3h-1" />
                </svg>
                Run Code
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="relative">
        <CodeEditor
          value={code}
          language="js"
          placeholder="Enter your TypeScript/JavaScript code here..."
          onChange={(evn) => setCode(evn.target.value)}
          padding={16}
          style={{
            fontSize: 14,
            backgroundColor: 'transparent',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            minHeight: '200px'
          }}
          data-color-mode="auto"
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
                Console Output
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
  )
}

export default RunCode
