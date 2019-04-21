import Ticker from '../Ticker'
import Container from '../Container'
import Animation from '../Animation'
import Stage from '../Stage'
import Viewer from '../Viewer'
import Frames from '../Frames'
import Text from '../Text'
import Group from '../Group'
import $extend from 'extend'
import Effect from '../Effect'
import GLOBAL from '../lib/global'
import window from '../lib/window'
import Events from '../events/BaseEvents'
import '../lib/parallax'

class Alive {
  constructor(param) {
    let aliveData = null
    try {
      aliveData = JSON.parse(JSON.stringify(param.data))
    } catch (e) {
      console.error(e)
    }
    this.stageData = aliveData.stage
    if (!this.stageData) {
      throw new Error('aliveData must hava stage')
    }
    this.movieClipsData = aliveData.children || aliveData.movieClips
    if (!this.movieClipsData) {
      throw new Error('aliveData must hava movieClips')
    }
    this.loop = 1
    this.stage = null
    this._resourceList = []
    this.viewersList = []
    this.animationList = []
    this._isInit = false
    this.container = param.container
    this.preventDefault = param.preventDefault
    this.rendererType = param.rendererType || 'dom'
    this.dataHandler = param.dataHandler
    this.name = param.name
    this.state = 'not begin'
    this.currentIndex = 0
    this.totalTime = 0
    this.maxTime = Infinity
    this.events = new Events(this)
    this._init()
  }

  get runTime() {
    return this.currentIndex * GLOBAL.RENDER_INTERVAL
  }

  static setRenderer(renderer) {
    Container.Renderer = renderer
  }

  static _parseMcData(mcData) {
    let data = {}
    data.id = mcData.id
    data.name = mcData.name
    data.type = mcData.type
    data.x = mcData.style.left
    data.y = mcData.style.top
    data = $extend(true, data, mcData.style)
    if (mcData.type === 'sprite') {
      data.frameLoop = mcData.data.loop
      data.image = mcData.data.src
      data = $extend(data, mcData.data)
    } else {
      data.backgroundImage = mcData.data.src
    }
    return data
  }

  /**
   * get the viewer's data at the time
   * @param mcData
   * @param time
   * @returns {Viewer}
   */
  static mcTimeMachine (mcData, time) {
    // 待优化
    try {
      mcData = JSON.parse(JSON.stringify(mcData))
    } catch (e) {
      console.error(e)
    }
    let animation = mcData.animation
    let effectGroup = mcData.animation.effectsGroup
    mcData = Alive._parseMcData(mcData)
    let viewer = new Viewer(mcData)
    if (effectGroup) {
      let theAnimation = new Animation({
        viewer,
        effectGroup,
        loop: animation.loop,
        abLoops: animation.abLoops
      })
      let frameIndex = time / GLOBAL.RENDER_INTERVAL
      theAnimation.setIndex(frameIndex)
    }
    return viewer
  }

  get state() {
    if (this.ticker.state === 'over' || this._state == 'over') {
      return 'over'
    }
    if (this.animationList.some(animation => {
        return animation.state === 'run' || animation.state === 'hold' || animation.state === 'not begin'
      })) {
      return this._state
    } else {
      return 'over'
    }
  }

  set state(state) {
    this._state = state
  }
  _parsePlugins(mcData) {
    let data = {}
    if (mcData.plugins) {
      for (let i = 0; i < mcData.plugins.length; ++i) {
        let plugin = mcData.plugins[i]
        if (plugin && plugin.type === 'parallax') {
          data.depth = plugin.param && plugin.param.depth
        }
      }
    }
    return data
  }

  _parseEvents(mcData) {
    let data = {}
    if (mcData.events) {
      for (let i = 0; i < mcData.events.length; ++i) {
        let event = mcData.events[i]
        if (event.eventType === 'click' && event.action.type === 'link') {
          data.link = mcData.events[i].action.param.href
          data.linkType = mcData.events[i].action.param.target
        }
      }
    }
    return data
  }

  _handleMcData(mcData) {
    this.dataHandler && this.dataHandler(mcData)
    let data = Alive._parseMcData(mcData)
    if (data.framesData) {
      data.framesData.fileList.map(file => {
        this._resourceList.push(file.url)
      })
    }
    mcData.data.src && this._resourceList.push(mcData.data.src)
    data = $extend(true, data, this._parsePlugins(mcData))
    data = $extend(true, data, this._parseEvents(mcData))
    return data
  }

  _init() {
    if (this._isInit) return
    this._isInit = true
    this.ticker = new Ticker()
    this.animationMap = {}
    this._parseChildren(this.movieClipsData, this)
    return this
  }

  _parseChildren(children, parent) {
    if (!children) return
    for (let i = children.length - 1; i >= 0; --i) {
      let animation = children[i].animation || {}
      if (animation && animation.length) {
        // todo
      } else {
        let effectGroup = animation.effectsGroup
        let mcData = this._handleMcData(children[i])
        let viewer = null
        mcData.zIndex = children.length - i
        mcData.rendererType = mcData.rendererType || this.rendererType
        if (mcData.type === 'group') {
          viewer = new Group(mcData)
          this._parseChildren(children[i].children, viewer)
        } else
        if (mcData.type === 'sprite') {
          viewer = new Frames(mcData)
          this.ticker.addTick(viewer)
        } else {
          viewer = new Viewer(mcData)
        }
        parent.viewersList.push(viewer)
        if (effectGroup) {
          animation.abLoops = animation.abLoops || []
          let theAnimation = new Animation({
            viewer,
            effectGroup,
            loop: animation.loop,
            abLoops: animation.abLoops.map(item => {
              item.loop = Number(item.loop) || 0
              return item
            })
          })
          this.animationList.push(theAnimation)
          //播放器时间为最长的动画时间
          if (theAnimation.totalTime > this.totalTime) {
            this.totalTime = theAnimation.totalTime
          }
          //多次循环后，帧数会有误差 为了保持多个动画的一致性将相同时间的动画放在一起，一起执行
          this.animationMap[theAnimation.totalTime] = this.animationMap[theAnimation.totalTime] || []
          this.animationMap[theAnimation.totalTime].push(theAnimation)
          theAnimation.sameTimeAnimationList = this.animationMap[theAnimation.totalTime]
        }
      }
    }
  }
  
