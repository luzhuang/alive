import Viewer from './Viewer'
class Group extends Viewer {
  constructor (GroupData) {
    super(GroupData)
    this.type = 'group'
    this.viewersList = []
  }

  _create () {
    super._create()
    this.renderer.renderGroup()
    this.viewersList.forEach(viewer => {
      this.addChild(viewer)
    })
  }
  
  _calculateRect () {
    return {}
  }

  _paint () {
    super._paint()
    this.renderer.updateGroup()
  }
}

export default Group
