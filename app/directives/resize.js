const emit = (vnode, name, data) => {
  const handlers =
    (vnode.data && vnode.data.on) ||
    (vnode.componentOptions && vnode.componentOptions.listeners)

  if (handlers && handlers[name]) {
    handlers[name].fns(data)
  }
}

export const resize = {
  bind(el, binding, vnode) {
    const resizeHandler = () => {
      emit(vnode, 'orientationHandler', window.orientation)
    }

    window.addEventListener('orientationchange', resizeHandler)
  },
}
