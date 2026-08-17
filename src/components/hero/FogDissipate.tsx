import { useEffect, useRef } from 'react'
import { images } from '@/content/assets'
import { createProgram, loadImage, loadTexture } from '@/lib/webgl/gl'
import { fogFrag, fullscreenVert } from './shaders'

type Props = {
  mouse: { x: number; y: number }
  /** 0 = full fog, 1 = cleared */
  clear: number
  reduced: boolean
}

/**
 * Opening fog veil that parts over the landscape.
 */
export function FogDissipate({ mouse, clear, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef(mouse)
  const clearRef = useRef(clear)

  useEffect(() => {
    mouseRef.current = mouse
  }, [mouse])

  useEffect(() => {
    clearRef.current = clear
  }, [clear])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    })
    if (!gl) return

    let disposed = false
    let raf = 0
    let smokeTex: WebGLTexture | null = null

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const program = createProgram(gl, fullscreenVert, fogFrag)
    gl.useProgram(program)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uSmoke = gl.getUniformLocation(program, 'u_smoke')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uClear = gl.getUniformLocation(program, 'u_clear')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, reduced ? 1 : 1.75)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
    }

    const start = performance.now()

    loadImage(images.smokeAlpha).then((img) => {
      if (disposed) return
      smokeTex = loadTexture(gl, img, 0)
    })

    const frame = (now: number) => {
      if (disposed) return
      resize()
      if (!smokeTex) {
        raf = requestAnimationFrame(frame)
        return
      }

      // Skip drawing when fully clear (save GPU)
      if (clearRef.current > 0.985) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        raf = requestAnimationFrame(frame)
        return
      }

      gl.useProgram(program)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, smokeTex)
      gl.uniform1i(uSmoke, 0)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform1f(uClear, clearRef.current)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      if (smokeTex) gl.deleteTexture(smokeTex)
      gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
