document.addEventListener('DOMContentLoaded', function () {
  var themeToggle = document.getElementById('themeToggle')
  var htmlEl = document.documentElement

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {}
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      setTheme(current === 'dark' ? 'light' : 'dark')
    })

    var initialTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    themeToggle.setAttribute('aria-pressed', initialTheme === 'dark' ? 'true' : 'false')
  }

  // İstifadəçi özü seçim etməyibsə, sistem mövzusuna uyğunlaş
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
