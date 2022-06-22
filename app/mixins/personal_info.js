import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
    getName() {
      if (this.userDetailsFirebase) {
        return this.userDetailsFirebase.name.split(' ')[0]
      } else {
        return '-'
      }
    },
    firstLetter() {
      if (this.userDetailsFirebase) {
        if (this.userDetailsFirebase.name.split(' ').length > 1) {
          return (
            this.userDetailsFirebase.name.split(' ')[0].charAt(0) +
            this.userDetailsFirebase.name.split(' ')[1].charAt(0)
          )
        } else {
          return (
            this.userDetailsFirebase.name.split(' ')[0].charAt(0) +
            this.userDetailsFirebase.name.split(' ')[0].charAt(1)
          )
        }
      } else {
        return '-'
      }
    },
  },
}
