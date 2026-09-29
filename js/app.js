document.addEventListener('DOMContentLoaded', function () {
  /* =========================================================
     BURGER MENU
  ========================================================= */
  var burger = document.getElementById('navBurger')
  var navList = document.getElementById('navList')
  var menuItems = navList.querySelectorAll('li')

  if (burger && navList) {
    burger.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open')

      menuItems.forEach(function (item, index) {
        item.style.setProperty('--delay', `${index * 0.17}s`)
      })
      burger.classList.toggle('is-active', isOpen)
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    })

    // Menyudan bir linkə klikləyəndə menyunu bağla
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open')
        burger.classList.remove('is-active')
        burger.setAttribute('aria-expanded', 'false')
      })
    })

    // Menyudan kənara klikləyəndə bağla
    document.addEventListener('click', function (e) {
      var isClickInside = navList.contains(e.target) || burger.contains(e.target)
      if (!isClickInside) {
        navList.classList.remove('is-open')
        burger.classList.remove('is-active')
        burger.setAttribute('aria-expanded', 'false')
      }
    })

    // Ekran genişlənəndə (məs. mobil -> desktop) açıq menyunu sıfırla
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        navList.classList.remove('is-open')
        burger.classList.remove('is-active')
        burger.setAttribute('aria-expanded', 'false')
      }
    })
  }

  /* =========================================================
     DARK MODE TOGGLE
  ========================================================= */
  var themeToggle = document.getElementById('themeToggle')
  var htmlEl = document.documentElement

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      /* localStorage əlçatan deyilsə problem yaratmasın */
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      setTheme(current === 'dark' ? 'light' : 'dark')
    })

    // Toggle-un başlanğıc vəziyyətini indeksdəki inline skriptə uyğunlaşdır
    var initialTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    themeToggle.setAttribute('aria-pressed', initialTheme === 'dark' ? 'true' : 'false')
  }

  // İstifadəçi sistem mövzusunu dəyişəndə, əgər özü seçim etməyibsə, uyğunlaş
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null
      try {
        saved = localStorage.getItem('theme')
      } catch (err) {}
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }
})
