import { useEffect, useRef } from 'react'
import { images } from '@/content/assets'
import { createProgram, loadImage, loadTexture } from '@/lib/webgl/gl'
import { depthFrag, fullscreenVert } from './shaders'

type Props = {
  mouse: { x: number; y: number }
  intro: number
  sunrise: number
  reduced: boolean
}

function pickSources(wide: boolean) {
  return wide
    ? { color: images.guilinWide, depth: images.guilinWideDepth }
    : { color: images.guilinTall, depth: images.guilinTallDepth }
}

/**
 * Full-viewport WebGL photo with depth-map parallax + dawn lighting.
 */
export function DepthParallaxStage({ mouse, intro, sunrise, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef(mouse)
  const introRef = useRef(intro)
  const sunriseRef = useRef(sunrise)

  useEffect(() => {
    mouseRef.current = mouse
  }, [mouse])

  useEffect(() => {
    introRef.current = intro
  }, [intro])

  useEffect(() => {
    sunriseRef.current = sunrise
  }, [sunrise])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    let disposed = false
    let raf = 0
    let program: WebGLProgram | null = null
    let colorTex: WebGLTexture | null = null
    let depthTex: WebGLTexture | null = null
    let glowTex: WebGLTexture | null = null
    let currentWide: boolean | null = null
    let loading = false

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    program = createProgram(gl, fullscreenVert, depthFrag)
    gl.useProgram(program)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uColor = gl.getUniformLocation(program, 'u_color')
    const uDepth = gl.getUniformLocation(program, 'u_depth')
    const uGlow = gl.getUniformLocation(program, 'u_glow')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uRes = gl.getUniformLocation(program, 'u_res')
    const uStrength = gl.getUniformLocation(program, 'u_strength')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uIntro = gl.getUniformLocation(program, 'u_intro')
    const uSunrise = gl.getUniformLocation(program, 'u_sunrise')

    loadImage(images.sunGlow).then((img) => {
      if (disposed) return
      glowTex = loadTexture(gl, img, 2)
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
    }

    const loadForViewport = () => {
      const wide = window.matchMedia('(min-width: 1024px)').matches
      if (wide === currentWide || loading) return
      loading = true
      const src = pickSources(wide)
      Promise.all([loadImage(src.color), loadImage(src.depth)])
        .then(([colorImg, depthImg]) => {
          if (disposed) return
          if (colorTex) gl.deleteTexture(colorTex)
          if (depthTex) gl.deleteTexture(depthTex)
          colorTex = loadTexture(gl, colorImg, 0)
          depthTex = loadTexture(gl, depthImg, 1)
          currentWide = wide
        })
        .finally(() => {
          loading = false
        })
    }

    const start = performance.now()
    const frame = (now: number) => {
      if (disposed) return
      resize()
      loadForViewport()

      if (program && colorTex && depthTex && glowTex) {
        gl.useProgram(program)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, colorTex)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, depthTex)
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, glowTex)
        gl.uniform1i(uColor, 0)
        gl.uniform1i(uDepth, 1)
        gl.uniform1i(uGlow, 2)
        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uStrength, reduced ? 0.01 : 0.055)
        gl.uniform1f(uTime, (now - start) / 1000)
        gl.uniform1f(uIntro, introRef.current)
        gl.uniform1f(uSunrise, sunriseRef.current)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      currentWide = null
    }

    window.addEventListener('resize', onResize)
    loadForViewport()
    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (colorTex) gl.deleteTexture(colorTex)
      if (depthTex) gl.deleteTexture(depthTex)
      if (glowTex) gl.deleteTexture(glowTex)
      if (program) gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
