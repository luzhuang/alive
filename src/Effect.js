import $extend from 'extend'
import GLOBAL from './lib/global'
import { easeMap } from './util/easeMap'
import Events from './events/BaseEvents'

// import svgPathProperties  from '@ali/svg-path-properties-for-Moying'
class Effect {
  /**
   * @param type
   * @param param
   */
  constructor (type, param) {
    if (!param) {
      throw new Error('Effect must hava param')
    }
    if (!type) {
      throw new Error('Effect must hava type')
    }
    this.type = type
    this.param = param
    this.delay = param.delay || 0
    this.duration = param.duration || 0
    this._state = this.lastState = 'not begin'
    this.events = new Events(this)
  }

  get target () {
    return this._target
  }

  set target (target) {
    this._target = target
    this._init()
  }


  set state (state) {
    if (state == this._state) return
    this.lastState = this._state
    this._state = state
  }

  get state () {
    return this._state
  }

  set delay (delay) {
    this._delay = delay
    this.totalTime = this.duration + this.delay
    this.delayFrames = delay / GLOBAL.RENDER_INTERVAL
  }

  get delay () {
    return this._delay
  }

  set duration (duration) {
    this._duration = duration
    this.totalTime = this.duration + this.delay
    this.frames = duration / GLOBAL.RENDER_INTERVAL || 1
  }

  get duration () {
    return this._duration || 0
  }

  check (frameIndex) {
    if (this.state === 'over') {
      return this.state
    }
    if (frameIndex * GLOBAL.RENDER_INTERVAL - this._delay > this._duration) {
      this.state = 'over'
    } else
    if (frameIndex * GLOBAL.RENDER_INTERVAL - this._delay < 0) {
      this.state = 'not begin'
    } else {
      this.state = 'run'
    }
    return this.state
  }

  reset () {
    let param = this.param
    this.delay = param.delay
    this.state = 'not begin'
    this.hasHandle = false
  }

  _init () {
    let effectFunc = '_' + this.type
    if (!this[effectFunc]) {
      throw new Error('dont have this type effect')
    }
    this.handler = this[effectFunc]()
  }

  _moveTo (param) {
    param = param || this.param
    if (!param.val) {
      throw new Error('missing param val')
    }
    let paramX = $extend({}, param)
    let paramY = $extend({}, param)
    paramX.val = paramX.val.x
    paramY.val = paramY.val.y
    let handlerX = this._moveXTo(paramX)
    let handlerY = this._moveYTo(paramY)
    handlerX = handlerX && handlerX.bind(this)
    handlerY = handlerY && handlerY.bind(this)
    return function (frameIndex) {
      let offsetX = handlerX && handlerX(frameIndex)
      let offsetY = handlerY && handlerY(frameIndex)
      return $extend({}, offsetX, offsetY)
    }
  }

