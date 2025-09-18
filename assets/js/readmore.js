export function setupReadMore(selector = '.read-more-toggle') {
  document.querySelectorAll(selector).forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()

      const id = this.getAttribute('data-id')
      const dots = document.getElementById(`dots-${id}`)
      const more = document.getElementById(`more-${id}`)

      if (!dots || !more) {
        console.warn(`Missing elements for ID: ${id}`)
        return
      }

      const isExpanded = more.classList.contains('show')

      dots.classList.toggle('hidden')
      more.classList.toggle('show')

      this.textContent = isExpanded ? 'View more' : 'View less'
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupReadMore()
})
