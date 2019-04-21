import Container from "./Container";
import GLOBAL from "./lib/global";
/**
 * class Viewer
 */
class Viewer extends Container {
  /**
   * @param viewerData {id, x, y, width, height, opacity, rotate, scaleX, scaleY, skewX, skewY, backgroundColor}
   * @return {Viewer}
   */
  constructor(viewerData) {
    super(viewerData);
    viewerData = viewerData || {};
    this.id = viewerData.id;
    this.name = viewerData.name;
    this.type = "viewer";
    this.x = Number(viewerData.x) || 0;
    this.y = Number(viewerData.y) || 0;
    this.width = Number(viewerData.width) || 0;
    this.height = Number(viewerData.height) || 0;
    this.pivot = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.texture = null;
    this.opacity = Number(parseFloat(viewerData.opacity)) || 0;
    this.rotate = parseFloat(viewerData.rotate) || 0;
    this.scaleX = Number(parseFloat(viewerData.scaleX)) || 1;
    this.scaleY = Number(parseFloat(viewerData.scaleY)) || 1;
    this.backgroundColor = viewerData.backgroundColor || "transparent";
    this.backgroundImage = viewerData.backgroundImage || "";
    this.link = viewerData.link;
    this.linkType = viewerData.linkType;
    this.zIndex = Number(viewerData.zIndex) || 0;
    this.depth = viewerData.depth;
    this.ticker = null;
    this.pt = 1;
    this.index = 0;
    this.originData = {};
    //将原数据保存以便重置
    for (let key in this) {
      if (typeof this[key] === "number" || typeof this[key] === "string") {
        this.originData[key] = this[key];
      }
    }
  }

  get container() {
    return this._container;
  }

  set container(container) {
    this._container = container;
    this._addToContainer();
  }

  _create() {
    super._create();
    this.renderer.renderViewer();
  }

  _calculateRect() {
    return this.renderer.getRect();
  }

  _addToContainer() {
    this.pt = this.originData.pt = this.container.pt;
    this.stage = this.container.stage;
    this.x = this.originData.x *= this.pt;
    this.y = this.originData.y *= this.pt;
    this.width = this.originData.width *= this.pt;
    this.height = this.originData.height *= this.pt;
    this._create();
    this.container._addChild(this);
    this.container._mergeRect(this);
    this._paint();
    this.container._paint();
  }

  _mergeAttr(offsetData) {
    for (let key in offsetData) {
      if (isNaN(offsetData[key])) continue;
      if (key === "scaleX" || key === "scaleY") {
        this[key] *= offsetData[key];
      } else {
        this[key] += offsetData[key];
      }
    }
  }

  _reset() {
    for (let key in this.originData) {
      this[key] = this.originData[key];
    }
    return this;
  }

  _paint() {
    this.renderer.updateViewer();
  }

  destroy() {
    this.renderer.removeViewer();
  }

  stop() {
    this.ticker && this.ticker.removeTick(this);
  }
}

export default Viewer;
