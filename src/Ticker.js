import GLOBAL from './lib/global'
import window from './lib/window'
const interval = typeof WXEnvironment !== 'undefined' && WXEnvironment.platform == 'iOS' && typeof deprecated_setInterval == "function"
? deprecated_setInterval : setInterval
const raf = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      if (interval) {
        return interval(function () {
          callback(+new Date());
        }, 1000 / 40);
      } else {
        return setInterval(function () {
          callback(+new Date());
        }, 1000 / 40);
      }
    }
})()
const clearTimer = typeof WXEnvironment !== 'undefined' && WXEnvironment.platform == 'iOS' && typeof deprecated_clearInterval == "function" ? deprecated_clearInterval : clearInterval
const craf = (function () {
  return window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    function (handler) {
      if (clearTimer) {
        clearTimer(handler)
      } else {
        clearInterval(handler)
      }
      handler = null
    }
})()
/**
 *  @class Ticker
 */
class Ticker {
  /**
   * @return {Ticker}
   */
  constructor (param, cb) {
    if (typeof param == 'function') {
      cb = param
      param = {}
    }
    this._tickers = []
    this.state = 'not begin'
    this._handler = null
    this._stop = null
    this.fps = param && param.fps
    this.callback = cb
  }

  set fps(fps) {
    if (fps) {
      this.interval = 1000 / fps
    } else {
      this.interval = GLOBAL.RENDER_INTERVAL
    }
  }
  /**
   * add a Viewer into its List to make the viewer use its time line
   * @param target
   * @returns {Ticker}
   */
  addTick (target) {
    this._tickers.push(target)
    return this
  }

  /**
   * remove the Viewer from its List
   * @param target
   * @returns {Ticker}
   */
  removeTick (target) {
    let tickers = this._tickers
    let index = tickers.indexOf(target)
    tickers[index] = null
    return this
  }

  /**
   * run once per one frame(16ms)
   * @private
   */
  _tick () {
    this.state = 'run'
    for (let i = 0; i < this._tickers.length; ++i) {
      if (this._tickers[i] && this._tickers[i]._tick) {
       this._tickers[i]._tick(this)
      }
    }
    this._tickers = this._tickers.filter(ticker => ticker)
    this.callback && this.callback(this, this.state)
  }

  /**
   * start
   * @returns {Ticker}
   */
  start () {
    let self = this
    let lastTime = null
    self.state = 'run';
    self._stop = false;
    function tick (timestamp) {
      if (!+new Date(timestamp)) {
        timestamp = +new Date
      }
      if (self._stop) return
      if (lastTime === null) lastTime = timestamp
      if (self.interval) {
        let elapsed = timestamp - lastTime
        if (elapsed > self.interval) {
          self._tick()
          lastTime = timestamp - (elapsed % self.interval)
        }
      }
      self._handler = raf(tick)
    }
    if (!self._handler) {
      self._handler = raf(tick)
    }
    return this
  }
  /**
   * stop
   * @returns {Ticker}
   */
  stop () {
    this.state = 'over'
    this._stop = true
    if (this._handler) {
      craf && craf(this._handler)
      this._handler = null
    }
    return this
  }
}

export default Ticker
