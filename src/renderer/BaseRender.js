class BaseRender {
  constructor (target) {
    this.target = target
  }

  getContainer(container) {
    let target = this.target
    if (typeof container === 'string') {
      return document.querySelector(container)
    }
    return container
  }
  
  renderStage() {
  }

  updateStage() {
  }

  removeStage() {
  }

  addChild(child) {
  }

  renderViewer() {
  }

  updateViewer() {
  }

  removeViewer() {
  }

  renderFrames() {
  }

  updateFrames() {
  }

  renderText() {
    let target = this.target
    let dprStyle = ['fontSize']
    dprStyle.forEach(style => {
      target.style[style] *= target.pt
    })
  }

  renderGroup() {
  }

  updateGroup() {
  }
}

export default BaseRender
