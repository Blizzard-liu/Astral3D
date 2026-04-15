import { SIZE_ATTENUATION_FACTOR } from '../../common/shaders/constants';
export const vertexShader = () => {
  return `
    uniform sampler2D uTexture;
    uniform vec2 atlasDim;

    attribute float size;
    attribute vec3 color;
    attribute float alpha;
    attribute vec2 texID;
    attribute float rotation;

    varying float vRotation;
    varying vec3 targetColor;
    varying float targetAlpha;
    varying vec4 tileRect;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      targetColor = color;
      targetAlpha = alpha;
      vRotation = rotation;

      vec2 tmin = floor(texID) / atlasDim;
      vec2 tmax = fract(texID);
      tileRect = vec4(tmin,tmax);

      gl_PointSize = ((size * ${SIZE_ATTENUATION_FACTOR}) / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
`;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9yZW5kZXJlci9HUFVSZW5kZXJlci9Nb2JpbGUvc2hhZGVycy92ZXJ0ZXhTaGFkZXIuanMiXSwibmFtZXMiOlsiU0laRV9BVFRFTlVBVElPTl9GQUNUT1IiLCJ2ZXJ0ZXhTaGFkZXIiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLHVCQUFULFFBQXdDLGdDQUF4QztBQUVBLE9BQU8sTUFBTUMsWUFBWSxHQUFHLE1BQU07QUFDaEMsU0FBUTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQ0QsdUJBQXdCO0FBQ3hEO0FBQ0E7QUFDQSxDQTVCRTtBQTZCRCxDQTlCTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNJWkVfQVRURU5VQVRJT05fRkFDVE9SIH0gZnJvbSAnLi4vLi4vY29tbW9uL3NoYWRlcnMvY29uc3RhbnRzJztcblxuZXhwb3J0IGNvbnN0IHZlcnRleFNoYWRlciA9ICgpID0+IHtcbiAgcmV0dXJuIGBcbiAgICB1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZTtcbiAgICB1bmlmb3JtIHZlYzIgYXRsYXNEaW07XG5cbiAgICBhdHRyaWJ1dGUgZmxvYXQgc2l6ZTtcbiAgICBhdHRyaWJ1dGUgdmVjMyBjb2xvcjtcbiAgICBhdHRyaWJ1dGUgZmxvYXQgYWxwaGE7XG4gICAgYXR0cmlidXRlIHZlYzIgdGV4SUQ7XG4gICAgYXR0cmlidXRlIGZsb2F0IHJvdGF0aW9uO1xuXG4gICAgdmFyeWluZyBmbG9hdCB2Um90YXRpb247XG4gICAgdmFyeWluZyB2ZWMzIHRhcmdldENvbG9yO1xuICAgIHZhcnlpbmcgZmxvYXQgdGFyZ2V0QWxwaGE7XG4gICAgdmFyeWluZyB2ZWM0IHRpbGVSZWN0O1xuXG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgdmVjNCBtdlBvc2l0aW9uID0gbW9kZWxWaWV3TWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKTtcbiAgICAgIHRhcmdldENvbG9yID0gY29sb3I7XG4gICAgICB0YXJnZXRBbHBoYSA9IGFscGhhO1xuICAgICAgdlJvdGF0aW9uID0gcm90YXRpb247XG5cbiAgICAgIHZlYzIgdG1pbiA9IGZsb29yKHRleElEKSAvIGF0bGFzRGltO1xuICAgICAgdmVjMiB0bWF4ID0gZnJhY3QodGV4SUQpO1xuICAgICAgdGlsZVJlY3QgPSB2ZWM0KHRtaW4sdG1heCk7XG5cbiAgICAgIGdsX1BvaW50U2l6ZSA9ICgoc2l6ZSAqICR7U0laRV9BVFRFTlVBVElPTl9GQUNUT1J9KSAvIC1tdlBvc2l0aW9uLnopO1xuICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbXZQb3NpdGlvbjtcbiAgICB9XG5gO1xufTtcbiJdfQ==