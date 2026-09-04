import { createContext, useCallback, useMemo, type ReactNode } from 'react'
import enMessages from './locales/en.json'

export type Messages = Record<string, string>
export type TranslateVars = Record<string, string | number>

const messages = enMessages as Messages

type LocaleContextValue = {
  locale: 'en'
  t: (key: string, vars?: TranslateVars) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const t = useCallback((key: string, vars?: TranslateVars) => {
    const template = messages[key] ?? key
    if (!vars) return template
    return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, rawName) => {
      const name = String(rawName).trim()
      const value = vars[name]
      return value === undefined ? match : String(value)
    })
  }, [])

  const value = useMemo<LocaleContextValue>(() => ({ locale: 'en', t }), [t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
