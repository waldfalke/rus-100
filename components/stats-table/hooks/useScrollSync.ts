import * as React from 'react'

/**
 * Хук для синхронизации горизонтального скролла между несколькими элементами
 */
export function useScrollSync(dependencies: any[] = []) {
  const headerScrollRef = React.useRef<HTMLDivElement>(null)
  const totalsScrollRef = React.useRef<HTMLDivElement>(null)
  const rowScrollRefs = React.useRef<(HTMLDivElement | null)[]>([])

  React.useEffect(() => {
    const headerScroll = headerScrollRef.current
    const totalsScroll = totalsScrollRef.current
    const rowScrolls = rowScrollRefs.current.filter((ref): ref is HTMLDivElement => ref !== null)

    if (!headerScroll || rowScrolls.length === 0) return

    const syncScroll = (source: HTMLDivElement, targets: HTMLDivElement[]) => {
      return () => {
        const scrollLeft = source.scrollLeft
        targets.forEach(target => {
          if (target !== source) {
            target.scrollLeft = scrollLeft
          }
        })
      }
    }

    // Собираем все элементы для синхронизации
    const allScrollElements = totalsScroll
      ? [headerScroll, totalsScroll, ...rowScrolls]
      : [headerScroll, ...rowScrolls]

    // Синхронизация от заголовка
    const headerScrollHandler = syncScroll(headerScroll, allScrollElements.filter(el => el !== headerScroll))
    headerScroll.addEventListener('scroll', headerScrollHandler)

    // Синхронизация от строки итого (если есть)
    let totalsScrollHandler: (() => void) | null = null
    if (totalsScroll) {
      totalsScrollHandler = syncScroll(totalsScroll, allScrollElements.filter(el => el !== totalsScroll))
      totalsScroll.addEventListener('scroll', totalsScrollHandler)
    }

    // Синхронизация от строк к другим элементам
    const rowScrollHandlers = rowScrolls.map(rowScroll => {
      const handler = syncScroll(rowScroll, allScrollElements.filter(el => el !== rowScroll))
      rowScroll.addEventListener('scroll', handler)
      return { element: rowScroll, handler }
    })

    return () => {
      if (headerScroll) {
        headerScroll.removeEventListener('scroll', headerScrollHandler)
      }
      if (totalsScroll && totalsScrollHandler) {
        totalsScroll.removeEventListener('scroll', totalsScrollHandler)
      }
      rowScrollHandlers.forEach(({ element, handler }) => {
        if (element) {
          element.removeEventListener('scroll', handler)
        }
      })
    }
  }, dependencies)

  return {
    headerScrollRef,
    totalsScrollRef,
    rowScrollRefs
  }
}
