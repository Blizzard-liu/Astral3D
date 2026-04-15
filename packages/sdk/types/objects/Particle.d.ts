declare namespace IParticle {
  interface Config {
    attr: {
      position: { x: number, y: number, z: number },
      rotation: { x: number, y: number, z: number },
      scale: number,
      // 总发射次数
      totalEmitTimes: number;
      // 发射器的阻尼系数
      damping: number;
      // 发射器的寿命(ms)
      life: number;
      // 发射粒子的数量范围
      numPan: {
        min: number;
        max: number;
      },
      // 每次粒子发射之间的时间间隔(s)
      timePan: {
        a: number;
        b: number;
      }
    },
    init: {
      // 粒子质量
      mass: {
        min: number;
        max: number;
        // 确定是否对质量值进行平均
        center: boolean;
        isEnabled: boolean;
      },
      // 粒子的生命值属性
      life: {
        min: number;
        max: number;
        center: boolean;
        isEnabled: boolean;
      },
      // 粒子的半径属性
      radius: {
        width: number;
        height: number;
        center: boolean;
        isEnabled: boolean;
      },
      // 粒子的旋转属性
      rotation: {
        x: number;
        y: number;
        z: number;
        useEmitterRotation: boolean;
        isEnabled: boolean;
      },
      // 粒子起始区域（从此区域中随机设置初始化粒子的起始位置属性）
      position: {
        isEnabled: boolean;
        // 可生成起始粒子的区域
        zone: BoxZone | LineZone | MeshZone | PointZone | SphereZone | null
      },
      // 粒子的速度属性
      velocity: {
        isEnabled: boolean;
        velocity: RadialVelocity | PolarVelocity | VectorVelocity | null
      }
      // 粒子主体
      body: {
        isEnabled: boolean;
        body: {
          // 粒子的形状,Sprite | Mesh | Point
          type: 'Sprite' | 'Mesh' | 'Point';
          uuid: string;
        } | null;
      }
    },
    // 行为类（behaviours）负责管理粒子在被发射之后的行为。也就是说，粒子在被发射出来之后，它的运动轨迹、速度变化、颜色变化等行为特征是由这些行为类来控制和管理的
    behaviour: {
      // 随时间改变粒子颜色的行为。
      color: {
        colorA: number | string;
        colorB: number | string;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 缩放粒子的行为
      scale: {
        scaleA: number;
        scaleB: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 对粒子应用阿尔法转换效果的行为
      alpha: {
        alphaA: number;
        alphaB: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 迫使粒子沿特定轴线运动的行为,fx，fy，fz在计算时会 * 100
      force: {
        fx: number;
        fy: number;
        fz: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 旋转粒子的行为
      rotate: {
        x: number;
        y: number;
        z: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 导致粒子在三维空间中随机坐标漂移的行为
      randomDrift: {
        driftX: number;
        driftY: number;
        driftZ: number;
        delay: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 使粒子弹起的行为
      spring: {
        x: number;
        y: number;
        z: number;
        // 弹跳系数
        spring: number;
        // 弹跳摩擦
        friction: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 使粒子被吸引到目标位置的行为
      attraction:{
        x: number;
        y: number;
        z: number;
        force: number;
        radius: number;
        life: number;
        easing: string;
        isEnabled: boolean;
      },
      // 使粒子远离与其碰撞的其他粒子的行为
      collision:{
        useMass: boolean;
        life: number;
        easing: string;
        isEnabled: boolean;
      }
    },
  }

  interface Object3DJSON {
    uuid: string;
    type: string;
    name: string;
    // 粒子发射器JSON
    emitter: {
      // 粒子发射器配置
      config: Config;
      // 粒子发射器系统名称
      system: string;
      // 粒子发射器用到的初始化器类型
      useInitializers: string[];
      // 粒子发射器初始化器对象中用到的Sprite或Mesh JSON
      bodyObjectJSON: import('three').Object3DJSON | null;
      // 粒子发射器用到的行为类型
      useBehaviours: string[];
    };
    children: [];
  }

  // 盒型区域
  interface BoxZone {
    type: 'BoxZone';
    depth: number;
    height: number;
    width: number;
    x: number;
    y: number;
    z: number;
  }

  // 线性区域
  interface LineZone {
    type: 'LineZone';
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    z1: number;
    z2: number;
  }

  // 网格(Mesh)区域
  interface MeshZone {
    type: 'MeshZone';
    mesh: any;
    scale: number;
  }

  // 点区域
  interface PointZone {
    type: 'PointZone';
    x: number;
    y: number;
    z: number;
  }

  // 球区域
  interface SphereZone {
    type: 'SphereZone';
    radius: number;
    x: number;
    y: number;
    z: number;
  }

  // 径向速度：物体在其半径矢量方向上的速度分量
  interface RadialVelocity {
    type: 'RadialVelocity';
    radius: number;
    x: number;
    y: number;
    z: number;
    theta: number;
  }

  // 极坐标速度
  interface PolarVelocity {
    type: 'PolarVelocity';
    radius: number;
    theta: number;
    phi: number;
    tha: number;
  }

  // 矢量速度
  interface VectorVelocity {
    type: 'VectorVelocity';
    x: number;
    y: number;
    z: number;
    theta: number;
  }
}