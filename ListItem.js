var $ = function(sel) {
  let items = document.querySelectorAll(sel)
  return items.length > 1 ? items : items[0]
}

function ListItem(props) {
  this.state = {
    completed: props['completed'] || false,
    alive: true
  }
  this.msg = props['msg']
  this.el = null
  this.key = props['key'] || (new Date()).getTime()
  eventTarget.fireEvent('ADD', this)
}

ListItem.prototype.render = function() {
  if (!this.state.alive) return

  else {
    var el = createDOM(`
              <li>
                <div class="container">
                  <input type="text" value="${this.msg}" ${this.state.completed ? 'disabled' : ''}>
                </div>
              </li>
              `)

    el.className = this.state.completed ? 'completed' : 'notCompleted'

    var hammer = new Hammer(el.getElementsByTagName('div')[0])
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50 }))
    hammer.on('pan', this.panHandler.bind(this))
    hammer.on('panend', this.panEndHandler.bind(this))

    var input = el.getElementsByTagName('input')[0]
    input.addEventListener('click', this.inputStart.bind(this))
    input.addEventListener('blur', this.inputEnd.bind(this))
    input.addEventListener('keypress', this.inputChar.bind(this))

    this.el = el
    return this.el
  }
}

ListItem.prototype.setState = function(key, value) {
  if (this.state[key] === undefined) return

  this.state[key] = value
  var oldEl = this.el
  this.el = this.render()

  this.onStateChange(oldEl, this.el)

  eventTarget.fireEvent(key === 'alive' ? 'DELETE' : 'EDIT', this)
}

ListItem.prototype.panHandler = function(event) {
  var marginLeft = event.target.style.marginLeft
  marginLeft = parseInt(marginLeft.substr(0, marginLeft.length - 2), 10) || 0
  var delta = marginLeft + event.deltaX / 20

  event.target.style.marginLeft = `${delta}px`
}

ListItem.prototype.panEndHandler = function(event) {
  var marginLeft = event.target.style.marginLeft
  marginLeft = parseInt(marginLeft.substr(0, marginLeft.length - 2), 10) || 0
  var delta = marginLeft + event.deltaX / 20

  if (delta > 50) {
    this.setState('completed', !this.state.completed)
    eventTarget.fireEvent('EDIT', this)
  } else if(delta < -50) {
    this.setState('alive', false)
    eventTarget.fireEvent('DELETE', this)
  }

  if (this.state.alive) this.el.style.marginLeft = 0
}

ListItem.prototype.inputStart = function() {
  var $mask = $('#clear-mask')
  $mask.style.display = 'block'
  $mask.style.opacity = 1

  if (this.el)
    $('body').style.marginTop = `${-this.el.offsetTop || -89}px`
}

ListItem.prototype.inputEnd = function() {
  var $mask = $('#clear-mask')
  $mask.style.display = 'none'
  $mask.style.opacity = 0

  var input = this.el.getElementsByTagName('input')[0]
  if (input.value === '') {
    this.setState('alive', false)
    eventTarget.fireEvent('DELETE', this)
  } else {
    eventTarget.fireEvent('EDIT', this)
  }

  $('body').style.marginTop = 0
}

ListItem.prototype.inputChar = function(event) {
  if (event.keyCode === 13) {
    var input = this.el.getElementsByTagName('input')[0]
    this.msg = input.value
    input.blur()
    eventTarget.fireEvent('EDIT', this)
  }
}

ListItem.prototype.inputFocus = function() {
  var input = this.el.getElementsByTagName('input')[0]
  input.click()
}
