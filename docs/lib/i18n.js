export const DEFAULT_LANG = "pt"

export function getLangFromPath(pathname) {
  if (!pathname || typeof pathname !== "string") {
    return DEFAULT_LANG
  }

  const parts = pathname.split("/").filter(Boolean)
  const first = parts[0]

  if (first === "pt" || first === "en") {
    return first
  }

  return DEFAULT_LANG
}

export function getLocaleFromLang(lang) {
  return lang === "en" ? "en-US" : "pt-PT"
}

export function isPortuguese(lang) {
  return lang !== "en"
}
