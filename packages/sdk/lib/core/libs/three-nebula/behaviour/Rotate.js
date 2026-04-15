import { DR, PI } from '../constants';
import { MathUtils, Vector3D, createSpan } from '../math';
import Behaviour from './Behaviour';
import { getEasingByName } from '../ease';
import { BEHAVIOUR_TYPE_ROTATE as type } from './types';
/**
 * Behaviour that rotates particles.
 */

export default class Rotate extends Behaviour {
  /**
   * Constructs a Rotate behaviour instance.
   *
   * @param {number} x - X axis rotation
   * @param {number} y - Y axis rotation
   * @param {number} z - Z axis rotation
   * @param {number} life - The life of the behaviour
   * @param {function} easing - The easing equation to use for transforms
   * @param {boolean} [isEnabled=true] - Determines if the behaviour will be applied or not
   * @return void
   */
  constructor(x, y, z, life = Infinity, easing, isEnabled = true) {
    super(life, easing, type, isEnabled);
    this.reset(x, y, z);
  }
  /**
   * Gets the rotation type.
   *
   * @return {string}
   */


  get rotationType() {
    return this._rotationType;
  }
  /**
   * Sets the rotation type.
   *
   * @param {string}
   * @return void
   */


  set rotationType(rotationType) {
    /**
     * @desc The rotation type. ENUM of ['same', 'set', 'to', 'add'].
     * @type {string}
     */
    this._rotationType = rotationType;
  }
  /**
   * Resets the behaviour properties.
   *
   * @param {number} x - X axis rotation
   * @param {number} y - Y axis rotation
   * @param {number} z - Z axis rotation
   * @param {number} life - the life of the behaviour
   * @param {function} easing - the easing equation to use for transforms
   * @return void
   */


  reset(x, y, z, life, easing) {
    /**
     * @desc X axis rotation.
     * @type {number|Span}
     */
    this.x = x || 0;
    /**
     * @desc Y axis rotation.
     * @type {number|Span}
     */

    this.y = y || 0;
    /**
     * @desc Z axis rotation.
     * @type {number|Span}
     */

    this.z = z || 0;

    if (x === undefined || x == 'same') {
      this.rotationType = 'same';
    } else if (y == undefined) {
      this.rotationType = 'set';
    } else if (z === undefined) {
      this.rotationType = 'to';
    } else {
      this.rotationType = 'add';
      this.x = createSpan(this.x * DR);
      this.y = createSpan(this.y * DR);
      this.z = createSpan(this.z * DR);
    }

    life && super.reset(life, easing);
  }
  /**
   * Initializes the behaviour on a particle.
   *
   * @param {object} particle - the particle to initialize the behaviour on
   * @return void
   */


  initialize(particle) {
    switch (this.rotationType) {
      case 'same':
        break;

      case 'set':
        this._setRotation(particle.rotation, this.x);

        break;

      case 'to':
        particle.transform.fR = particle.transform.fR || new Vector3D();
        particle.transform.tR = particle.transform.tR || new Vector3D();

        this._setRotation(particle.transform.fR, this.x);

        this._setRotation(particle.transform.tR, this.y);

        break;

      case 'add':
        particle.transform.addR = new Vector3D(this.x.getValue(), this.y.getValue(), this.z.getValue());
        break;
    }
  }
  /**
   * Sets the particle's rotation prior to the behaviour being applied.
   *
   * NOTE It's hard to see here, but this is mutating the particle's rotation
   * even though the particle is not being passed in directly.
   *
   * NOTE the else if below will never be reached because the value being passed in
   * will never be of type Vector3D.
   *
   * @param {Vector3D} particleRotation - the particle's rotation vector
   * @param {string|number} value - the value to set the rotation value to, if 'random'
   * rotation is randomised
   * @return void
   */


  _setRotation(particleRotation, value) {
    particleRotation = particleRotation || new Vector3D();

    if (value == 'random') {
      var x = MathUtils.randomAToB(-PI, PI);
      var y = MathUtils.randomAToB(-PI, PI);
      var z = MathUtils.randomAToB(-PI, PI);
      particleRotation.set(x, y, z);
    } // we can't ever get here because value will never be a Vector3D!
    // consider refactoring to
    //  if (value instance of Span) { vec3.add(value.getValue()); }
    else if (value instanceof Vector3D) {
      particleRotation.copy(value);
    }
  }
  /**
   * Mutates the particle.rotation property.
   *
   * @see http://stackoverflow.com/questions/21622956/how-to-convert-direction-vector-to-euler-angles
   * @param {object} particle - the particle to apply the behaviour to
   * @param {number} time - engine time
   * @param {integer} index - the particle index
   * @return void
   */


