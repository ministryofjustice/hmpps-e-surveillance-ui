import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table[data-module="moj-sortable-table"]')
  if (!table) return

  table.querySelectorAll('thead th button').forEach(button => {
    button.addEventListener('click', event => {
      const $button = event.currentTarget
      const $heading = $button.parentElement
      const sortField = $button.getAttribute('data-sort-field') || $button.textContent.trim().replace(/\s+/g, '')

      let direction = $heading.getAttribute('aria-sort')
      direction = direction === 'ascending' ? 'desc' : 'asc'

      const url = new URL(window.location.href)
      url.searchParams.set('sort', `${sortField},${direction}`)
      url.searchParams.set('page', '0')

      window.location.href = url.toString()
    })
  })
})
