import BaseRender from './BaseRender'
import GLOBAL from '../lib/global'
import '../lib/hilo'
let Hilo = window.Hilo
let CanvasElement = Hilo.CanvasElement
class HiloRender extends BaseRender {
  getContainer(container) {
    return super.getContainer(container)
  }

  renderStage() {
    let target = this.target
    let stage = target.dom = new Hilo.Stage({
      renderType: 'canvas',
      container: target.container,
      width: target.width,
      height: target.height
    })
    target.dom.canvas.style.background = target.backgroundColor
    stage.enableDOMEvent(Hilo.event.POINTER_START, true)
  }

  updateStage() {
    let target = this.target
    target.dom.tick(GLOBAL.RENDER_INTERVAL)
  }

  removeStage() {
    let target = this.target
    try {
      target.dom.canvas.remove()
    } catch (e) {}
  }

  addChild(child) {
    let target = this.target
    child.dom.addTo(target.dom)
    target._paint()
  }

  renderViewer() {
    let target = this.target
    let maskRect = new Hilo.Graphics({
      x: target.x + target.width / 2,
      y: target.y + target.height / 2,
      width: target.width,
      height: target.height,
      pivotX: target.width / 2,
      pivotY: target.height / 2
    }).drawRect(0, 0, target.width, target.height)
    let viewer = target.dom = new Hilo.Container({
      x: target.x + target.width / 2,
      y: target.y + target.height / 2,
      width: target.width,
      height: target.height,
      pivotX: target.width / 2,
      pivotY: target.height / 2,
      mask: target.type == 'group' ? maskRect : null
    })
    if (target.link && target.link.length) {
      target.dom.on(Hilo.event.POINTER_START, () => {
        location.href = target.link
      })
    }
    let image = new Image()
    image.onload = () => {
      target.texture = new Hilo.Bitmap({
        image,
        x: 0,
        y: 0,
        width: target.width,
        height: target.height
      })
      target.dom.addChild(target.texture)
      this.updateViewer()
    }
    image.src = 'https:' + target.backgroundImage
  }

  updateViewer() {
    let target = this.target
    if (!target.dom) return
    target.dom.x = target.x + target.width / 2
    target.dom.y = target.y + target.height / 2
    target.dom.scaleX = target.scaleX
    target.dom.scaleY = target.scaleY
    target.dom.rotation = target.rotate
    target.dom.alpha = target.opacity
    if (target.dom.mask) {
      target.dom.mask.rotation = target.rotate
      target.dom.mask.scaleX = target.scaleX
      target.dom.mask.scaleY = target.scaleY
    }
  }

  removeViewer() {
    let target = this.target
    target.dom = null
  }

  renderFrames() {
    let target = this.target
    let {
      frames,
      fileList
    } = target.framesData
    let currentTotalFrameNum = 0
    target._imageDomList = fileList.map(file => {
      let framesNum = file.col.reduce((a, b) => a + b)
      let _frames = frames.map(frame => frame.rect)
      let img = new Image()
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = file.url
      let atlas = new Hilo.TextureAtlas({
        image: img,
        width: img.width,
        height: img.height,
        frames: _frames,
        sprites: {
          me: {
            from: currentTotalFrameNum,
            to: currentTotalFrameNum + framesNum - 1
          }
        }
      })
      currentTotalFrameNum += framesNum
      let sprite = new Hilo.Sprite({
        width: target.width,
        height: target.height,
        x: 0,
        y: 0,
        frames: atlas.getSprite('me'),
        interval: target.interval,
        timeBased: true,
        loop: false
      })
      sprite.alpha = 0
      sprite.stop()
      target.dom.addChild(sprite)
      return sprite
    })
    target.fileIndex = 0
    target.startIndex = frames[0].index
    target._imageDom = target._imageDomList[0]
    target._imageDom.alpha = 1
  }

  updateFrames() {
    let target = this.target
    const {
      frames
    } = target.framesData
    let frame = frames[target.frameIndex]
    if (target.fileIndex != frame.fileIndex) {
      target._imageDomList[target.fileIndex].alpha = 0
      target._imageDomList[target.fileIndex].stop()
      target._imageDomList[target.fileIndex].currentFrame = 0
      target._imageDom = target._imageDomList[frame.fileIndex]
      target._imageDom.alpha = 1
      target._imageDom.play()
      target.fileIndex = frame.fileIndex
      target.startIndex = frame.index
    } else {
      target._imageDomList[target.fileIndex].currentFrame = frame.index - target.startIndex
    }
  }

  renderText() {
    let target = this.target
    let dprStyle = ['fontSize']
    dprStyle.forEach(style => {
      target.style[style] *= target.pt
    })
  }
  renderGroup() {
    let target = this.target
    target.dom = new Hilo.Container()
  }

  updateGroup() {}

}

export default HiloRender