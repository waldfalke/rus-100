import * as React from 'react'

/**
 * Хук для синхронизации ширины колонок между header и body таблицей
 */
export function useColumnWidths(isMobile: boolean, dependencies: any[] = []) {
  const desktopHeaderScrollRef = React.useRef<HTMLDivElement>(null)
  const desktopBodyScrollRef = React.useRef<HTMLDivElement>(null)
  const desktopHeaderTableRef = React.useRef<HTMLTableElement>(null)
  const desktopBodyTableRef = React.useRef<HTMLTableElement>(null)
  const [columnWidths, setColumnWidths] = React.useState<string[]>([])

  React.useEffect(() => {
    if (isMobile) return

    const headerScroll = desktopHeaderScrollRef.current
    const bodyScroll = desktopBodyScrollRef.current
    const headerTable = desktopHeaderTableRef.current
    const bodyTable = desktopBodyTableRef.current

    if (!headerScroll || !bodyScroll || !headerTable || !bodyTable) return

    // Функция синхронизации ширин колонок
    const syncColumnWidths = () => {
      const headerCells = Array.from(headerTable.querySelectorAll('thead tr:first-child th'))

      // Устанавливаем фиксированные ширины без измерения
      const widths = headerCells.map((headerCell, idx) => {
        // Первая колонка (студент) - 200px
        if (idx === 0) return 200
        // Остальные колонки - 70px
        return 70
      })

      // Устанавливаем fixed layout
      headerTable.style.tableLayout = 'fixed'
      bodyTable.style.tableLayout = 'fixed'

      // Вычисляем общую ширину таблицы
      const totalWidth = widths.reduce((sum, w) => sum + w, 0)

      // Устанавливаем минимальную ширину для обеих таблиц
      headerTable.style.minWidth = `${totalWidth}px`
      bodyTable.style.minWidth = `${totalWidth}px`

      // Сохраняем вычисленные ширины в state
      setColumnWidths(widths.map(w => `${w}px`))
    }

    // Синхронизация горизонтального скролла
    const syncFromHeader = () => {
      bodyScroll.scrollLeft = headerScroll.scrollLeft
    }

    const syncFromBody = () => {
      headerScroll.scrollLeft = bodyScroll.scrollLeft
    }

    // Первичная синхронизация ширин
    syncColumnWidths()

    // Слушаем события скролла
    headerScroll.addEventListener('scroll', syncFromHeader)
    bodyScroll.addEventListener('scroll', syncFromBody)

    // ResizeObserver для динамического пересчёта ширин
    const resizeObserver = new ResizeObserver(() => {
      syncColumnWidths()
    })

    if (headerTable.parentElement) {
      resizeObserver.observe(headerTable.parentElement)
    }

    return () => {
      if (headerScroll) {
        headerScroll.removeEventListener('scroll', syncFromHeader)
      }
      if (bodyScroll) {
        bodyScroll.removeEventListener('scroll', syncFromBody)
      }
      resizeObserver.disconnect()
    }
  }, [isMobile, ...dependencies])

  return {
    desktopHeaderScrollRef,
    desktopBodyScrollRef,
    desktopHeaderTableRef,
    desktopBodyTableRef,
    columnWidths
  }
}