  _moveXTo (param) {
    let self = this
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['x']
    return function (frameIndex) {
      let to = +param.val * this.target.pt
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      let offset = to - origin
      return {x: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  _moveYTo (param) {
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['y']
    return function (frameIndex) {
      let to = +param.val * this.target.pt
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      let offset = to - origin
      return {y: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  // _moveBy (param) {
  //   param = param || this.param
  //   if (!param.val) {
  //     throw new Error('missing param val')
  //   }
  //   let paramX = $extend({}, param)
  //   let paramY = $extend({}, param)
  //   paramX.val = paramX.val.x
  //   paramY.val = paramY.val.y
  //   let handlerX = this._moveXBy(paramX)
  //   let handlerY = this._moveYBy(paramY)
  //   handlerX = handlerX && handlerX.bind(this)
  //   handlerY = handlerY && handlerY.bind(this)
  //   return function (frameIndex) {
  //     let offsetX = handlerX && handlerX(frameIndex)
  //     let offsetY = handlerY && handlerY(frameIndex)
  //     return $extend({}, offsetX, offsetY)
  //   }
  // }

  // _moveXBy (param) {
  //   let self = this
  //   param = param || this.param
  //   if (isNaN(parseFloat(param.val))) return null
  //   let origin = +target['x']
  //   let to = (origin + param.val) * target.pt
  //   let offset = to - origin
  //   let easing = param.easing
  //   return function (frameIndex) {
  //     let actualIndex = frameIndex - this.delayFrames
  //     return {x: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
  //   }
  // }

  // _moveYBy (param) {
  //   param = param || this.param
  //   if (isNaN(parseFloat(param.val))) return null
  //   let origin = +target['y']
  //   let to = (origin + param.val) * target.pt
  //   let offset = to - origin
  //   let easing = param.easing
  //   return function (frameIndex) {
  //     let actualIndex = frameIndex - this.delayFrames
  //     return {y: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
  //   }
  // }

  _rotateTo (param) {
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['rotate']
    return function (frameIndex) {
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      let to = +param.val
      let offset = to - origin
      return {rotate: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  _scaleTo (param) {
    param = param || this.param
    if (!param.val) {
      throw new Error('missing param "val"')
    }
    let paramX = $extend({}, param)
    let paramY = $extend({}, param)
    paramX.val = paramX.val.scaleX
    paramY.val = paramY.val.scaleY
    let handlerX = this._scaleXTo(paramX)
    let handlerY = this._scaleYTo(paramY)
    handlerX = handlerX && handlerX.bind(this)
    handlerY = handlerY && handlerY.bind(this)
    return function (frameIndex) {
      let offsetX = handlerX && handlerX(frameIndex)
      let offsetY = handlerY && handlerY(frameIndex)
      return $extend({}, offsetX, offsetY)
    }
  }

  _scaleXTo (param) {
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['scaleX']
    return function (frameIndex) {
      let to = +param.val
      let offset = to - origin
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      return {scaleX: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  _scaleYTo (param) {
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['scaleY']
    return function (frameIndex) {
      let to = +param.val
      let offset = to - origin
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      return {scaleY: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  // _skewTo (param) {
  //   param = param || this.param
  //   if (!this.param.val) {
  //     throw new Error('missing param "val"')
  //   }
  //   let paramX = $extend({}, param)
  //   let paramY = $extend({}, param)
  //   paramX.val = paramX.val.skewX
  //   paramY.val = paramY.val.skewY
  //   let handlerX = this._skewXTo(paramX)
  //   let handlerY = this._skewYTo(paramY)
  //   handlerX = handlerX && handlerX.bind(this)
  //   handlerY = handlerY && handlerY.bind(this)
  //   return function (frameIndex) {
  //     let offsetX = handlerX && handlerX(frameIndex)
  //     let offsetY = handlerY && handlerY(frameIndex)
  //     return $extend({}, offsetX, offsetY)
  //   }
  // }

  // _skewXTo (param) {
  //   param = param || this.param
  //   if (isNaN(parseFloat(param.val))) return null
  //   let origin = +target['skewX']
  //   let to = +param.val
  //   let offset = to - origin
  //   let easing = param.easing
  //   return function (frameIndex) {
  //     let actualIndex = frameIndex - this.delayFrames
  //     return {skewX: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
  //   }
  // }

  // _skewYTo (param) {
  //   param = param || this.param
  //   if (isNaN(parseFloat(param.val))) return null
  //   let origin = +target['skewY']
  //   let to = +param.val
  //   let offset = to - origin
  //   let easing = param.easing
  //   return function (frameIndex) {
  //     let actualIndex = frameIndex - this.delayFrames
  //     return {skewY: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
  //   }
  // }

  _opacityTo (param) {
    param = param || this.param
    if (isNaN(parseFloat(param.val))) return null
    let origin = +this.target['opacity']
    return function (frameIndex) {
      let to = +param.val
      let offset = to - origin
      let easing = param.easing
      let actualIndex = frameIndex - this.delayFrames
      return {opacity: this._interpolate(easing, actualIndex, origin, offset, this.frames)}
    }
  }

  _keyFrame (param) {
    param = param || this.param
    let self = this
    return function (frameIndex) {
      let index = frameIndex - this.delayFrames
      // 控制速度
      index = this._interpolate(param.easing, index, 0, this.frames, this.frames)
      if (index.toFixed(2) > this.frames.toFixed(2)) return
      let timeFrames = Math.round(this.frames / param.times)
      // 最后一帧直接到结束的状态
      if (index.toFixed(2) !== this.frames.toFixed(2)) {
        index %= timeFrames
      } else {
        index = timeFrames
      }
      let currentPercent = Math.round(index / (timeFrames) * 100)
      let targetFrame = null
      let lastTargetFrame = null
      let targetIndex = 0
      let lastIndex = 0
      for (let key in param.keyFrame) {
        let percentVal = parseInt(key)
        if (currentPercent <= percentVal) {
          targetIndex = Math.round(timeFrames * percentVal / 100)
          targetFrame = param.keyFrame[key]
          break
        }
        lastIndex = Math.round(timeFrames * percentVal / 100)
        lastTargetFrame = param.keyFrame[key]
      }
      let attr = {}
      for (let key in targetFrame) {
        if (key === 'x' || key === 'y') {
          targetFrame[key] *= self._target.pt
        }
        let initValue = lastTargetFrame !== null ? lastTargetFrame[key] : 0
        let offset = targetFrame[key] - initValue
        attr[key] = this._interpolate('linear', index - lastIndex, initValue, offset, targetIndex - lastIndex)
      }
      return attr
    }
  }

  // _pathMove (param) {
  //   param = param || this.param
  //   let self = this
  //   let pathSVG = param.val.path
  //   let autoReverse = param.val.autoReverse
  //   let duration = param.duration
  //   let times = param.times || 1
    
  //   pathSVG = svgPathProperties(pathSVG)
  //   let SVGLength = pathSVG.getTotalLength()
  //   let last = {}
  //   let center = {}
  //   center.x = target['width'] / 2
  //   center.y = target['height'] / 2
  //   last.x = 0
  //   last.y = 0
  //   last.index = target['frameIndex']
  //   return function (frameIndex) {
  //     let attr = {}
  //     let index = frameIndex - this.delayFrames
  //     // 控制速度
  //     index = this._interpolate(param.easing, index, 0, this.frames, this.frames)
  //     if (index === last.index) {
  //       return
  //     }
  //     let totalPercent = index / this.frames
  //     let p = pathSVG.getPointAtLength(SVGLength * totalPercent)
  //     let rotate = 0
  //     attr.x = p.x * target.pt - center.x
  //     attr.y = p.y * target.pt - center.y
  //     if (autoReverse) {
  //       if (index > last.index) {
  //         attr.rotate = Math.atan2(attr.y - last.y, attr.x - last.x) * 180 / Math.PI
  //       } else {
  //         attr.rotate = Math.ceil(180 + Math.atan2(attr.y - last.y, attr.x - last.x) * 180 / Math.PI)
  //       }
  //     }
  //     last.x = attr.x
  //     last.y = attr.y
  //     last.index = index
  //     return attr
  //   }
  // }
  _pathMove (param) {
    param = param || this.param
    let self = this
    let pathSVG = param.val.path
    let autoReverse = param.val.autoReverse
    let duration = param.duration
    let times = param.times || 1
    let pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathEl.setAttribute('d', pathSVG)
    pathSVG = pathEl
    let SVGLength = pathSVG.getTotalLength()
    let last = {}
    let center = {}
    center.x = +this.target['width'] / 2
    center.y = +this.target['height'] / 2
    last.x = 0
    last.y = 0
    last.index = +this.target['frameIndex']
    return function (frameIndex) {
      let attr = {}
      let index = frameIndex - this.delayFrames
      // 控制速度
      index = this._interpolate(param.easing, index, 0, this.frames, this.frames)
      if (index === last.index) {
        return
      }
      let totalPercent = index / this.frames
      let p = pathSVG.getPointAtLength(SVGLength * totalPercent)
      let rotate = 0
      attr.x = p.x * this.target.pt - center.x
      attr.y = p.y * this.target.pt - center.y
      if (autoReverse) {
        if (index > last.index) {
          attr.rotate = Math.atan2(attr.y - last.y, attr.x - last.x) * 180 / Math.PI
        } else {
          attr.rotate = Math.ceil(180 + Math.atan2(attr.y - last.y, attr.x - last.x) * 180 / Math.PI)
        }
      }
      last.x = attr.x
      last.y = attr.y
      last.index = index
      return attr
    }
  }


  _shake (param) {
    param = param || this.param
    let times = param.val
    let handler = this._keyFrame({
      keyFrame: {
        '25%': {
          rotate: -10
        },
        '75%': {
          rotate: 10
        },
        '100%': {
          rotate: 0
        }
      },
      easing: 'linear',
      times: times
    })
    handler = handler && handler.bind(this)
    return function (frameIndex) {
      let index = frameIndex - this.delayFrames
      index = this._interpolate(param.easing, index, 0, this.frames, this.frames)
      frameIndex = index + this.delayFrames
      return handler(frameIndex)
    }
  }

  _interpolate (funcName, currentIndex, initValue, offset, totalFrames) {
    if (!easeMap[funcName]) {
      console.warn(`${funcName} not support degrade to linear`)
    }
    let func = easeMap[funcName] || easeMap['linear']
    return func(currentIndex, initValue, offset, totalFrames)
  }

  setIndex (frameIndex) {
    if (frameIndex < this.delayFrames) return
    let state = this.check(frameIndex)
    return this.handler(frameIndex)
  }
}

export default Effect
