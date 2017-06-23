var $ = function(sel) {
  let items = document.querySelectorAll(sel)
  return items.length > 1 ? items : items[0]
}

const $todoList = $('#todo-list')
var items = []

var initItems = ['Tap to edit',
  'Swipe left to delete',
  'Swipe right to complete']

window.onload = function() {
  store.init()

  if (isEmpty(store.list)) {
    for (var msg of initItems) {
      var item = new ListItem({msg: msg})
      mount($todoList, item)
      items.push(item)
    }
  } else {
    var list = store.list
    for (var key in list) {
      var item = new ListItem({msg: list[key]['msg'],
        completed: list[key]['completed'],
        key: key})
      mount($todoList, item)
      items.push(item)
    }
  }

  $('#create').addEventListener('click', function() {
    var item = new ListItem({msg: ''})
    mount($todoList, item, function(container, component) {
      component.inputFocus()
    })
  })

  $('#clear').addEventListener('click', function() {
    store.clearCompleted()
    for (var item of items) {
      if (item && item.state.completed) {
        item.setState('alive', false)
      }
    }
  })

  $('#complete').addEventListener('click', function() {
    allCompleted = true
    for (var item of items) {
      if (item && !item.state.completed) {
        allCompleted = false
        item.setState('completed', true)
      }
    }

    if (allCompleted) {
      for (var item of items) {
        if (item) {
          item.setState('completed', false)
        }
      }
    }
  })
}

eventTarget.addEvent('ADD', function(item) {
  items.push(item)
  store.appendItem(item)
})

eventTarget.addEvent('DELETE', function(item) {
  store.deleteItem(item.key)
  console.log(item.key)
})

eventTarget.addEvent('EDIT', function(item) {
  store.updateItem(item)
})
