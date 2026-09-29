;(() => {
  const slider = document.querySelector('.testimonials__slider')
  const track = document.getElementById('reviewsTrack')

  if (!slider || !track) return

  // Yalnız real rəyləri götürürük.
  const originalSlides = Array.from(track.children).filter((slide) => !slide.dataset.clone)

  const total = originalSlides.length
  const AUTOPLAY_MS = 4000
  const RESUME_MS = 5000

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (total === 0) {
    slider.hidden = true
    return
  }

  if (total === 1) {
    slider.classList.add('is-single')
    return
  }

  // Təkrar başladılmanın qarşısını alırıq.
  if (slider.dataset.initialized === 'true') return
  slider.dataset.initialized = 'true'

  function makeClone(slide) {
    const clone = slide.cloneNode(true)

    clone.dataset.clone = 'true'
    clone.setAttribute('aria-hidden', 'true')
    clone.setAttribute('inert', '')

    return clone
  }

  // Sonsuz keçid üçün ilk və son rəyi klonlayırıq.
  track.insertBefore(makeClone(originalSlides[total - 1]), originalSlides[0])

  track.appendChild(makeClone(originalSlides[0]))

  const slides = Array.from(track.children)
  const firstReal = 1
  const lastReal = total

  let current = firstReal
  let autoplayTimer = null
  let resumeTimer = null
  let scrollEndTimer = null
  let isInteracting = false
  let isJumping = false

  // Kartı track-in tam mərkəzinə yerləşdirir.
  // Sabit kart eni və gap hesablaması tələb etmir.
  function getTargetLeft(index) {
    const slide = slides[index]

    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()

    return (
      track.scrollLeft + slideRect.left - trackRect.left - (track.clientWidth - slideRect.width) / 2
    )
  }

  function jumpTo(index) {
    isJumping = true

    track.style.scrollSnapType = 'none'
    track.style.scrollBehavior = 'auto'

    track.scrollLeft = getTargetLeft(index)
    current = index

    requestAnimationFrame(() => {
      track.style.scrollSnapType = ''

      requestAnimationFrame(() => {
        track.style.scrollBehavior = ''
        isJumping = false
      })
    })
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return

    current = index

    track.scrollTo({
      left: getTargetLeft(index),
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  // Faktiki olaraq mərkəzə ən yaxın kartı tapırıq.
  function getNearestIndex() {
    const trackRect = track.getBoundingClientRect()
    const trackCenter = trackRect.left + track.clientWidth / 2

    let nearestIndex = 0
    let nearestDistance = Infinity

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect()
      const slideCenter = rect.left + rect.width / 2
      const distance = Math.abs(trackCenter - slideCenter)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    return nearestIndex
  }

  function normalize() {
    if (isJumping) return

    const index = getNearestIndex()

    if (index === 0) {
      jumpTo(lastReal)
    } else if (index === slides.length - 1) {
      jumpTo(firstReal)
    } else {
      current = index
    }
  }

  // Sürüşmə tamamlandıqda indeks yenilənir.
  track.addEventListener(
    'scroll',
    () => {
      if (isJumping) return

      clearTimeout(scrollEndTimer)

      scrollEndTimer = setTimeout(normalize, 140)
    },
    { passive: true }
  )

  // Klaviatura ilə idarəetmə.
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      stopAutoplay()
      goTo(current - 1)
      scheduleResume()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      stopAutoplay()
      goTo(current + 1)
      scheduleResume()
    }
  })

  function startAutoplay() {
    if (autoplayTimer || isInteracting || document.hidden) {
      return
    }

    autoplayTimer = setInterval(() => {
      if (!isInteracting && !document.hidden) {
        goTo(current + 1)
      }
    }, AUTOPLAY_MS)
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }

  function scheduleResume() {
    clearTimeout(resumeTimer)

    resumeTimer = setTimeout(() => {
      isInteracting = false
      startAutoplay()
    }, RESUME_MS)
  }

  function beginInteraction() {
    isInteracting = true
    stopAutoplay()
    clearTimeout(resumeTimer)
  }

  function endInteraction() {
    scheduleResume()
  }

  // Desktop: kursor kartların üzərində olduqda dayanır.
  slider.addEventListener('mouseenter', beginInteraction)
  slider.addEventListener('mouseleave', () => {
    isInteracting = false
    startAutoplay()
  })

  // Mobil və toxunma ekranları.
  slider.addEventListener('pointerdown', beginInteraction)
  window.addEventListener('pointerup', endInteraction)
  window.addEventListener('pointercancel', endInteraction)

  // Klaviatura ilə fokus zamanı avtomatik keçid dayandırılır.
  slider.addEventListener('focusin', beginInteraction)

  slider.addEventListener('focusout', (event) => {
    if (!slider.contains(event.relatedTarget)) {
      isInteracting = false
      startAutoplay()
    }
  })

  // Başqa brauzer tabına keçdikdə taymer dayanır.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay()
      clearTimeout(resumeTimer)
    } else {
      startAutoplay()
    }
  })

  // Ölçü dəyişəndə aktiv kart mərkəzdə saxlanılır.
  let resizeTimer

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)

    resizeTimer = setTimeout(() => {
      jumpTo(current)
    }, 100)
  })

  // Başlanğıc: birinci real kart.
  requestAnimationFrame(() => {
    jumpTo(firstReal)
    startAutoplay()
  })
})()
