const topButton = document.getElementById('topButton')

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    topButton.classList.add('show')
  } else {
    topButton.classList.remove('show')
  }
})

topButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})
