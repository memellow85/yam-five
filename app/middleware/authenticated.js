export default function ({ store, redirect }) {
  if (!store.state.userFirebase) {
    return redirect('/')
  }
}
