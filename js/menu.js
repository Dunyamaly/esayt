document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('navBurger')
  var navList = document.getElementById('navList')

  // Bu səhifədə menyu yoxdursa, heç nə etmə
  if (!burger || !navList) return

  var menuItems = navList.querySelectorAll('li')

  function closeMenu() {
    navList.classList.remove('is-open')
    burger.classList.remove('is-active')
    burger.setAttribute('aria-expanded', 'false')
  }

  burger.addEventListener('click', function () {
    var isOpen = navList.classList.toggle('is-open')

    menuItems.forEach(function (item, index) {
      item.style.setProperty('--delay', index * 0.17 + 's')
    })
    burger.classList.toggle('is-active', isOpen)
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  })

  // Linkə klikləyəndə menyunu bağla
  navList.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu)
  })

  // Menyudan kənara klikləyəndə bağla
  document.addEventListener('click', function (e) {
    if (!navList.contains(e.target) && !burger.contains(e.target)) {
      closeMenu()
    }
  })

  // Ekran genişlənəndə açıq menyunu sıfırla
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu()
  })
})
