var store = {
  list: {},
  token: 'CLEAR'
}

store.init = function() {
  if (localStorage[this.token]) {
    this.list = JSON.parse(localStorage[this.token])
  } else {
    this.list = {}
  }
}

store.flush = function() {
  localStorage[this.token] = JSON.stringify(this.list)
}

store.appendItem = function(item) {
  this.list[item.key] = {
    msg: item.msg,
    completed: item.state.completed
  }

  this.flush()
}

store.deleteItem = function(key) {
  delete this.list[key]

  this.flush()
}

store.updateItem = function(item) {
  this.list[item.key] =  {
    msg: item.msg,
    completed: item.state.completed
  }

  this.flush()
}

store.clearCompleted = function(item) {
  for (var key in this.list) {
    if (this.list[key].completed) {
      delete this.list[key]
    }
  }

  this.flush()
}
