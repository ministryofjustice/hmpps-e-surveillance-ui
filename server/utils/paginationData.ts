export function getPaginationData(
  totalCount: number,
  currentPage: number, // 0-based from backend
  pageSize: number,
  baseUrl: string,
): PaginationData {
  const totalPages = Math.ceil(totalCount / pageSize)
  const from = currentPage * pageSize + 1
  const to = Math.min((currentPage + 1) * pageSize, totalCount)

  const items: PaginationItem[] = []
  const maxPagesToShow = 5

  const addPage = (page: number) => {
    items.push({
      text: (page + 1).toString(), // Display 1-based
      href: `${baseUrl}${page + 1}`, // Use 0-based in href
      selected: page === currentPage,
    })
  }

  if (totalPages <= maxPagesToShow) {
    for (let i = 0; i < totalPages; i++) {
      addPage(i)
    }
  } else {
    addPage(0) // first page

    if (currentPage > 2) {
      items.push({ type: 'dots' })
    }

    const startPage = Math.max(1, currentPage - 1)
    const endPage = Math.min(totalPages - 2, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      addPage(i)
    }

    if (currentPage < totalPages - 3) {
      items.push({ type: 'dots' })
    }

    addPage(totalPages - 1) // last page
  }

  const previous: PaginationLink | null =
    currentPage > 0 ? { text: 'Previous', href: `${baseUrl}${currentPage - 1}` } : null

  const next: PaginationLink | null =
    currentPage < totalPages - 1 ? { text: 'Next', href: `${baseUrl}${currentPage + 1}` } : null

  return {
    items,
    results: {
      count: totalCount,
      from,
      to,
      text: 'results',
    },
    previous,
    next,
  }
}

interface PaginationLink {
  text: string
  href: string
}

type PaginationItem =
  | {
      text: string
      href: string
      selected: boolean
    }
  | {
      type: 'dots'
    }

export type PaginationData = {
  items: PaginationItem[]
  results: {
    count: number
    from: number
    to: number
    text: string
  }
  previous: PaginationLink | null
  next: PaginationLink | null
}
