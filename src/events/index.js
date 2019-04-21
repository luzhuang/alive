import BaseEvents from './BaseEvents'
import DOMEvents from './DOMEvents'
import HiloEvents from './HiloEvents'
import PIXIEvents from './PIXIEvents'

function Events() {
  let events = null
  switch (this.rendererType) {
    case 'pixi':
      events = new PIXIEvents(this)
      break
    case 'hilo':
      events = new HiloEvents(this)
      break
    case 'dom':
      events = new DOMEvents(this)
      break
    default:
      events = new BaseEvents(this)
      break
  }
  return events
}

export default Events
