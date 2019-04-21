import BaseEvents from './BaseEvents'
const pointerEvents = [
  'touchstart',
  'touchmove',
  'touchend',
  'tap',
  'click'
]
class DOMEvents extends BaseEvents {
  on(type, listener) {
    let self = this
    super.on(type, listener)
    if (!self.dom) return
    self.dom.addEventListener(type, () => {
      self.emit(type)
    })
    if (!!~pointerEvents.indexOf(type)) {
      self.dom.style['pointer-events'] = 'all'
      self.canPointer = 'all'
    }
  }
}

export default DOMEvents
