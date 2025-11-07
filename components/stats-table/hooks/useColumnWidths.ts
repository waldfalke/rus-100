import * as React from 'react'
import { StatColumn } from '../types'

/**
 * Хук для синхронизации ширины колонок между header и body таблицей
 */
export function useColumnWidths(
  isMobile: boolean,
  columns: StatColumn[],
  dependencies: any[] = []
) {
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
      // Генерируем ширины на основе реального количества колонок
      // 1 колонка студента (200px) + N колонок данных (80px для видимых, 0px для скрытых)
      const widths = [
        200,  // Колонка студента
        ...columns.map(col => col.isHidden ? 0 : 80)  // 0 для скрытых, 80 для видимых
      ]

      // Устанавливаем fixed layout
      headerTable.style.tableLayout = 'fixed'
      bodyTable.style.tableLayout = 'fixed'

      // Вычисляем общую ширину таблицы
      const totalWidth = widths.reduce((sum, w) => sum + w, 0)

      // Устанавливаем точную ширину для обеих таблиц (не minWidth!)
      // Это предотвращает растягивание первой колонки при collapse
      headerTable.style.width = `${totalWidth}px`
      bodyTable.style.width = `${totalWidth}px`

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
  }, [isMobile, columns, ...dependencies])

  return {
    desktopHeaderScrollRef,
    desktopBodyScrollRef,
    desktopHeaderTableRef,
    desktopBodyTableRef,
    columnWidths
  }
}
