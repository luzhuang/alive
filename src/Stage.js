import Container from './Container'
/**
 * @class Stage
 */
class Stage extends Container {
  /**
   * @param stageData
   * @return {Ticker}
   */
  constructor (stageData) {
    super(stageData)
    this.selfInit(stageData)
  }
    selfInit (stageData) {
    this.container = this.renderer.getContainer(stageData && stageData.container)
    if (!stageData) {
      throw new Error('stage must have param')
    }
    if (!this.container) {
      throw new Error(`the contianer ${stageData.container} not found`)
    }
    this.stage = this
    this.ticker = null
    this.type = 'stage'
    this.pt = this.container.offsetWidth / stageData.width
    this.width = stageData.width * this.pt
    this.height = stageData.height * this.pt
    this.id = stageData.id || +new Date()
    this.backgroundColor = stageData.backgroundColor || 'transparent'
    this.viewersList = stageData.viewerList || []
    this.dpr = stageData.dpr || 2
    this.preventDefault = stageData.preventDefault
    this.name = stageData.name
    this._create()
  }
    _create () {
    super._create()
    this.renderer.renderStage(this.name)
  }

  removeViewer (viewer) {
    let viewers = this.viewersList
    let index = viewers.indexOf(viewer)
    if (index >= 0) {
      viewers.splice(index, 1)
    }
    return this
  }

  /***
   * destory itself
   */
    destroy () {
    this.viewersList.forEach(function (viewer) {
      viewer.destroy()
    })
    this.renderer.removeStage()
  }
  // /**
  //  * call by its ticker and use its ticker call its viewers
  //  * @param ticker
  //  * @private
  //  */
  // _tick (ticker) {
  //   this.ticker = ticker
  //   this._paint()
  // }

    paint() {
    this.renderer.updateStage()
  }
}

export default Stage
