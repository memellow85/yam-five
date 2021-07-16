const express = require('express')
const firebase = require('./firebase.js')
const router = express.Router()

const USER_DETAILS = 'users'

/* const compare = (a, b) => {
  if (a.tot > b.tot) return -1
  if (b.tot > a.tot) return 1
  return 0
} */

router.route('/login').post((req, res) => {
  firebase.auth
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((resp) => {
      res.status(200).json(resp)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/logout').post((req, res) => {
  firebase.auth
    .signOut()
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/user-recovery-email').post((req, res) => {
  firebase.auth
    .sendPasswordResetEmail(req.body.recovery)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router
  .route('/user')
  .get((req, res) => {
    firebase.db
      .collection(USER_DETAILS)
      .get()
      .then((data) => {
        const list = []
        data.docs.forEach((d) => {
          /* const user = d.data()
          const objTmp = {
            uid: user.uid,
            name: user.name,
            tot: user.score + user.score_short + user.score_veryshort,
          } */
          list.push(d.data())
          // list = list.sort(compare)
        })
        res.status(200).json(list)
      })
      .catch((error) => {
        res.status(404).json(error)
      })
  })
  .post((req, res) => {
    firebase.auth
      .createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then(() => {
        const user = firebase.auth.currentUser
        user.sendEmailVerification()
        firebase.db
          .collection(USER_DETAILS)
          .add({
            name: req.body.name,
            uid: user.uid,
            match: 0,
            score: 0,
            score_short: 0,
            score_veryshort: 0,
            last_updated: firebase.utils.Timestamp.now(),
          })
          .then(() => {
            res.status(200).send()
          })
          .catch((error) => {
            res.status(404).json(error)
          })
      })
      .catch((error) => {
        res.status(404).json(error)
      })
  })

router
  .route('/user/:uid')
  .get((req, res) => {
    firebase.db
      .collection(USER_DETAILS)
      .where('uid', '==', req.params.uid)
      .get()
      .then((resp) => {
        resp.forEach((doc) => {
          res.status(200).json(doc.data())
        })
      })
      .catch((error) => {
        res.status(404).json(error)
      })
  })
  .put((req, res) => {
    const ref = firebase.db.collection(USER_DETAILS)
    const batch = firebase.db.batch()
    const data = {
      match: req.body.user.match + 1,
    }
    ref
      .where('uid', '==', req.params.uid)
      .get()
      .then((resp) => {
        resp.docs.forEach((doc) => {
          const dataDetail = doc.data()
          if (dataDetail.uid === req.params.uid) {
            const refObj = ref.doc(doc.id)
            switch (req.body.type) {
              case 'short':
                if (dataDetail.score_short < req.body.tot) {
                  data.score_short = req.body.tot
                }
                break
              case 'veryshort':
                if (dataDetail.score_veryshort < req.body.tot) {
                  data.score_veryshort = req.body.tot
                }
                break
              default:
                if (dataDetail.score < req.body.tot) {
                  data.score = req.body.tot
                }
            }
            data.last_updated = firebase.utils.Timestamp.now()
            batch.update(refObj, data)
            batch
              .commit()
              .then(() => {
                res.status(200).send()
              })
              .catch((error) => {
                res.status(404).json(error)
              })
          }
        })
      })
  })

module.exports = router
