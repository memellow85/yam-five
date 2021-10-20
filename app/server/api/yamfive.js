const express = require('express')
const firebase = require('./firebase.js')
const router = express.Router()

const USER_DETAILS = 'users'
const ISSUE_DETAILS = 'messages'
const ERROR_DETAILS = 'errors'

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
          list.push(d.data())
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
            score_record_chart_1: '',
            score_record_chart_2: '',
            score_short: 0,
            score_short_record_chart_1: '',
            score_short_record_chart_2: '',
            score_veryshort: 0,
            score_veryshort_record_chart_1: '',
            score_veryshort_record_chart_2: '',
            last_updated: firebase.utils.Timestamp.now(),
            last_reset: firebase.utils.Timestamp.now(),
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
    const reqBody = req.body
    const data = {
      match: reqBody.details.user.match + 1,
    }
    ref
      .where('uid', '==', req.params.uid)
      .get()
      .then((resp) => {
        resp.docs.forEach((doc) => {
          const dataDetail = doc.data()
          if (dataDetail.uid === req.params.uid) {
            const refObj = ref.doc(doc.id)
            switch (reqBody.details.type) {
              case 'short':
                if (dataDetail.score_short < reqBody.details.tot) {
                  data.score_short = reqBody.details.tot
                  data.score_short_record_chart_1 = JSON.stringify(
                    reqBody.chart_1
                  )
                  data.score_short_record_chart_2 = JSON.stringify(
                    reqBody.chart_2
                  )
                }
                break
              case 'veryshort':
                if (dataDetail.score_veryshort < reqBody.details.tot) {
                  data.score_veryshort = reqBody.details.tot
                  data.score_veryshort_record_chart_1 = JSON.stringify(
                    reqBody.chart_1
                  )
                  data.score_veryshort_record_chart_2 = JSON.stringify(
                    reqBody.chart_2
                  )
                }
                break
              default:
                if (dataDetail.score < reqBody.details.tot) {
                  data.score = reqBody.details.tot
                  data.score_record_chart_1 = JSON.stringify(reqBody.chart_1)
                  data.score_record_chart_2 = JSON.stringify(reqBody.chart_2)
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

router.route('/reset-record/:uid').put((req, res) => {
  const ref = firebase.db.collection(USER_DETAILS)
  const batch = firebase.db.batch()
  const data = {
    score: 0,
    score_record_chart_1: '',
    score_record_chart_2: '',
    score_short: 0,
    score_short_record_chart_1: '',
    score_short_record_chart_2: '',
    score_veryshort: 0,
    score_veryshort_record_chart_1: '',
    score_veryshort_record_chart_2: '',
  }
  ref
    .where('uid', '==', req.params.uid)
    .get()
    .then((resp) => {
      resp.docs.forEach((doc) => {
        const dataDetail = doc.data()
        if (dataDetail.uid === req.params.uid) {
          const refObj = ref.doc(doc.id)
          data.last_reset = firebase.utils.Timestamp.now()
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

router.route('/report-issue').get((req, res) => {
  firebase.db
    .collection(ISSUE_DETAILS)
    .orderBy('date_open', 'desc')
    .get()
    .then((data) => {
      const list = []
      data.docs.forEach((d) => {
        list.push(d.data())
      })
      res.status(200).json(list)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/report-issue/:uid').post((req, res) => {
  firebase.db
    .collection(ISSUE_DETAILS)
    .add({
      id: firebase.utils.Timestamp.now().valueOf().toString(),
      date_close: null,
      date_open: firebase.utils.Timestamp.now(),
      message: req.body.message,
      status: 'open', // open, close, in progress
      type: req.body.type,
      priority: 'low', // low, medium, high
      uid: req.params.uid,
    })
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/errors').post((req, res) => {
  firebase.db
    .collection(ERROR_DETAILS)
    .add({
      message: req.body.message,
      date: firebase.utils.Timestamp.now(),
      type: req.body.type,
    })
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

module.exports = router
