import getMatrix from 'css-transform-to-mat4'
import BaseRender from './BaseRender'
class DOMRender extends BaseRender {
  
  getContainer(container) {
    return super.getContainer(container)
  }

  renderStage(name) {
    super.renderStage()
    let target = this.target
    if (!document.querySelectorAll(`.J_alive_stage_${target.id}`).length) {
      let dom = target.dom = document.createElement('div')
      dom.className = `J_alive_stage J_alive_stage_${target.id} J_alive_${name}`
      dom.style.position = 'relative'
      dom.style.background = target.backgroundColor
      dom.style.width = `${target.width}px`
      dom.style.height = `${target.height}px`
      dom.style.overflow = `hidden`
      dom.setAttribute('data-spm', `moying`)
      target.container.appendChild(dom)
    }
  }

  removeStage() {
    super.removeStage()
    let target = this.target
    try{
      target.dom.remove()
    }catch(e){}
  }

  addChild(child) {
    super.addChild(child)
    let target = this.target
    target.dom.appendChild(child.dom)
    child.rect = child._calculateRect()
  }

  renderViewer() {
    super.renderViewer()
    let target = this.target
    if (target.link && target.link.length) {
      let dom = target.dom = document.createElement('a')

      if (target.linkType == 'blank') {
        dom.setAttribute('target', '_blank')
      }
      dom.href = target.link
      dom.className = `J_alive_viewer J_alive_viewer_${target.id}`
      target.canPointer = 'all'
    } else {
      let dom = target.dom = document.createElement('div')
      dom.className = `J_alive_viewer J_alive_viewer_${target.id}`
      target.canPointer = 'none'
    }
    if (target.backgroundImage && target.backgroundImage.length) {
      let img = document.createElement('img')
      if (!!~target.backgroundImage.indexOf('gif')) {
        if (!!~target.backgroundImage.indexOf('?')) {
          target.backgroundImage += '&getAvatar=1'
        } else {
          target.backgroundImage += '?getAvatar=1'
        }
      }
      img.src = target.backgroundImage
      img.style.display = 'block'
      img.style.width = '100%'
      img.style.height = '100%'
      target.dom.appendChild(img)
    }
    let dom = target.dom
    target.pivot.x = target.width / 2
    target.pivot.y = target.height / 2
    dom.style.position = 'absolute'
    dom.style.left = `${target.x}px`
    dom.style.top = `${target.y}px`
    if (target.width && target.height) {
      dom.style['width'] = `${target.width}px`
      dom.style['height'] = `${target.height}px`
    }
    dom.style.overflow = 'hidden'
    dom.style['-webkit-background-size'] = '100%'
    dom.style['-webkit-tap-highlight-color'] = `transparent`
    dom.style['-webkit-touch-callout'] = `none`
    dom.style['-webkit-user-select'] = `none`
    dom.style['user-select'] = `none`
    dom.style['-webkit-transform-style'] = `preserve-3d`
    dom.style['-webkit-perspective'] = '1000'
    dom.style['-webkit-backface-visibility'] = 'hidden'
    dom.style['pointer-events'] = 'none'
  }

  _setTransform (target) {
    let offsetX = target.x - target.originData.x
    let offsetY = target.y - target.originData.y
    let translate = `translate3d(${offsetX}px, ${offsetY}px, 0)`
    let rotate = `rotate(${target.rotate}deg)`
    let scale = `scale(${target.scaleX}, ${target.scaleY})`
    let matrix = getMatrix(`${translate} ${rotate} ${scale}`)
    return matrix
  }

  updateViewer() {
    super.updateViewer()
    let target = this.target
    let dom = target.dom
    let matrix = this._setTransform(target)
    if (!dom) return
    if (target.width && target.height) {
      dom.style['width'] = `${target.width}px`
      dom.style['height'] = `${target.height}px`
    }
    if (!target.opacity) {
      dom.style['pointer-events'] = 'none'
    } else {
      dom.style['pointer-events'] = target.canPointer
    }
    dom.style['backgroundColor'] = target.backgroundColor
    dom.style['opacity'] = target.opacity
    dom.style['z-index'] = target.zIndex
    dom.style['-webkit-transform'] = `matrix3d(${matrix})`
  }

  removeViewer() {
    super.removeViewer()
    let target= this.target
    target.dom.remove(0)
  }

