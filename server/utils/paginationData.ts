export function getPaginationData(
  totalCount: number,
  currentPage: number, // 1-based from backend or URL
  pageSize: number,
  baseUrl: string,
): PaginationData {
  const totalPages = Math.ceil(totalCount / pageSize)
  const from = (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalCount)

  const items: PaginationItem[] = []
  const maxPagesToShow = 5

  const addPage = (page: number) => {
    items.push({
      text: page.toString(), // Display 1-based
      href: `${baseUrl}${page}`, // Use 1-based in href
      selected: page === currentPage,
    })
  }

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      addPage(i)
    }
  } else {
    addPage(1) // first page

    if (currentPage > 3) {
      items.push({ type: 'dots' })
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      addPage(i)
    }

    if (currentPage < totalPages - 2) {
      items.push({ type: 'dots' })
    }

    addPage(totalPages) // last page
  }

  const previous: PaginationLink | null =
    currentPage > 1 ? { text: 'Previous', href: `${baseUrl}${currentPage - 1}` } : null

  const next: PaginationLink | null =
    currentPage < totalPages ? { text: 'Next', href: `${baseUrl}${currentPage + 1}` } : null

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
