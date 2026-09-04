import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Scrolls window to top on route changes.
 * Keeps navigation predictable when moving between long pages.
 * 
 * This component handles the common issue where scrolling down on one page
 * and then navigating to another page maintains the scroll position.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Save current scroll behavior
    const htmlElement = document.documentElement
    const originalScrollBehavior = htmlElement.style.scrollBehavior
    
    // Temporarily disable smooth scrolling for instant scroll to top
    htmlElement.style.scrollBehavior = 'auto'
    
    // Scroll to top using multiple methods for maximum browser compatibility
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Restore original scroll behavior after a small delay
    requestAnimationFrame(() => {
      htmlElement.style.scrollBehavior = originalScrollBehavior
    })
  }, [pathname])

  return null
}
