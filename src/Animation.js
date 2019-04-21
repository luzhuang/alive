import GLOBAL from './lib/global'
import Events from './events/BaseEvents'
import Effect from './Effect'

class Animation {
  constructor(param) {
    this.viewer = param.viewer
    this.loop = param.loop
    this._state = 'not begin'
    this._index = 0
    this.runTime = 0
    this.effectList = []
    this.effectGroup = []
    this.extraEffects = []
    this.sameTimeAnimationList = []
    this.loopList = param.abLoops || []
    this.subLoopTimes = this.loopList.map(loopItem => loopItem.loop)
    this.events = new Events(this)
    this._bindEffectGroup(param.effectGroup)
  }

  get state () {
    return this._state
  }

  set state (state) {
    if (state == this._state) return
    this._state = state
    if (state === 'over') {
      this.runTime = 0
      this._watchHold()
    }
    if (state === 'hold') {
      this._watchHold()
    }
    this.emit(state)
  }

  get index () {
    return this._index
  }

  set index (index) {
    this._index = index
    if (index) {
      this._effectListHandler()
      this.runTime = index * GLOBAL.RENDER_INTERVAL.toFixed(4)
      this._checkSubLoop()
      this._update()
    }
  }

  //将图层与效果组绑定
  _bindEffectGroup (effectGroup) {
    let {
      viewer,
    } = this
    let maxTotalTime = 0
    for (let i = 0; i < effectGroup.length; ++i) {
      let totalTime = 0
      let effectDataList = this._parseEffectList(effectGroup[i])
      effectDataList = effectDataList.map(effect => {
        let effectObj = new Effect(effect.type, effect.param)
        totalTime += effectObj.totalTime
        return effectObj
      })
      if (totalTime > maxTotalTime) maxTotalTime = totalTime
      let effectList = {
        list: effectDataList,
        running: false,
        over: false,
        pointer: 0
      }
      this._addEffectList(effectList)
    }
    let subLoopTime = 0
    for (let i = 0; i < this.loopList.length; ++i) {
      if (this.loopList[i].loop > 0) {
        subLoopTime += (this.loopList[i].b - this.loopList[i].a) * (this.loopList[i].loop - 1)
      }
    }
    this.totalTime = maxTotalTime + subLoopTime
  }

