// import $ from './lib/zepto'
// import Viewer from './Viewer'
// import {particalEffect} from './lib/util'
// class Partical extends Viewer {
//   constructor (viewerData) {
//     super(viewerData)
//     this.style = 'partical'
//     this.effectType = viewerData.effectType || ''
//     if (viewerData.link) {
//       this.dom = $('<a href="' + viewerData.link + '" class="J_alive_partical_' + this.id + '" data-spm="d' + this.id + '">')
//       this.canvas = $('<canvas style="width:100%;height:100%"></canvas>')
//       this.canvas.appendTo(this.dom)
//     } else {
//       this.dom = this.canvas = $('<canvas class="J_alive_partical_' + this.id + '">')
//     }
//     this.canvas[0].width = this.width
//     this.canvas[0].height = this.height
//     this.createProton()
//   }
//   get stage () {
//     return this._stage
//   }
//   set stage (stage) {
//     this._stage = stage
//     this._addToStage()
//     this.canvas[0].width = this.width
//     this.canvas[0].height = this.height
//   }

//   createProton () {
//     if (particalEffect[this.effectType]) {
//       if (this.effectType === 'sun') {
//         let self = this
//         particalEffect[this.effectType](this.canvas[0], function (proton) {
//           self.proton = proton
//         })
//       } else {
//         this.proton = particalEffect[this.effectType](this.canvas[0])
//       }
//     }
//   }
//   /**
//    * call by its ticker per frame (16ms)
//    * @param ticker
//    * @private
//    */
//   _tick (ticker) {
//     super._tick(ticker)
//     if (this.proton) {
//       this.proton.update()
//     }
//   }
// }

// export default Partical
