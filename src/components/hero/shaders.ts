export const fullscreenVert = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

/** 2.5D depth parallax + doorway open + soft full-frame dawn */
export const depthFrag = `#version 300 es
precision highp float;

uniform sampler2D u_color;
uniform sampler2D u_depth;
uniform sampler2D u_glow;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_strength;
uniform float u_time;
uniform float u_intro;
uniform float u_sunrise;

in vec2 v_uv;
out vec4 outColor;

float sampleDepth(vec2 uv) {
  return texture(u_depth, clamp(uv, 0.0, 1.0)).r;
}

void main() {
  float aspect = u_res.x / max(u_res.y, 1.0);
  float open = clamp(u_intro, 0.0, 1.0);
  float dawn = clamp(u_sunrise, 0.0, 1.0);

  vec2 gate = vec2(0.40, 0.46);
  vec2 sunPos = vec2(0.52, 0.42);

  float zoom = mix(1.22, 1.0, open);
  vec2 uv = (v_uv - gate) / zoom + gate;

  float d = sampleDepth(uv);
  vec2 parallax = u_mouse * (d - 0.08) * u_strength * open;

  vec3 col = vec3(0.0);
  float wSum = 0.0;
  const int STEPS = 8;
  for (int i = 0; i < STEPS; i++) {
    float t = float(i) / float(STEPS - 1);
    vec2 suv = uv + parallax * t;
    float sd = sampleDepth(suv);
    float w = 1.0 - abs(sd - mix(d, 1.0, t)) * 1.6;
    w = max(w, 0.05);
    col += texture(u_color, clamp(suv, 0.0, 1.0)).rgb * w;
    wSum += w;
  }
  col /= max(wSum, 0.001);

  // Resting look = original photo
  vec3 plate = col;

  // —— Expanding light ring: noticeable wash that sweeps outward ——
  vec2 origin = vec2(0.50, 0.44);
  float dist = length((v_uv - origin) * vec2(aspect, 1.0));
  float cornerReach = length(vec2(0.62 * aspect, 0.62));
  float radius = mix(0.1, cornerReach + 0.12, dawn);
  float band = mix(0.1, 0.2, dawn);

  // Already-lit disk inside the ring
  float inside = 1.0 - smoothstep(radius - band * 0.65, radius + band * 0.15, dist);

  // Soft bright annulus on the expanding front (the “wave of light”)
  float ring = exp(-pow((dist - radius) / max(band * 0.55, 0.001), 2.0));
  ring *= (1.0 - smoothstep(0.88, 1.0, dawn));

  vec3 dim = plate * vec3(0.46, 0.49, 0.54) * 0.34;
  // Mid breath a bit stronger than the calm pass (~+10% peak), then home to plate
  float breath = sin(dawn * 3.14159265);
  float exposure = 1.0 + 0.1 * breath;
  col = mix(dim, plate * exposure, clamp(inside, 0.0, 1.0));

  // Ring highlight — warm, readable, not a hard white edge
  vec3 ringColor = vec3(1.0, 0.82, 0.55);
  col += ringColor * ring * (0.22 + 0.1 * breath);

  // Soft glow texture riding with the ring / center
  float glowScale = mix(0.35, 0.9, dawn);
  vec2 glowUV = (uv - sunPos) / max(glowScale, 0.05) + 0.5;
  vec3 glowTex = texture(u_glow, clamp(glowUV, 0.0, 1.0)).rgb;
  float glowLum = max(glowTex.r, max(glowTex.g, glowTex.b));
  col += glowTex * glowLum * (0.16 * ring + 0.1 * breath * inside);

  // Settle to true plate brightness
  col = mix(col, plate, smoothstep(0.78, 1.0, dawn));

  // Doorway aperture
  float slitX = mix(0.018, 1.55, open);
  float slitY = mix(0.12, 1.65, open);
  vec2 p = (v_uv - gate) * vec2(aspect, 1.0);
  float doorDist = length(p / vec2(slitX, slitY));
  float aperture = smoothstep(1.05, 0.62, doorDist);

  float wake = smoothstep(0.0, 0.12, open);
  float reveal = aperture * wake;
  col = mix(vec3(0.0), col, reveal);

  outColor = vec4(col, 1.0);
}
`

/** Kept for a later fog pass — not used in the current hero timeline. */
export const fogFrag = `#version 300 es
precision highp float;

uniform sampler2D u_smoke;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_time;
uniform float u_clear;

in vec2 v_uv;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);

  vec2 flowA = vec2(u_time * 0.018, -u_time * 0.012);
  vec2 flowB = vec2(-u_time * 0.014, u_time * 0.01);
  float s1 = texture(u_smoke, fract(uv * vec2(1.15, 1.0) + flowA)).r;
  float s2 = texture(u_smoke, fract(uv * vec2(1.6, 1.25) * 0.85 + flowB + 0.37)).r;
  float smoke = pow(clamp(s1 * 0.65 + s2 * 0.55, 0.0, 1.0), 0.92);

  float n = hash(uv * u_res * 0.35 + u_time * 0.2);
  smoke = mix(smoke, max(smoke, 0.55 + n * 0.15), 0.35);

  vec2 center = vec2(0.5, 0.42);
  vec2 d = (uv - center) * vec2(aspect, 1.0);
  float radial = length(d);
  float part = smoothstep(0.15 + u_clear * 1.35, 0.0 + u_clear * 0.2, radial);

  vec2 m = (u_mouse * 0.5 + 0.5);
  float pointerClear = smoothstep(0.28, 0.0, length((uv - m) * vec2(aspect, 1.0)));

  float density = smoke;
  density *= mix(1.0, 0.15, part);
  density *= mix(1.0, 0.55, pointerClear * (0.35 + u_clear * 0.65));
  density *= (1.0 - u_clear * 0.92);
  density = clamp(density, 0.0, 1.0);

  vec3 fogColor = mix(vec3(0.95, 0.78, 0.55), vec3(1.0, 0.92, 0.82), smoke);
  float alpha = density * mix(0.98, 0.12, u_clear);

  float edge = smoothstep(0.55, 1.0, max(abs(uv.x - 0.5) * 1.6, abs(uv.y - 0.5) * 1.2));
  alpha = max(alpha, edge * (1.0 - u_clear) * 0.35);

  outColor = vec4(fogColor, alpha);
}
`