  _tick() {
    this.currentIndex++ 
    this.emit('update')
    if (this.runTime >= this.maxTime) {
      this.stop()
      return
    }

    if (this.ticker._tickers.length <= 1) {
      if ((this.loop !== 'infinite' && +this.loop <= 1) || !this.loop) {
        this.stop()
        return
      } else {
        if (this.loop == 'infinite') {
          this.loop = Infinity
        }
        this.loop--
        this.replay()
      }
      return
    }
    // if (this.animationList.every(animation => {
    //     return animation.state === 'over'
    //   })) {
    //   if ((this.loop !== 'infinite' && +this.loop <= 1) || !this.loop) {
    //     this.stop()
    //     return
    //   } else {
    //     if (this.loop == 'infinite') {
    //       this.loop = Infinity
    //     }
    //     this.loop--
    //     this.replay()
    //   }
    //   return
    // }
    this.stage.paint()
  }

  render() {
    const stage = this.stage = new Stage({
      id: this.stageData.id,
      width: this.stageData.width,
      height: this.stageData.height,
      backgroundColor: this.stageData.backgroundColor,
      container: this.container,
      rendererType: this.stageData.rendererType || this.rendererType,
      preventDefault: this.preventDefault,
      name: this.name
    })
    this.viewersList.forEach(viewer => {
      //插件形式待设计
      if (viewer.depth) {
        let group = new Group({
          depth: viewer.depth,
          zIndex: viewer.zIndex,
          rendererType: viewer.rendererType,
          opacity: 1
        }).appendTo(stage).addChild(viewer)
        delete viewer.depth
      } else {
        viewer.appendTo(stage)
      }
    })
    // 增加plugin
    const stagePlugin = this.stageData.plugins
    if (stagePlugin) {
      for (let i = 0; i < stagePlugin.length; ++i) {
        let plugin = stagePlugin[i]
        let param = stagePlugin[i].param
        if (plugin.type === 'parallax') {
          new window.Parallax(stage, {
            scalarX: param.x,
            scalarY: param.y
          })
        }
      }
    }
    this.ticker.addTick(this)
    this.animationList.forEach(animation => {
      this.ticker.addTick(animation)
    })
  }

  preload(cb, timeout) {
    let finishNum = 0
    let length = this._resourceList.length
    let self = this
    let isCall = false
    //超时回调
    timeout = timeout || 6000
    //for weex
    let Image = Alive.Image || window.Image
    for (let i = 0; i < length; ++i) {
      let image = new Image();
      (function (image) {
        image.onload = function () {
          finishNum++
          if (finishNum >= length && !isCall) {
            isCall = true
            cb && cb()
          }
        }
        image.src = self._resourceList[i]
      }(image))
    }
    setTimeout(() => {
      !isCall && cb && cb()
      isCall = true
    }, timeout)
  }

  play() {
    if (this.state == 'not begin') {
      this.emit('start')
      this.ticker.start()
    } else {
      this.replay()
    }
    this.state = "run"
    return this
  }
  
  _stop() {
    this.state = "over"
    this.ticker.stop()
  }

  _resume() {
    this.state = 'run'
    this.ticker.start()
  }

  stop() {
    this._stop()
    this.emit('over')
    this.emit('update')
    return this
  }

  replay() {
    this.emit('replay')
    this._stop()
    this.animationList.forEach(animation => {
      animation.reset()
    })
    this.currentIndex = 0
    this._resume()
  }

  pause() {
    this.state = "over"
    this.emit('pause')
    this.emit('update')
    this.ticker.stop()
    return this
  }

  resume() {
    if (this.state == 'over') {
      this._resume()
      this.emit('resumue')
      this.emit('update')
    }
    return this
  }

  destroy() {
    this.ticker.stop()
    this.viewersList.forEach(function (viewer) {
      viewer.destroy()
    })
    this.stage.destroy()
    return this
  }

  find(key, value) {
    let viewers = this.viewersList.filter(viewer => {
      return viewer[key] === value
    })
    return viewers
  }

  findOne(key, value) {
    let viewers = this.find(key, value)
    return viewers && viewers[0]
  }

  setIndex(index) {
    this.currentIndex = index
    this.animationList.forEach(animation => {
      animation.setIndex(index)
    })
  }

  playTo(percent) {
    this.maxTime = this.totalTime * percent / 100
    this.ticker.start()
  }
}

Alive.Animation = Animation
Alive.Container = Container
Alive.Stage = Stage
Alive.Viewer = Viewer
Alive.Frames = Frames
Alive.Text = Text
Alive.Group = Group
Alive.Effect = Effect
Alive.Ticker = Ticker
Alive.GLOBAL = GLOBAL
export default Alive