import Viewer from './Viewer'
import $extend from 'extend'

class Frames extends Viewer {
  constructor (viewerData) {
    super(viewerData)
    this.type = 'frames'
    this.image = viewerData && viewerData.image
    this.frameNum = viewerData && viewerData.frameNum
    this.interval = viewerData && viewerData.interval || 16
    this.frameLoop = viewerData && viewerData.frameLoop || 'infinite'
    this.times = 1
    this._lastTime = 0
    this._imageDom = null
    this.frameDirect = viewerData && viewerData.direction || 'horizontal'
    this._frameIndex = 0
    this.startTime = 0
    this.delay = viewerData && viewerData.delay || 0
    //新版逐贞逻辑
    this.framesData = viewerData && viewerData.framesData
    if (this.framesData) {
      this.newVersion = true
      this.frameNum = this.framesData.frameNum
    }
  }

  _init() {
   
  }

  _create () {
    super._create()
    this._init()
    this.renderer.renderFrames()
  }

  _updateTexture () {
    if (!this._imageDom) return
    this.renderer.updateFrames()
  }

  _tick (ticker) {
    this.ticker = ticker
    let now = +new Date()
    if (!this.startTime) {
      this.startTime = now
    }

    if (now - this.startTime < this.delay || this.frameEnd) return
    if (now - this._lastTime > this.interval) {
      this._lastTime = now
      this.frameIndex++
      if (this.frameIndex >= this.frameNum) {
        if (this.frameLoop == 'infinite' || +this.times < this.frameLoop) {
          this.frameIndex = 0
        }
        if (this.frameLoop !== 'infinite') {
          this.times ++
          if (+this.times > this.frameLoop) {
            this.frameEnd = true
            this.stop()
          }
        }
      }
    }
  }

  get frameIndex () {
    return this._frameIndex
  }

  set frameIndex (index) {
    this._frameIndex = index
    if (this.frameIndex < this.frameNum) {
      this._updateTexture()
    }
  }
  
  stop () {
    this.state = 'run'
    if (this.frameLoop !== 'infinite' && +this.times > this.frameLoop) {
      this.state = 'over'
    }
    if (this.state === 'over') {
      this.ticker.removeTick(this)
    }
  }
}

export default Frames
