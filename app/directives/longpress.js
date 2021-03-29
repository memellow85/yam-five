const emit = (vnode, name, data) => {
  const handlers =
    (vnode.data && vnode.data.on) ||
    (vnode.componentOptions && vnode.componentOptions.listeners)

  if (handlers && handlers[name]) {
    handlers[name].fns(data)
  }
}

export const longPress = {
  bind(el, binding, vnode) {
    // eslint-disable-next-line camelcase
    const press_timeout = 1000
    // eslint-disable-next-line no-unused-vars
    let timer = null

    const longPressStart = (event) => {
      if (event.type === 'click' && event.button !== 0) {
        return true
      } else {
        timer = setTimeout(() => {
          emit(vnode, 'longPressStart', event)
        }, press_timeout)
      }
    }

    const longPressEnd = (event) => {
      if (timer !== null) {
        clearTimeout(timer)
        emit(vnode, 'longPressEnd', event)
        timer = null
      }
    }

    el.addEventListener('mousedown', longPressStart)
    el.addEventListener('touchstart', longPressStart)
    el.addEventListener('click', longPressEnd)
    el.addEventListener('mouseout', longPressEnd)
    el.addEventListener('touchend', longPressEnd)
    el.addEventListener('touchcancel', longPressEnd)
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
  },
}
