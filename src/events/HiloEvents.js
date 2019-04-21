import BaseEvents from './BaseEvents'
class HiloEvents extends BaseEvents {
  on(type, listener) {
    let self = this
    super.on(type, listener)
    let transMap = {
      'click': 'touchstart'
    }
    if (!self.dom) return
    self.dom.interactive = true
    self.dom.on(transMap[type], () => {
      self.emit(type)
    })
  }
}

export default HiloEvents
