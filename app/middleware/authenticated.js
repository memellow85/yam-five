export default function ({ store, redirect }) {
  if (!store.state.firebase.userFirebase) {
    return redirect('/')
  }
}
