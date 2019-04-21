import BaseEvents from './BaseEvents'
class PIXIEvents extends BaseEvents {
  on(type, listener) {
    let self = this
    super.on(type, listener)
    let transMap = {
      'click': 'tap'
    }
    if (!self.dom) return
    self.dom.interactive = true
    self.dom.on(transMap[type], () => {
      self.emit(type)
    })
  }
}

export default PIXIEvents
