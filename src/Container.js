import Events from './events'

class Container {
  constructor(containerData) {
    if (!Container.Renderer) {
      throw Error('dont have render')
    }
    this.init(containerData)
  }

  init (containerData) {
    this.rect = {}
    this.rendererType = containerData.rendererType
    this.renderer = Container.Renderer.bind(this)()
    this.events = Events.bind(this)()
  }

  _create() {

  }

  _mergeRect(child) {
    for (let key in child.rect) {
      this.rect[key] = isNaN(this.rect[key]) ? child.rect[key] : this.rect[key]
      switch (key) {
        case 'top':
        case 'left':
          if (child.rect[key] < this.rect[key]) {
            this.rect[key] = child.rect[key]
          }
          break
        case 'bottom':
        case 'right':
          if (child.rect[key] > this.rect[key]) {
            this.rect[key] = child.rect[key]
          }
          break
      }
    }
  }

    _addChild(child) {
    this.viewersList = this.viewersList || []
    this.viewersList.push(child)
    this.renderer.addChild(child)
  }

  addChild (child) {
    child.container = this
    return this
  }
  
  appendTo (container) {
    this.container = container
    return this
  }

  _paint () {

  }
}

export default Container
