class BaseEvents {
  constructor(target) {
    this.target = target
    this.init()
  }

  init() {
    this.target.on = this.on.bind(this.target)
    this.target.off = this.off.bind(this.target)
    this.target.emit = this.emit.bind(this.target)
  }

  on(type, listener) {
    if (!this._listeners) {
      this._listeners = {}
    } else {
      this.off(type, listener)
    }
    if (!this._listeners[type]) this._listeners[type] = []
    this._listeners[type].push(listener)
  }

  off(type, listener) {
    if (!this._listeners) return
    if (!this._listeners[type]) return
    let arr = this._listeners[type]
    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === listener) {
        arr.splice(i, 1)
        break
      }
    }
  }

  emit(eventName, eventTarget) {
    let ret = false
    let listeners = this._listeners
    if (eventName && listeners) {
      let arr = listeners[eventName]
      if (!arr) return ret
      arr = arr.slice()
      let handler = null
      let i = arr.length
      while (i--) {
        handler = arr[i].bind(this)
        ret = ret || handler(eventTarget)
      }
    }
    return !!ret
  }
}

export default BaseEvents
