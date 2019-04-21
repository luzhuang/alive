import * as Proton from '../lib/proton'

const particalEffect = {
  'fallDown': function(canvas) {
    let proton = new Proton()
    let emitter = new Proton.Emitter()
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(0.5, 2))
    emitter.addInitialize(new Proton.ImageTarget('https://gw.alicdn.com/tps/TB1cNsHPXXXXXbDXVXXXXXXXXXX-80-67.png'))

    emitter.addInitialize(new Proton.Mass(1, 5))
    emitter.addInitialize(new Proton.Radius(20))
    emitter.addInitialize(new Proton.Position(new Proton.LineZone(0, -40, canvas.width, -40)))
    emitter.addInitialize(new Proton.V(0, new Proton.Span(1, 2)))

    emitter.addBehaviour(new Proton.CrossZone(new Proton.LineZone(0, canvas.height, canvas.width, canvas.height + 20, 'down'), 'dead'))
    emitter.addBehaviour(new Proton.Rotate(new Proton.Span(0, 360), new Proton.Span(-0.5, 0.5), 'add'))
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(-0.2, 1)))
    emitter.addBehaviour(new Proton.RandomDrift(5, 0, 0.15))
    emitter.addBehaviour(new Proton.Gravity(0.9))
    emitter.emit()
    proton.addEmitter(emitter)

    let renderer = new Proton.Renderer('canvas', proton, canvas)
    renderer.start()
    return proton
  }
}
export {particalEffect}
