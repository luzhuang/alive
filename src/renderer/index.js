// import PIXIRender from './PIXIRender'
// import HiloRender from './HiloRender'
import DOMRender from './DOMRender'
function Render() {
  let renderer = null
  switch (this.rendererType) {
    case 'pixi':
      // let test = await import(/* webpackChunkName: "PIXIRender" */ './PIXIRender')
      // console.log(test)
      // renderer = new PIXIRender(this)
      break
    case 'dom':
      // let DOMRender = await import(/* webpackChunkName: "DOMRender" */ './DOMRender')
      // DOMRender = DOMRender.default
      // console.log(DOMRender)
      renderer = new DOMRender(this)
      break
    case 'hilo':
      // renderer = new HiloRender(this)
      break
    default:
      renderer = new DOMRender(this)
      break
  }
  return renderer
}

export default Render
