import Viewer from './Viewer'

class Text extends Viewer {
  constructor (viewerData) {
    super(viewerData)
    this.type = 'text'
    this.content = viewerData.content
    this.style = viewerData.style || {}
  }

  _create () {
    super._create()
    this.renderer.renderText()
  }
}

export default Text
