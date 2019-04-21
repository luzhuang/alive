;(function (window, document, undefined) {
  // Strict Mode
  'use strict'

  // Constants
  var NAME = 'Parallax'
  var MAGIC_NUMBER = 30
  var DEFAULTS = {
    relativeInput: false,
    clipRelativeInput: false,
    calibrationThreshold: 100,
    calibrationDelay: 500,
    supportDelay: 500,
    calibrateX: false,
    calibrateY: true,
    invertX: true,
    invertY: true,
    limitX: false,
    limitY: false,
    scalarX: 10.0,
    scalarY: 10.0,
    frictionX: 0.1,
    frictionY: 0.1,
    originX: 0.5,
    originY: 0.5
  }

  function Parallax (element, options) {
    // DOM Context
    this.element = element
    this.layers = element.viewersList.filter(function(element) {
      return element.depth
    })

    // Compose Settings Object
    this.extend(this, DEFAULTS, options)

    // States
    this.calibrationTimer = null
    this.calibrationFlag = true
    this.enabled = false
    this.depths = []
    this.raf = null

    // Element Bounds
    this.bounds = null
    this.ex = 0
    this.ey = 0
    this.ew = 0
    this.eh = 0

    // Element Center
    this.ecx = 0
    this.ecy = 0

    // Element Range
    this.erx = 0
    this.ery = 0

    // Calibration
    this.cx = 0
    this.cy = 0

    // Input
    this.ix = 0
    this.iy = 0

    // Motion
    this.mx = 0
    this.my = 0

    // Velocity
    this.vx = 0
    this.vy = 0

    // Callbacks
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this)
    this.onOrientationTimer = this.onOrientationTimer.bind(this)
    this.onCalibrationTimer = this.onCalibrationTimer.bind(this)
    this.onAnimationFrame = this.onAnimationFrame.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    // Initialise
    this.initialise()
  }

  Parallax.prototype.extend = function () {
    if (arguments.length > 1) {
      var master = arguments[0]
      for (var i = 1, l = arguments.length; i < l; i++) {
        var object = arguments[i]
        for (var key in object) {
          master[key] = object[key]
        }
      }
    }
  }

  Parallax.prototype.data = function (element, name) {
    return this.deserialize(element.getAttribute('data-' + name))
  }

  Parallax.prototype.deserialize = function (value) {
    if (value === 'true') {
      return true
    } else if (value === 'false') {
      return false
    } else if (value === 'null') {
      return null
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return parseFloat(value)
    } else {
      return value
    }
  }

  Parallax.prototype.camelCase = function (value) {
    return value.replace(/-+(.)?/g, function (match, character) {
      return character ? character.toUpperCase() : ''
    })
  }

  Parallax.prototype.ww = null
  Parallax.prototype.wh = null
  Parallax.prototype.wcx = null
  Parallax.prototype.wcy = null
  Parallax.prototype.wrx = null
  Parallax.prototype.wry = null
  Parallax.prototype.portrait = null
  Parallax.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i)
  Parallax.prototype.motionSupport = !!window.DeviceMotionEvent
  Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent
  Parallax.prototype.orientationStatus = 0
  Parallax.prototype.propertyCache = {}

  Parallax.prototype.initialise = function () {
    // Setup
    this.updateLayers()
    this.updateDimensions()
    this.enable()
    this.queueCalibration(this.calibrationDelay)
  }

  Parallax.prototype.updateLayers = function () {
    // Cache Layer Elements
    this.layers = this.element.viewersList.filter(function(element) {
      return element.depth
    })
    this.depths = []

    // Configure Layer Styles
    for (var i = 0, l = this.layers.length; i < l; i++) {
      var layer = this.layers[i]
      // Cache Layer Depth
      this.depths.push(layer.depth)
    }
  }

  Parallax.prototype.updateDimensions = function () {
    this.ww = window.innerWidth
    this.wh = window.innerHeight
    this.wcx = this.ww * this.originX
    this.wcy = this.wh * this.originY
    this.wrx = Math.max(this.wcx, this.ww - this.wcx)
    this.wry = Math.max(this.wcy, this.wh - this.wcy)
  }

  Parallax.prototype.updateBounds = function () {
    this.ex = 0
    this.ey = 0
    this.ew = this.element.width
    this.eh = this.element.height
    this.ecx = this.ew * this.originX
    this.ecy = this.eh * this.originY
    this.erx = Math.max(this.ecx, this.ew - this.ecx)
    this.ery = Math.max(this.ecy, this.eh - this.ecy)
  }

  Parallax.prototype.queueCalibration = function (delay) {
    clearTimeout(this.calibrationTimer)
    this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay)
  }

  Parallax.prototype.enable = function () {
    if (!this.enabled) {
      this.enabled = true
      if (this.orientationSupport) {
        this.portrait = null
        window.addEventListener('deviceorientation', this.onDeviceOrientation)
        setTimeout(this.onOrientationTimer, this.supportDelay)
      } else {
        this.cx = 0
        this.cy = 0
        this.portrait = false
        window.addEventListener('mousemove', this.onMouseMove)
      }
      window.addEventListener('resize', this.onWindowResize)
      this.raf = requestAnimationFrame(this.onAnimationFrame)
    }
  }

  Parallax.prototype.disable = function () {
    if (this.enabled) {
      this.enabled = false
      if (this.orientationSupport) {
        window.removeEventListener('deviceorientation', this.onDeviceOrientation)
      } else {
        window.removeEventListener('mousemove', this.onMouseMove)
      }
      window.removeEventListener('resize', this.onWindowResize)
      cancelAnimationFrame(this.raf)
    }
  }

  Parallax.prototype.calibrate = function (x, y) {
    this.calibrateX = x === undefined ? this.calibrateX : x
    this.calibrateY = y === undefined ? this.calibrateY : y
  }

  Parallax.prototype.invert = function (x, y) {
    this.invertX = x === undefined ? this.invertX : x
    this.invertY = y === undefined ? this.invertY : y
  }

  Parallax.prototype.friction = function (x, y) {
    this.frictionX = x === undefined ? this.frictionX : x
    this.frictionY = y === undefined ? this.frictionY : y
  }

  Parallax.prototype.scalar = function (x, y) {
    this.scalarX = x === undefined ? this.scalarX : x
    this.scalarY = y === undefined ? this.scalarY : y
  }

  Parallax.prototype.limit = function (x, y) {
    this.limitX = x === undefined ? this.limitX : x
    this.limitY = y === undefined ? this.limitY : y
  }

  Parallax.prototype.origin = function (x, y) {
    this.originX = x === undefined ? this.originX : x
    this.originY = y === undefined ? this.originY : y
  }

  Parallax.prototype.clamp = function (value, min, max) {
    value = Math.max(value, min)
    value = Math.min(value, max)
    return value
  }

  Parallax.prototype.setPosition = function (element, x, y) {
    element.x = x
    element.y = y
    element._paint()
  }

  Parallax.prototype.onOrientationTimer = function () {
    if (this.orientationSupport && this.orientationStatus === 0) {
      this.disable()
      this.orientationSupport = false
      this.enable()
    }
  }

  Parallax.prototype.onCalibrationTimer = function () {
    this.calibrationFlag = true
  }

  Parallax.prototype.onWindowResize = function () {
    this.updateDimensions()
  }

  Parallax.prototype.onAnimationFrame = function () {
    this.updateBounds()
    var dx = this.ix - this.cx
    var dy = this.iy - this.cy
    if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
      this.queueCalibration(0)
    }
    if (this.portrait) {
      this.mx = this.calibrateX ? dy : this.iy
      this.my = this.calibrateY ? dx : this.ix
    } else {
      this.mx = this.calibrateX ? dx : this.ix
      this.my = this.calibrateY ? dy : this.iy
    }
    this.mx *= this.ew * (this.scalarX / 100)
    this.my *= this.eh * (this.scalarY / 100)
    if (!isNaN(parseFloat(this.limitX))) {
      this.mx = this.clamp(this.mx, -this.limitX, this.limitX)
    }
    if (!isNaN(parseFloat(this.limitY))) {
      this.my = this.clamp(this.my, -this.limitY, this.limitY)
    }
    this.vx += (this.mx - this.vx) * this.frictionX
    this.vy += (this.my - this.vy) * this.frictionY
    for (var i = 0, l = this.layers.length; i < l; i++) {
      var layer = this.layers[i]
      var depth = this.depths[i]
      var xOffset = this.vx * depth * (this.invertX ? -1 : 1)
      var yOffset = this.vy * depth * (this.invertY ? -1 : 1)
      this.setPosition(layer, xOffset, yOffset)
    }
    this.raf = requestAnimationFrame(this.onAnimationFrame)
  }

  Parallax.prototype.onDeviceOrientation = function (event) {
    // Validate environment and event properties.
    if (!this.desktop && event.beta !== null && event.gamma !== null) {
      // Set orientation status.
      this.orientationStatus = 1

      // Extract Rotation
      var x = (event.beta || 0) / MAGIC_NUMBER //  -90 :: 90
      var y = (event.gamma || 0) / MAGIC_NUMBER // -180 :: 180

      // Detect Orientation Change
      var portrait = this.wh > this.ww
      if (this.portrait !== portrait) {
        this.portrait = portrait
        this.calibrationFlag = true
      }

      // Set Calibration
      if (this.calibrationFlag) {
        this.calibrationFlag = false
        this.cx = x
        this.cy = y
      }

      // Set Input
      this.ix = x
      this.iy = y
    }
  }

  Parallax.prototype.onMouseMove = function (event) {
    // Cache mouse coordinates.
    var clientX = event.clientX
    var clientY = event.clientY

    // Calculate Mouse Input
    if (!this.orientationSupport && this.relativeInput) {
      // Clip mouse coordinates inside element bounds.
      if (this.clipRelativeInput) {
        clientX = Math.max(clientX, this.ex)
        clientX = Math.min(clientX, this.ex + this.ew)
        clientY = Math.max(clientY, this.ey)
        clientY = Math.min(clientY, this.ey + this.eh)
      }

      // Calculate input relative to the element.
      this.ix = (clientX - this.ex - this.ecx) / this.erx
      this.iy = (clientY - this.ey - this.ecy) / this.ery
    } else {
      // Calculate input relative to the window.
      this.ix = (clientX - this.wcx) / this.wrx
      this.iy = (clientY - this.wcy) / this.wry
    }
  }

  // Expose Parallax
  window[NAME] = Parallax
})(window, document)
