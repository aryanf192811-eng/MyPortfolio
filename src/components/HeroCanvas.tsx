import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

// Hero-section-only particle network — slightly dimmed, mouse-reactive
const N = 55
const MAX_LINK = 130
const REPEL_R = 90
const REPEL_F = 0.5

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const W = el.clientWidth || window.innerWidth
    const H = el.clientHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -100, 100)

    const pos: THREE.Vector3[] = []
    const vel: THREE.Vector3[] = []
    for (let i = 0; i < N; i++) {
      pos.push(new THREE.Vector3((Math.random() - 0.5) * W, (Math.random() - 0.5) * H, 0))
      vel.push(new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, 0))
    }

    const posArr = new Float32Array(N * 3)
    const dotGeo = new THREE.BufferGeometry()
    pos.forEach((p, i) => { posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y })
    dotGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))

    // Slightly dimmed vs the version we over-brightened
    const dotMat = new THREE.PointsMaterial({
      color: isDark ? 0x545454 : 0x909090,
      size: isDark ? 2.5 : 2.2,
      transparent: true,
      opacity: isDark ? 0.62 : 0.42,
    })
    scene.add(new THREE.Points(dotGeo, dotMat))

    const lineGeo = new THREE.BufferGeometry()
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x2e2e2e : 0xbbbbbb,
      transparent: true,
      opacity: isDark ? 0.28 : 0.2,
    })
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx = e.clientX - r.left - W / 2
      my = -(e.clientY - r.top - H / 2)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      for (let i = 0; i < N; i++) {
        const p = pos[i], v = vel[i]
        const dx = p.x - mx, dy = p.y - my
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        if (d < REPEL_R) { const f = ((REPEL_R - d) / REPEL_R) * REPEL_F; v.x += (dx / d) * f; v.y += (dy / d) * f }
        v.multiplyScalar(0.97)
        p.add(v)
        if (p.x < -W / 2) { p.x = -W / 2; v.x *= -1 }
        if (p.x > W / 2)  { p.x = W / 2;  v.x *= -1 }
        if (p.y < -H / 2) { p.y = -H / 2; v.y *= -1 }
        if (p.y > H / 2)  { p.y = H / 2;  v.y *= -1 }
        posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y
      }
      dotGeo.attributes.position.needsUpdate = true
      const la: number[] = []
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++)
          if (pos[i].distanceTo(pos[j]) < MAX_LINK)
            la.push(pos[i].x, pos[i].y, 0, pos[j].x, pos[j].y, 0)
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(la), 3))
      renderer.render(scene, cam)
    }
    tick()

    const onResize = () => {
      const W2 = el.clientWidth, H2 = el.clientHeight
      Object.assign(cam, { left: -W2 / 2, right: W2 / 2, top: H2 / 2, bottom: -H2 / 2 })
      cam.updateProjectionMatrix(); renderer.setSize(W2, H2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [isDark])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}
