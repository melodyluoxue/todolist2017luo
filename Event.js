function EventTarget() {
  this.handler = {}
  this.addEvent = function(type, handler) {
    this.handler[type] = handler
  }
  this.fireEvent = function(type, item) {
    this.handler[type](item)
  }
}

var eventTarget = new EventTarget()
