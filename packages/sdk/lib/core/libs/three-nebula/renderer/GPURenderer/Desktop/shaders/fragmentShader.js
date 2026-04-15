export const fragmentShader = () => {
  return `
    uniform vec3 baseColor;
    uniform sampler2D uTexture;
    uniform sampler2D atlasIndex;

    varying float vRotation;
    varying vec3 targetColor;
    varying float targetAlpha;
    varying vec4 tileRect;
    varying float tileID;

    void main() {
      gl_FragColor = vec4(baseColor * targetColor, targetAlpha);

      vec2 uv = gl_PointCoord;
      uv = mix(tileRect.xy, tileRect.zw, gl_PointCoord);

      float mid = 0.5;
      uv = vec2(
        cos(vRotation) * (uv.x - mid) - sin(vRotation) * (uv.y - mid) + mid,
        cos(vRotation) * (uv.y - mid) + sin(vRotation) * (uv.x - mid) + mid
      );

      gl_FragColor = gl_FragColor * texture2D(uTexture, uv);

    }
`;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yZW5kZXJlci9HUFVSZW5kZXJlci9EZXNrdG9wL3NoYWRlcnMvZnJhZ21lbnRTaGFkZXIuanMiXSwibmFtZXMiOlsiZnJhZ21lbnRTaGFkZXIiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTUEsY0FBYyxHQUFHLE1BQU07QUFDbEMsU0FBUTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0ExQkU7QUEyQkQsQ0E1Qk0iLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSAoKSA9PiB7XG4gIHJldHVybiBgXG4gICAgdW5pZm9ybSB2ZWMzIGJhc2VDb2xvcjtcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCBhdGxhc0luZGV4O1xuXG4gICAgdmFyeWluZyBmbG9hdCB2Um90YXRpb247XG4gICAgdmFyeWluZyB2ZWMzIHRhcmdldENvbG9yO1xuICAgIHZhcnlpbmcgZmxvYXQgdGFyZ2V0QWxwaGE7XG4gICAgdmFyeWluZyB2ZWM0IHRpbGVSZWN0O1xuICAgIHZhcnlpbmcgZmxvYXQgdGlsZUlEO1xuXG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChiYXNlQ29sb3IgKiB0YXJnZXRDb2xvciwgdGFyZ2V0QWxwaGEpO1xuXG4gICAgICB2ZWMyIHV2ID0gZ2xfUG9pbnRDb29yZDtcbiAgICAgIHV2ID0gbWl4KHRpbGVSZWN0Lnh5LCB0aWxlUmVjdC56dywgZ2xfUG9pbnRDb29yZCk7XG5cbiAgICAgIGZsb2F0IG1pZCA9IDAuNTtcbiAgICAgIHV2ID0gdmVjMihcbiAgICAgICAgY29zKHZSb3RhdGlvbikgKiAodXYueCAtIG1pZCkgLSBzaW4odlJvdGF0aW9uKSAqICh1di55IC0gbWlkKSArIG1pZCxcbiAgICAgICAgY29zKHZSb3RhdGlvbikgKiAodXYueSAtIG1pZCkgKyBzaW4odlJvdGF0aW9uKSAqICh1di54IC0gbWlkKSArIG1pZFxuICAgICAgKTtcblxuICAgICAgZ2xfRnJhZ0NvbG9yID0gZ2xfRnJhZ0NvbG9yICogdGV4dHVyZTJEKHVUZXh0dXJlLCB1dik7XG5cbiAgICB9XG5gO1xufTtcbiJdfQ==