  renderFrames() {
    super.renderFrames()
    let target = this.target
   
    if (target.newVersion) {
      let {frames, fileList} = target.framesData
      let frame = frames[target.frameIndex]
      let file = fileList[frame.fileIndex]
      let canvas = document.createElement('canvas')
      let ctx = target.ctx = canvas.getContext("2d")
      fileList = fileList.map(file => {
        let img = new Image()
        img.src = file.url
        file.imageObj = img
        return file
      })
      canvas.width = target.width * 2
      canvas.height = target.height * 2
      canvas.style['position'] = 'absolute'
      canvas.style['let'] = '0'
      canvas.style['top'] = '0'
      // canvas.src = file.url
      canvas.style['width'] = `${target.width}px`
      canvas.style['height'] = `${target.height}px`
      let img = new Image()
      img.onload = () => {
        let rect = frame.rect
        ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3], 0, 0, target.width * 2, target.height * 2)
      }
      img.src = file.url
      target.fileIndex = 0
      target._imageDom = canvas
      target.dom.appendChild(target._imageDom)
    } else {
      if (!target.image) return 
      let imageDom = target._imageDom = document.createElement('img')
      imageDom.style['position'] = 'absolute'
      imageDom.style['let'] = '0'
      imageDom.style['top'] = '0'
      imageDom.src = target.image
      if (target.frameDirect === 'horizontal') {
        let totalWidth = target.width * target.frameNum
        imageDom.style['max-width'] = 'none'
        imageDom.style['width'] = `${totalWidth}px`
        imageDom.style['height'] = '100%'
      } else {
        let totalHeight = target.height * target.frameNum
        imageDom.style['width'] = '100%'
        imageDom.style['height'] = `${totalHeight}px`
      }
      imageDom.style['transform-style'] = 'preserve-3d'
      imageDom.style['-webkit-perspective'] = '1000'
      imageDom.style['pointer-events'] = 'none'
      imageDom.style['-webkit-backface-visibility'] = 'hidden'
      target.dom.appendChild(imageDom)
    }
  }

  updateFrames() {
    super.updateFrames()
    let target = this.target
    if (target.newVersion) {
      const {frames, fileList} = target.framesData
      let frame = frames[target.frameIndex]
      let file = fileList[frame.fileIndex]
      if (target.fileIndex != frame.fileIndex) {
        target.fileIndex = frame.fileIndex
      }
      let img = file.imageObj
      let rect = frame.rect
      target.ctx.clearRect(0, 0, target.width * 2, target.height * 2)
      target.ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3], 0, 0, target.width * 2, target.height * 2)
    } else {
      if (target.frameDirect === 'horizontal') {
        let frameOffset = (-target.width) * target.frameIndex
        target._imageDom.style['-webkit-transform'] = `translate3d(${frameOffset}px, 0, 0)`
      } else {
        let frameOffset = (-target.height) * target.frameIndex
        target._imageDom.style['-webkit-transform'] = `translate3d(0, ${frameOffset}px, 0)`
      }
    }
  }
  
  renderText() {
    super.renderText()
    let target = this.target
    let text = document.createElement('span')
    let needUnitStyle = ['fontSize']
    target.dom.style['width'] = 'auto'
    target.dom.style['height'] = 'auto'
    text.style['white-space'] = 'nowrap'
    text.innerHTML = target.content
    for (let key in target.style) {
      if (~needUnitStyle.indexOf(key)) {
        text.style[key] = `${target.style[key]}px`
      } else {
        text.style[key] = target.style[key]
      }
    }
    target.dom.appendChild(text)
  }

  renderGroup() {
    super.renderGroup()
    let target = this.target
    let layer = target.dom = document.createElement('div')
    layer.className = 'layer'
    layer.style.position = 'absolute'
    layer.style['left'] = `${target.x}px`
    layer.style['top'] = `${target.y}px`
    layer.style['width'] = '100%'
    layer.style['height'] = '100%'
    layer.style['pointer-events'] = 'none'
    layer.style['-webkit-transform-style'] = `preserve-3d`
    layer.style['-webkit-perspective'] = '1000'
    layer.style['-webkit-backface-visibility'] = 'hidden'
    layer.style['z-index'] = target.zIndex
    layer.setAttribute('data-depth', target.depth)
  }

  updateGroup() {
    let target = this.target
    let rect = target.rect
    let layer = target.dom
    let originX = (rect.left + rect.right) / 2
    let originY = (rect.top + rect.bottom) / 2
    layer.style['-webkit-transform-origin'] = `${originX}px ${originY}px`
  }

  getRect() {
    let target = this.target
    let style = getComputedStyle(target.dom)
    let selfRect = {}
    let pLeft = parseFloat(style.left)
    let pTop = parseFloat(style.top)
    let pWidth = parseFloat(style.width)
    let pHeight = parseFloat(style.height)
    if (pWidth && pHeight) {
      selfRect.left = pLeft
      selfRect.top = pTop
      selfRect.right = pLeft + pWidth 
      selfRect.bottom = pTop + pHeight
      return selfRect
    }
    return {}
  }
}

export default DOMRender
