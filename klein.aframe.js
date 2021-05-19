function kleinFunction(parameters) {
  const {
    h = 1, w = 1, width = 1 , w1 = 3 , l = -5,
    f = 2, f2 = 2, f3 = 3, f4 = 1, f5 = 1, f6 = 1
  } = parameters

  return (v, u, target) => {
    u *= Math.PI;
    v *= 2 * Math.PI;

    const hFactor = 1 - h
    const wFactor = 1 - w

    u = u * 2;
    let x, z;
    if ( u < Math.PI ) {
      x = w1 * Math.cos( u ) * ( f5 + Math.sin( u ) ) + ( f * ( f4 - Math.cos( u ) / f3 ) ) * Math.cos( u ) * Math.cos( v );
      z = l * Math.sin( u ) - f2 * ( f6 - Math.cos( u ) / 2 ) * Math.sin( u ) * Math.cos( v );
    } else {
      x = w1 * Math.cos( u ) * ( f5 + Math.sin( u ) ) + ( f * ( f4 - Math.cos( u ) / f3 ) ) * Math.cos( v + Math.PI );
      z = l * Math.sin( u );
    }
    const mOffset = (u - 1.5 * Math.PI) * 1.5
    const mFactor = Math.exp(- mOffset * mOffset)
    const hScale = 1 - mFactor * hFactor
    const wScale = 1 - mFactor * wFactor
    const y = - 2 * width * ( 1 - Math.cos( u ) / 2 ) * Math.sin( v ) * wScale;
    x *= hScale

    target.set( x, y, z );
  }
}

function buildEye() {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32, 0, Math.PI * 2, 0, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  )
  const eye = new THREE.Group()
  eye.add(ball)
  eye.add(pupil)
  return eye
}

AFRAME.registerComponent('klein', {
  schema: {
    color: {
      default: '#EEEEEE'
    },
    h: {
      default: 1
    },
    w: {
      default: 1
    },
    width: {
      default: 1
    },
    w1: {
      default: 3
    },
    l: {
      default: -5
    },
    f: {
      default: 2
    },
    f2: {
      default: 2
    },
    f3: {
      default: 3
    },
    f4: {
      default: 1
    },
    f5: {
      default: 1
    },
    f6: {
      default: 1
    },
  },

  init: function () {
  },

  update: function (oldData) {
      const el = this.el
      const color = this.data.color
      const side = THREE.DoubleSide
      const geometry = new THREE.ParametricGeometry(kleinFunction(this.data), 25, 25)
      const material = new THREE.MeshPhongMaterial({ color, side })
      const mesh = new THREE.Mesh(geometry, material)

      const leftEye = buildEye()
      leftEye.position.set(-1.2, -2.2, 4) //up, separation, depth
      leftEye.rotation.set(90, 0, 0)
      const rightEye = buildEye()
      rightEye.position.set(-1.2, 2.2, 4)
      rightEye.rotation.set(90, 0, 0)

      const object = new THREE.Group()
      object.add(mesh)
      object.add(leftEye)
      object.add(rightEye)
      el.setObject3D("mesh", object)
    },

})
