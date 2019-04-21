class Config {
  constructor() {
    this.FPS = 30
  }

  get FPS() {
    return this._FPS
  }
  set FPS(fps) {
    this._FPS = fps
    this.RENDER_INTERVAL = 1000 / this._FPS
  }
}

let GLOBAL = new Config()

export default GLOBAL
