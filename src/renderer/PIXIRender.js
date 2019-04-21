import {loader, Sprite, Texture, Rectangle, Container, autoDetectRenderer, Text, TextStyle} from 'pixi.js'
import BaseRender from './BaseRender'

class PIXIRender extends BaseRender {

  getContainer(container) {
    return super.getContainer(container)
  }

  renderStage() {
    super.renderStage()
    let target = this.target
    let renderer = this.renderer = autoDetectRenderer(target.width * target.dpr, target.height * target.dpr, {transparent: true})
    let dom = target.dom = new Container()
    target.pt *= target.dpr
    renderer.plugins.interaction.autoPreventDefault = target.preventDefault
    renderer.view.style.backgroundColor = target.backgroundColor
    renderer.view.style.width = `${target.width}px`
    renderer.view.style.height = `${target.height}px`
    renderer.view.style['display'] = 'block'
    target.container.appendChild(renderer.view)
    renderer.render(dom)
  }

  updateStage() {
    this.renderer.render(this.target.dom)
  }

  removeStage() {
    let target = this.target
    try{
      this.renderer.view.remove()
    } catch(e) {}
  }

  addChild(child) {
    super.addChild(child)
    let target = this.target
    target.dom.addChild(child.dom)
    child.texture && child.texture.on('update', () => {
      target._paint(self.dom)
    })
  }

  renderViewer() {
    super.renderViewer()
    let target = this.target
    let texture = null
    this.renderer = target.container.renderer
    if (loader.resources && loader.resources[target.id]) {
      texture = target.texture = loader.resources[target.id].texture
    } else {
      texture = target.texture = Texture.fromImage(target.backgroundImage)
    }
    let dom = target.dom = new Sprite(texture)
    texture.on('update', function () {
      target.pivot.x = target.texture.width / 2
      target.pivot.y = target.texture.height / 2
      target._paint()
    })
    target.pivot.x = target.texture.width / 2
    target.pivot.y = target.texture.width / 2
    dom.zIndex = target.zIndex
    if (target.link && target.link.length) {
      dom.interactive = true
      dom.on('tap', () => {
        location.href = target.link
      })
    }
  }

  updateViewer() {
    super.updateViewer()
    let target = this.target
    let dom = target.dom
    if (!dom) return
    let x = target.x
    let y = target.y
    let width = target.width
    let height = target.height
    if (width && height) {
      dom.setTransform(x + width / 2, y + height / 2,
                    target.scaleX, target.scaleY,
                    target.rotate * Math.PI / 180,
                    target.skewX, target.skewY,
                    target.pivot.x, target.pivot.y)
      dom.alpha = target.opacity
      dom.width = width * target.scaleX
      dom.height = height * target.scaleY
    } else {
      let containerWidth = target.container.width || 0
      let containerHeight = target.container.height || 0
      let rect = dom.getLocalBounds()
      dom.setTransform(x + rect.width / 2, y + rect.width / 2,
                    target.scaleX, target.scaleY,
                    target.rotate * Math.PI / 180,
                    target.skewX, target.skewY,
                    rect.width / 2, rect.width / 2)
      dom.alpha = target.opacity
    }
  }

  renderFrames() {
    super.renderFrames()
    let target = this.target
    this.renderer = target.container.renderer
    const {frames, fileList} = target.framesData
    let frame = frames[target.frameIndex]
    let file = fileList[frame.fileIndex]
    let texture = target.frameTexture = Texture.fromImage(file.url)
    target.loader = new PIXI.loaders.Loader();
   
    texture.on('update', () => {
      let frameRect = null
      frameRect = new Rectangle(...frame.rect)
      texture.frame = frameRect
      let imageDom = target._imageDom = new Sprite(texture)
      target.texture && target.texture.on('update', () => {
        imageDom.width = target.texture.width
        imageDom.height = target.texture.height
        target.container.__paint()
      })
      imageDom.width = target.texture.width
      imageDom.height = target.texture.height
      target.dom.addChild(imageDom)
      target.container._paint()
    })
    for (let i = 0; i < fileList.length; ++i) {
      target.loader.add(`${target.id}_frames_${i}`, fileList[i].url)
    }
    target.loader.load((loader, resources) => {
      target.resources = resources
    })
  }

  updateFrames() {
    super.updateFrames()
    let target = this.target
    if (!target.frameTexture || !target.resources) return
    let frameRect = null
    let imageDom = target._imageDom
    const {frames, fileList} = target.framesData
    let frame = frames[target.frameIndex]
    if (target.fileIndex != frame.fileIndex) {
      target.fileIndex = frame.fileIndex
      target._imageDom.texture = target.resources[`${target.id}_frames_${frame.fileIndex}`].texture
    }
    // console.log(frame)
    frameRect = new Rectangle(...frame.rect)
    imageDom.texture.frame = frameRect
    imageDom.width = target.texture.width
    imageDom.height = target.texture.height
    target.container._paint()
  }

  renderText() {
    super.renderText()
    let target = this.target
    let styleTransMap = {
      color: 'fill'
    }
    this.renderer = target.container.renderer
    for (let key in target.style) {
      target.style[styleTransMap[key]] = target.style[key]
    }
    let textStyle = new TextStyle(target.style)
    let text = new Text(target.content, textStyle)
    target.dom.addChild(text)
  }
}

export default PIXIRender
