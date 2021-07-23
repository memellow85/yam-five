export default {
  mounted() {
    document.querySelector('.body-scroll-lock-ignore-inner').addEventListener(
      'touchmove',
      function (event) {
        event.stopPropagation()
      },
      { passive: false }
    )
  },
}
