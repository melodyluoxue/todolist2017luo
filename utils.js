function createDOM(str) {
  var div = document.createElement('div')
  div.innerHTML = str
  return div
}

function mount(container, component, callback) {
  container.appendChild(component.render())

  component.onStateChange = function(oldEl, newEl) {
    if (!newEl && oldEl) {
      container.removeChild(oldEl)
    } else if (newEl && oldEl) {
      container.replaceChild(newEl, oldEl)
    }
  }

  if (callback) callback(container, component)
}

function isEmpty(obj) {
  for (var key in obj) {
    return false
  }
  return true
}