  _parseEffectList (effectList) {
    let effectType = effectList.type
    let effects = effectList.effects
    let effectDataList = []
    let needTransType = ['move', 'moveX', 'moveY', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotate', 'opacity']
    if (~needTransType.indexOf(effectType)) {
      effectType += 'To'
    }
    for (let i = 0; i < effects.length; ++i) {
      let effectData = {}
      let effect = effects[i]
      if (effect.delay === undefined && effect.duration === undefined) break
      effectData.type = effectType
      effectData.param = effect
      effectDataList.push(effectData)
    }
    return effectDataList
  }

  //控制效果列表的进度
  _effectListHandler () {
    for (let i = 0; i < this.effectGroup.length; ++i) {
      if (this.effectGroup[i].over || this.effectGroup[i].running) {
        continue
      }
      let effectList = this.effectGroup[i]
      let pointer = effectList.pointer
      let effect = effectList.list && effectList.list[pointer]
      if (effect) {
        effect.effectList = effectList
        effectList.running = true
        this._addEffect(effect)
      }
      effectList.pointer++
    }
  }
  //获得当前可用的效果
  _getAvilEffectList () {
    let avilEffectList = []
    for (let i = 0; i < this.effectList.length; ++i) {
      let effect = this.effectList[i]
      let effectState = effect.check(this.index)
      if (effect.state === 'over')  {
        if (effect.lastState == 'not begin') {
          let attrs = effect.setIndex(effect.frames + effect.delayFrames)
          let effectOffsetData = this._calculateOffset(attrs)
          this.viewer._mergeAttr(effectOffsetData)
          // this.viewer._paint()
        }
        continue
      }
      if (effectState === 'run') {
        avilEffectList.push(effect)
      }
    }
    return avilEffectList
  }
  //检查当前效果的状态
  _checkEffects () {
    let hasEffectRunning = false
    for (let i = 0; i < this.effectList.length; ++i) {
      let effect = this.effectList[i]
      if (effect.hasHandle) continue
      if (effect.check(this.index) === 'over') {
        effect.state = 'over'
        effect.hasHandle = true
        if (effect.effectList) {
          hasEffectRunning = this._checkEffectList(effect.effectList)
          if (hasEffectRunning) {
            this._update()
          }
        }
      } else {
        hasEffectRunning = true
      }
    }
    return hasEffectRunning
  }
  //检查当前动效列表的状态
  _checkEffectList (effectList) {
    if (effectList.list.length > effectList.pointer) {
      effectList.running = false
      this._effectListHandler()
      return true
    } else {
      effectList.running = false
      effectList.over = true
      return this._checkEffectGroup()
    }
  }
  //检查当前动效组的状态
  _checkEffectGroup () {
    if (this.effectGroup.every(function (effectList) {
      return effectList.over
    }) &&
    this.extraEffects.every(function (effect) {
      return effect.over
    })) {
      return false
    }
    return true
  }
  
  //将图层重置
  _resetViewer () {
    this.viewer._reset()
  }
  //计算动效带来的属性变化
  _calculateOffset (attrs, originData) {
    let offsetData = originData || {}
    for (let key in attrs) {
      if (offsetData[key] === undefined) {
        if (key === 'scaleX' || key === 'scaleY') {
          offsetData[key] = 1
        } else {
          offsetData[key] = 0
        }
      }
      if (key === 'scaleX' || key === 'scaleY') {
        if (this.viewer[key] === 0) this.viewer[key] = 0.000000001
        offsetData[key] *= attrs[key] / this.viewer[key]
      } else {
        offsetData[key] += attrs[key] - this.viewer[key]
      }
    }
    return offsetData
  }

  _tick (ticker) {
    this.ticker = ticker
    this.index++
    this.viewer._paint()
  }

  _update () {
    let offsetData = {}
    let effectList = this._getAvilEffectList()
    if (effectList.length) {
      effectList.forEach((effect) => {
        let attrs = effect.setIndex(this.index)
        offsetData = this._calculateOffset(attrs, offsetData)
      })
      this.viewer._mergeAttr(offsetData)
      this.emit('update', this.index)
    }

    if (!this._checkEffects()) {
      if (this.loop && (this.loop === 'infinite' || this.loop > 1)) {
        if (!this.effectGroup.length) return
        if (!isNaN(this.loop)) {
          this.loop--
        }
        this.pause()
        this.state = 'hold'
        return true
      }
      this.stop()
    }
  }

  _resetEffect() {
    this._clearEffectList()
    this._resetEffectGroup()
  }

  _resetEffectGroup () {
    this.effectGroup.forEach(function (effectGroup) {
      effectGroup.pointer = 0
      effectGroup.running = false
      effectGroup.over = false
      effectGroup.list.forEach(function (effect) {
        effect.reset()
      })
    })
    return this
  }
  
  _addEffect (effect) {
    this.state = 'run'
    effect.target = this.viewer
    let effectList = effect.effectList
    if (effectList && effectList.pointer > 0) {
      let lastEffect = effectList.list[effectList.pointer - 1]
      effect.delay += lastEffect.duration + lastEffect.delay
    } else {
      if (this.index > 1) {
        effect.delay += this.runTime
      }
    }
    if (!effect.effectList) {
      this.extraEffects.push(effect)
    }
    this.effectList.push(effect)
    return this
  }

  _clearEffectList () {
    this.effectList = []
    return this
  }

  _addEffectList (effectList) {
    this.effectGroup.push(effectList)
    return this
  }
  
  _isTriggerSubLoop (runTime, rangObj) {
    if(runTime <= rangObj.b && runTime + GLOBAL.RENDER_INTERVAL > rangObj.b) {
      return true
    }
    return false
  }

  _checkSubLoop () {
    for (let i = 0; i < this.loopList.length; i++) {
      if (this._isTriggerSubLoop(this.runTime, this.loopList[i]) 
          && this.subLoopTimes[i] > 1) {
        this.subLoopTimes[i]--
        this.setIndex(this.loopList[i].a / GLOBAL.RENDER_INTERVAL)
        return
      }
    }
  }

  _watchHold() {
    if (this.state === 'hold' || this.state == 'over') {
      if (this.sameTimeAnimationList.every(animation => {
        return animation.state === 'hold' || animation.state === 'over'
      })) {
        this.sameTimeAnimationList.forEach(animation => {
          if (animation.state == 'hold') {
            animation.reset()
          }
        })
      }
    }
  }
  
  reset() {
    this.subLoopTimes = this.loopList.map(loopItem => loopItem.loop)
    this._resetEffect()
    this.setIndex(0)
    if (this.tickerStop) {
      this.state = 'run'
      this.tickerStop = false
      this.ticker && this.ticker.addTick(this)
    }
  }

  setIndex(index) {
    index = index || 1
    this._resetEffect()
    this._resetViewer()
    this.runTime = 0
    this.index = index
    this.viewer._paint()
  }

  play() {

  }

  stop () {
    this.state = 'over'
    this.tickerStop = true
    this.ticker && this.ticker.removeTick(this)
  }
  
  pause() {
    this.tickerStop = true
    this.ticker && this.ticker.removeTick(this)
  }

  resume() {

  }
  
  replay() {

  }
}

export default Animation
