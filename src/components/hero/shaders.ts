export const fullscreenVert = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

/** 2.5D depth parallax + soft vignette on a photo + depth map */
export const depthFrag = `#version 300 es
precision highp float;

uniform sampler2D u_color;
uniform sampler2D u_depth;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_strength;
uniform float u_time;
uniform float u_intro;

in vec2 v_uv;
out vec4 outColor;

float sampleDepth(vec2 uv) {
  return texture(u_depth, clamp(uv, 0.0, 1.0)).r;
}

void main() {
  vec2 uv = v_uv;
  // Cover-fit letterbox against texture aspect handled in JS via UV scale;
  // here uv is already mapped to the visible plane.

  float d = sampleDepth(uv);
  // Near (white) moves more; far (black) stays put
  vec2 parallax = u_mouse * (d - 0.08) * u_strength;

  // Multi-tap along depth for fewer tears
  vec3 col = vec3(0.0);
  const int STEPS = 8;
  for (int i = 0; i < STEPS; i++) {
    float t = float(i) / float(STEPS - 1);
    vec2 suv = uv + parallax * t;
    float sd = sampleDepth(suv);
    // Prefer samples whose depth matches the travel amount
    float w = 1.0 - abs(sd - mix(d, 1.0, t)) * 1.6;
    w = max(w, 0.05);
    col += texture(u_color, clamp(suv, 0.0, 1.0)).rgb * w;
  }
  col /= float(STEPS) * 0.72;

  // Gentle breathing scale on intro settle
  float breathe = 1.0 + sin(u_time * 0.15) * 0.004 * u_intro;
  vec2 centered = (uv - 0.5) / breathe + 0.5;
  col = mix(col, texture(u_color, clamp(centered + parallax * 0.35, 0.0, 1.0)).rgb, 0.22);

  // Cinematic vignette
  float vig = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(1.15, 1.0)));
  col *= mix(0.72, 1.0, vig);

  // Warm lift near sun region
  float sun = exp(-length((uv - vec2(0.52, 0.42)) * vec2(1.4, 1.8)) * 3.2);
  col += vec3(1.0, 0.55, 0.18) * sun * 0.06 * u_intro;

  outColor = vec4(col, 1.0);
}
`

/** Volumetric-looking fog that parts over time + reacts to pointer */
export const fogFrag = `#version 300 es
precision highp float;

uniform sampler2D u_smoke;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_time;
uniform float u_clear; // 0 = full fog, 1 = clear

in vec2 v_uv;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);

  // Dual drifting smoke layers
  vec2 flowA = vec2(u_time * 0.018, -u_time * 0.012);
  vec2 flowB = vec2(-u_time * 0.014, u_time * 0.01);
  float s1 = texture(u_smoke, fract(uv * vec2(1.15, 1.0) + flowA)).r;
  float s2 = texture(u_smoke, fract(uv * vec2(1.6, 1.25) * 0.85 + flowB + 0.37)).r;
  float smoke = pow(clamp(s1 * 0.65 + s2 * 0.55, 0.0, 1.0), 0.92);

  // Soft noise fill so gaps still feel foggy at start
  float n = hash(uv * u_res * 0.35 + u_time * 0.2);
  smoke = mix(smoke, max(smoke, 0.55 + n * 0.15), 0.35);

  // Radial parting from slightly above center (sun-ish)
  vec2 center = vec2(0.5, 0.42);
  vec2 d = (uv - center) * vec2(aspect, 1.0);
  float radial = length(d);
  float part = smoothstep(0.15 + u_clear * 1.35, 0.0 + u_clear * 0.2, radial);

  // Pointer locally clears fog
  vec2 m = (u_mouse * 0.5 + 0.5);
  float pointerClear = smoothstep(0.28, 0.0, length((uv - m) * vec2(aspect, 1.0)));

  float density = smoke;
  density *= mix(1.0, 0.15, part);
  density *= mix(1.0, 0.55, pointerClear * (0.35 + u_clear * 0.65));
  density *= (1.0 - u_clear * 0.92);
  density = clamp(density, 0.0, 1.0);

  // Warm fog tint matching Guilin sunrise
  vec3 fogColor = mix(vec3(0.95, 0.78, 0.55), vec3(1.0, 0.92, 0.82), smoke);
  float alpha = density * mix(0.98, 0.12, u_clear);

  // Edge hold so the "door" feeling remains a moment longer
  float edge = smoothstep(0.55, 1.0, max(abs(uv.x - 0.5) * 1.6, abs(uv.y - 0.5) * 1.2));
  alpha = max(alpha, edge * (1.0 - u_clear) * 0.35);

  outColor = vec4(fogColor, alpha);
}
`