  mutate(particle, time, index) {
    this.energize(particle, time, index);

    switch (this.rotationType) {
      // orients the particle in the direction it is moving
      case 'same':
        if (!particle.rotation) {
          particle.rotation = new Vector3D();
        }

        particle.rotation.copy(particle.velocity);
        break;

      case 'set':
        //
        break;

      case 'to':
        particle.rotation.x = MathUtils.lerp(particle.transform.fR.x, particle.transform.tR.x, this.energy);
        particle.rotation.y = MathUtils.lerp(particle.transform.fR.y, particle.transform.tR.y, this.energy);
        particle.rotation.z = MathUtils.lerp(particle.transform.fR.z, particle.transform.tR.z, this.energy);
        break;

      case 'add':
        particle.rotation.add(particle.transform.addR);
        break;
    }
  }

  static fromJSON(json) {
    const {
      x,
      y,
      z,
      life,
      easing,
      isEnabled = true
    } = json;
    return new Rotate(x, y, z, life, getEasingByName(easing), isEnabled);
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iZWhhdmlvdXIvUm90YXRlLmpzIl0sIm5hbWVzIjpbIkRSIiwiUEkiLCJNYXRoVXRpbHMiLCJWZWN0b3IzRCIsImNyZWF0ZVNwYW4iLCJCZWhhdmlvdXIiLCJnZXRFYXNpbmdCeU5hbWUiLCJCRUhBVklPVVJfVFlQRV9ST1RBVEUiLCJ0eXBlIiwiUm90YXRlIiwiY29uc3RydWN0b3IiLCJ4IiwieSIsInoiLCJsaWZlIiwiZWFzaW5nIiwiaXNFbmFibGVkIiwicmVzZXQiLCJyb3RhdGlvblR5cGUiLCJfcm90YXRpb25UeXBlIiwidW5kZWZpbmVkIiwiaW5pdGlhbGl6ZSIsInBhcnRpY2xlIiwiX3NldFJvdGF0aW9uIiwicm90YXRpb24iLCJ0cmFuc2Zvcm0iLCJmUiIsInRSIiwiYWRkUiIsImdldFZhbHVlIiwicGFydGljbGVSb3RhdGlvbiIsInZhbHVlIiwicmFuZG9tQVRvQiIsInNldCIsImNvcHkiLCJtdXRhdGUiLCJ0aW1lIiwiaW5kZXgiLCJlbmVyZ2l6ZSIsInZlbG9jaXR5IiwibGVycCIsImVuZXJneSIsImFkZCIsImZyb21KU09OIiwianNvbiJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsRUFBVCxFQUFhQyxFQUFiLFFBQXVCLGNBQXZCO0FBQ0EsU0FBU0MsU0FBVCxFQUFvQkMsUUFBcEIsRUFBOEJDLFVBQTlCLFFBQWdELFNBQWhEO0FBRUEsT0FBT0MsU0FBUCxNQUFzQixhQUF0QjtBQUNBLFNBQVNDLGVBQVQsUUFBZ0MsU0FBaEM7QUFDQSxTQUFTQyxxQkFBcUIsSUFBSUMsSUFBbEMsUUFBOEMsU0FBOUM7QUFFQTtBQUNBO0FBQ0E7O0FBQ0EsZUFBZSxNQUFNQyxNQUFOLFNBQXFCSixTQUFyQixDQUErQjtBQUM1QztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0VLLEVBQUFBLFdBQVcsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQU9DLENBQVAsRUFBVUMsSUFBVixFQUFn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QmtCLEdBQWxCLENBQXNCcEIsUUFBUSxDQUFDRyxTQUFULENBQW1CRyxJQUF6QztBQUNBO0FBbENKO0FBb0NEOztBQUVjLFNBQVJlLFFBQVEsQ0FBQ0MsSUFBRCxFQUFPO0FBQ3BCLFVBQU07QUFBRWpDLE1BQUFBLENBQUY7QUFBS0MsTUFBQUEsQ0FBTDtBQUFRQyxNQUFBQSxDQUFSO0FBQVdDLE1BQUFBLElBQVg7QUFBaUJDLE1BQUFBLE1BQWpCO0FBQXlCQyxNQUFBQSxTQUFTLEdBQUc7QUFBckMsUUFBOEM0QixJQUFwRDtBQUVBLFdBQU8sSUFBSW5DLE1BQUosQ0FBV0UsQ0FBWCxFQUFjQyxDQUFkLEVBQWlCQyxDQUFqQixFQUFvQkMsSUFBcEIsRUFBMEJSLGVBQWUsQ0FBQ1MsTUFBRCxDQUF6QyxFQUFtREMsU0FBbkQsQ0FBUDtBQUNEOztBQTNNMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEUiwgUEkgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTWF0aFV0aWxzLCBWZWN0b3IzRCwgY3JlYXRlU3BhbiB9IGZyb20gJy4uL21hdGgnO1xuXG5pbXBvcnQgQmVoYXZpb3VyIGZyb20gJy4vQmVoYXZpb3VyJztcbmltcG9ydCB7IGdldEVhc2luZ0J5TmFtZSB9IGZyb20gJy4uL2Vhc2UnO1xuaW1wb3J0IHsgQkVIQVZJT1VSX1RZUEVfUk9UQVRFIGFzIHR5cGUgfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBCZWhhdmlvdXIgdGhhdCByb3RhdGVzIHBhcnRpY2xlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm90YXRlIGV4dGVuZHMgQmVoYXZpb3VyIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBSb3RhdGUgYmVoYXZpb3VyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFggYXhpcyByb3RhdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFkgYXhpcyByb3RhdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0geiAtIFogYXhpcyByb3RhdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gbGlmZSAtIFRoZSBsaWZlIG9mIHRoZSBiZWhhdmlvdXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZWFzaW5nIC0gVGhlIGVhc2luZyBlcXVhdGlvbiB0byB1c2UgZm9yIHRyYW5zZm9ybXNcbiAgICogQHBhcmFtIHtib29sZWFufSBbaXNFbmFibGVkPXRydWVdIC0gRGV0ZXJtaW5lcyBpZiB0aGUgYmVoYXZpb3VyIHdpbGwgYmUgYXBwbGllZCBvciBub3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih4LCB5LCB6LCBsaWZlLCBlYXNpbmcsIGlzRW5hYmxlZCA9IHRydWUpIHtcbiAgICBzdXBlcihsaWZlLCBlYXNpbmcsIHR5cGUsIGlzRW5hYmxlZCk7XG5cbiAgICB0aGlzLnJlc2V0KHgsIHksIHopO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHJvdGF0aW9uIHR5cGUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByb3RhdGlvblR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uVHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSByb3RhdGlvbiB0eXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ31cbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzZXQgcm90YXRpb25UeXBlKHJvdGF0aW9uVHlwZSkge1xuICAgIC8qKlxuICAgICAqIEBkZXNjIFRoZSByb3RhdGlvbiB0eXBlLiBFTlVNIG9mIFsnc2FtZScsICdzZXQnLCAndG8nLCAnYWRkJ10uXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLl9yb3RhdGlvblR5cGUgPSByb3RhdGlvblR5cGU7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBiZWhhdmlvdXIgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGF4aXMgcm90YXRpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBZIGF4aXMgcm90YXRpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IHogLSBaIGF4aXMgcm90YXRpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IGxpZmUgLSB0aGUgbGlmZSBvZiB0aGUgYmVoYXZpb3VyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGVhc2luZyAtIHRoZSBlYXNpbmcgZXF1YXRpb24gdG8gdXNlIGZvciB0cmFuc2Zvcm1zXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgcmVzZXQoeCwgeSwgeiwgbGlmZSwgZWFzaW5nKSB7XG4gICAgLyoqXG4gICAgICogQGRlc2MgWCBheGlzIHJvdGF0aW9uLlxuICAgICAqIEB0eXBlIHtudW1iZXJ8U3Bhbn1cbiAgICAgKi9cbiAgICB0aGlzLnggPSB4IHx8IDA7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzYyBZIGF4aXMgcm90YXRpb24uXG4gICAgICogQHR5cGUge251bWJlcnxTcGFufVxuICAgICAqL1xuICAgIHRoaXMueSA9IHkgfHwgMDtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjIFogYXhpcyByb3RhdGlvbi5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfFNwYW59XG4gICAgICovXG4gICAgdGhpcy56ID0geiB8fCAwO1xuXG4gICAgaWYgKHggPT09IHVuZGVmaW5lZCB8fCB4ID09ICdzYW1lJykge1xuICAgICAgdGhpcy5yb3RhdGlvblR5cGUgPSAnc2FtZSc7XG4gICAgfSBlbHNlIGlmICh5ID09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yb3RhdGlvblR5cGUgPSAnc2V0JztcbiAgICB9IGVsc2UgaWYgKHogPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yb3RhdGlvblR5cGUgPSAndG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvdGF0aW9uVHlwZSA9ICdhZGQnO1xuICAgICAgdGhpcy54ID0gY3JlYXRlU3Bhbih0aGlzLnggKiBEUik7XG4gICAgICB0aGlzLnkgPSBjcmVhdGVTcGFuKHRoaXMueSAqIERSKTtcbiAgICAgIHRoaXMueiA9IGNyZWF0ZVNwYW4odGhpcy56ICogRFIpO1xuICAgIH1cblxuICAgIGxpZmUgJiYgc3VwZXIucmVzZXQobGlmZSwgZWFzaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYmVoYXZpb3VyIG9uIGEgcGFydGljbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWNsZSAtIHRoZSBwYXJ0aWNsZSB0byBpbml0aWFsaXplIHRoZSBiZWhhdmlvdXIgb25cbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBpbml0aWFsaXplKHBhcnRpY2xlKSB7XG4gICAgc3dpdGNoICh0aGlzLnJvdGF0aW9uVHlwZSkge1xuICAgICAgY2FzZSAnc2FtZSc6XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZXQnOlxuICAgICAgICB0aGlzLl9zZXRSb3RhdGlvbihwYXJ0aWNsZS5yb3RhdGlvbiwgdGhpcy54KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RvJzpcbiAgICAgICAgcGFydGljbGUudHJhbnNmb3JtLmZSID0gcGFydGljbGUudHJhbnNmb3JtLmZSIHx8IG5ldyBWZWN0b3IzRCgpO1xuICAgICAgICBwYXJ0aWNsZS50cmFuc2Zvcm0udFIgPSBwYXJ0aWNsZS50cmFuc2Zvcm0udFIgfHwgbmV3IFZlY3RvcjNEKCk7XG4gICAgICAgIHRoaXMuX3NldFJvdGF0aW9uKHBhcnRpY2xlLnRyYW5zZm9ybS5mUiwgdGhpcy54KTtcbiAgICAgICAgdGhpcy5fc2V0Um90YXRpb24ocGFydGljbGUudHJhbnNmb3JtLnRSLCB0aGlzLnkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYWRkJzpcbiAgICAgICAgcGFydGljbGUudHJhbnNmb3JtLmFkZFIgPSBuZXcgVmVjdG9yM0QoXG4gICAgICAgICAgdGhpcy54LmdldFZhbHVlKCksXG4gICAgICAgICAgdGhpcy55LmdldFZhbHVlKCksXG4gICAgICAgICAgdGhpcy56LmdldFZhbHVlKClcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhcnRpY2xlJ3Mgcm90YXRpb24gcHJpb3IgdG8gdGhlIGJlaGF2aW91ciBiZWluZyBhcHBsaWVkLlxuICAgKlxuICAgKiBOT1RFIEl0J3MgaGFyZCB0byBzZWUgaGVyZSwgYnV0IHRoaXMgaXMgbXV0YXRpbmcgdGhlIHBhcnRpY2xlJ3Mgcm90YXRpb25cbiAgICogZXZlbiB0aG91Z2ggdGhlIHBhcnRpY2xlIGlzIG5vdCBiZWluZyBwYXNzZWQgaW4gZGlyZWN0bHkuXG4gICAqXG4gICAqIE5PVEUgdGhlIGVsc2UgaWYgYmVsb3cgd2lsbCBuZXZlciBiZSByZWFjaGVkIGJlY2F1c2UgdGhlIHZhbHVlIGJlaW5nIHBhc3NlZCBpblxuICAgKiB3aWxsIG5ldmVyIGJlIG9mIHR5cGUgVmVjdG9yM0QuXG4gICAqXG4gICAqIEBwYXJhbSB7VmVjdG9yM0R9IHBhcnRpY2xlUm90YXRpb24gLSB0aGUgcGFydGljbGUncyByb3RhdGlvbiB2ZWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSB0byBzZXQgdGhlIHJvdGF0aW9uIHZhbHVlIHRvLCBpZiAncmFuZG9tJ1xuICAgKiByb3RhdGlvbiBpcyByYW5kb21pc2VkXG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgX3NldFJvdGF0aW9uKHBhcnRpY2xlUm90YXRpb24sIHZhbHVlKSB7XG4gICAgcGFydGljbGVSb3RhdGlvbiA9IHBhcnRpY2xlUm90YXRpb24gfHwgbmV3IFZlY3RvcjNEKCk7XG4gICAgaWYgKHZhbHVlID09ICdyYW5kb20nKSB7XG4gICAgICB2YXIgeCA9IE1hdGhVdGlscy5yYW5kb21BVG9CKC1QSSwgUEkpO1xuICAgICAgdmFyIHkgPSBNYXRoVXRpbHMucmFuZG9tQVRvQigtUEksIFBJKTtcbiAgICAgIHZhciB6ID0gTWF0aFV0aWxzLnJhbmRvbUFUb0IoLVBJLCBQSSk7XG5cbiAgICAgIHBhcnRpY2xlUm90YXRpb24uc2V0KHgsIHksIHopO1xuICAgIH1cbiAgICAvLyB3ZSBjYW4ndCBldmVyIGdldCBoZXJlIGJlY2F1c2UgdmFsdWUgd2lsbCBuZXZlciBiZSBhIFZlY3RvcjNEIVxuICAgIC8vIGNvbnNpZGVyIHJlZmFjdG9yaW5nIHRvXG4gICAgLy8gIGlmICh2YWx1ZSBpbnN0YW5jZSBvZiBTcGFuKSB7IHZlYzMuYWRkKHZhbHVlLmdldFZhbHVlKCkpOyB9XG4gICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBWZWN0b3IzRCkge1xuICAgICAgcGFydGljbGVSb3RhdGlvbi5jb3B5KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTXV0YXRlcyB0aGUgcGFydGljbGUucm90YXRpb24gcHJvcGVydHkuXG4gICAqXG4gICAqIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTYyMjk1Ni9ob3ctdG8tY29udmVydC1kaXJlY3Rpb24tdmVjdG9yLXRvLWV1bGVyLWFuZ2xlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcGFydGljbGUgLSB0aGUgcGFydGljbGUgdG8gYXBwbHkgdGhlIGJlaGF2aW91ciB0b1xuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSAtIGVuZ2luZSB0aW1lXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gaW5kZXggLSB0aGUgcGFydGljbGUgaW5kZXhcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBtdXRhdGUocGFydGljbGUsIHRpbWUsIGluZGV4KSB7XG4gICAgdGhpcy5lbmVyZ2l6ZShwYXJ0aWNsZSwgdGltZSwgaW5kZXgpO1xuXG4gICAgc3dpdGNoICh0aGlzLnJvdGF0aW9uVHlwZSkge1xuICAgICAgLy8gb3JpZW50cyB0aGUgcGFydGljbGUgaW4gdGhlIGRpcmVjdGlvbiBpdCBpcyBtb3ZpbmdcbiAgICAgIGNhc2UgJ3NhbWUnOlxuICAgICAgICBpZiAoIXBhcnRpY2xlLnJvdGF0aW9uKSB7XG4gICAgICAgICAgcGFydGljbGUucm90YXRpb24gPSBuZXcgVmVjdG9yM0QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnRpY2xlLnJvdGF0aW9uLmNvcHkocGFydGljbGUudmVsb2NpdHkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgLy9cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RvJzpcbiAgICAgICAgcGFydGljbGUucm90YXRpb24ueCA9IE1hdGhVdGlscy5sZXJwKFxuICAgICAgICAgIHBhcnRpY2xlLnRyYW5zZm9ybS5mUi54LFxuICAgICAgICAgIHBhcnRpY2xlLnRyYW5zZm9ybS50Ui54LFxuICAgICAgICAgIHRoaXMuZW5lcmd5XG4gICAgICAgICk7XG4gICAgICAgIHBhcnRpY2xlLnJvdGF0aW9uLnkgPSBNYXRoVXRpbHMubGVycChcbiAgICAgICAgICBwYXJ0aWNsZS50cmFuc2Zvcm0uZlIueSxcbiAgICAgICAgICBwYXJ0aWNsZS50cmFuc2Zvcm0udFIueSxcbiAgICAgICAgICB0aGlzLmVuZXJneVxuICAgICAgICApO1xuICAgICAgICBwYXJ0aWNsZS5yb3RhdGlvbi56ID0gTWF0aFV0aWxzLmxlcnAoXG4gICAgICAgICAgcGFydGljbGUudHJhbnNmb3JtLmZSLnosXG4gICAgICAgICAgcGFydGljbGUudHJhbnNmb3JtLnRSLnosXG4gICAgICAgICAgdGhpcy5lbmVyZ3lcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2FkZCc6XG4gICAgICAgIHBhcnRpY2xlLnJvdGF0aW9uLmFkZChwYXJ0aWNsZS50cmFuc2Zvcm0uYWRkUik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBmcm9tSlNPTihqc29uKSB7XG4gICAgY29uc3QgeyB4LCB5LCB6LCBsaWZlLCBlYXNpbmcsIGlzRW5hYmxlZCA9IHRydWUgfSA9IGpzb247XG5cbiAgICByZXR1cm4gbmV3IFJvdGF0ZSh4LCB5LCB6LCBsaWZlLCBnZXRFYXNpbmdCeU5hbWUoZWFzaW5nKSwgaXNFbmFibGVkKTtcbiAgfVxufVxuIl19