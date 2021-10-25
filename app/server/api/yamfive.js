const express = require('express')
const { initializeApp } = require('firebase/app')
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} = require('firebase/auth')
const {
  getFirestore,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  orderBy,
  updateDoc,
} = require('firebase/firestore')
const { getAnalytics, logEvent } = require('firebase/analytics')
const { getPerformance, trace } = require('firebase/performance')

const firebaseConfig = require('./firebase.js')

const router = express.Router()

const app = initializeApp(firebaseConfig.config)
const db = getFirestore(app)
const auth = getAuth(app)

const USER_DETAILS = 'users'
const ISSUE_DETAILS = 'messages'
const ERROR_DETAILS = 'errors'

router.route('/login').post((req, res) => {
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((resp) => {
      res.status(200).json(resp)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/logout').post((req, res) => {
  signOut(auth)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/user-recovery-email').post((req, res) => {
  sendPasswordResetEmail(auth, req.body.recovery)
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
    getDocs(collection(db, USER_DETAILS))
      .then((data) => {
        const list = []
        data.forEach((d) => {
          list.push(d.data())
        })
        res.status(200).json(list)
      })
      .catch((error) => {
        res.status(404).json(error)
      })
  })
  .post((req, res) => {
    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
      .then(() => {
        const user = auth.currentUser
        sendEmailVerification(user)
        addDoc(collection(db, USER_DETAILS), {
          name: req.body.name,
          uid: user.uid,
          id_doc: '',
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
          last_updated: Timestamp.now(),
          last_reset: Timestamp.now(),
        })
          .then((docUser) => {
            const refObj = doc(db, USER_DETAILS, docUser.id)
            updateDoc(refObj, {
              id_doc: docUser.id,
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
      .catch((error) => {
        res.status(404).json(error)
      })
  })

router
  .route('/user/:id')
  .get((req, res) => {
    if (req.query.check === 'true') {
      const q = query(
        collection(db, USER_DETAILS),
        where('uid', '==', req.params.id)
      )
      getDocs(q)
        .then((resp) => {
          resp.forEach((doc) => {
            res.status(200).json(doc.data())
          })
        })
        .catch((error) => {
          res.status(404).json(error)
        })
    } else {
      const refObj = doc(db, USER_DETAILS, req.params.id)
      getDoc(refObj)
        .then((resp) => {
          res.status(200).json(resp.data())
        })
        .catch((error) => {
          res.status(404).json(error)
        })
    }
  })
  .put((req, res) => {
    const refObj = doc(db, USER_DETAILS, req.params.id)
    const reqBody = req.body
    const data = {
      match: reqBody.details.user.match + 1,
      last_updated: Timestamp.now(),
    }
    getDoc(refObj)
      .then((resp) => {
        const docSnap = resp.data()
        switch (reqBody.details.type) {
          case 'short':
            if (docSnap.score_short < reqBody.details.tot) {
              data.score_short = reqBody.details.tot
              data.score_short_record_chart_1 = JSON.stringify(reqBody.chart_1)
              data.score_short_record_chart_2 = JSON.stringify(reqBody.chart_2)
            }
            break
          case 'veryshort':
            if (docSnap.score_veryshort < reqBody.details.tot) {
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
            if (docSnap.score < reqBody.details.tot) {
              data.score = reqBody.details.tot
              data.score_record_chart_1 = JSON.stringify(reqBody.chart_1)
              data.score_record_chart_2 = JSON.stringify(reqBody.chart_2)
            }
        }
        updateDoc(refObj, data)
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

router.route('/reset-record/:id_doc').put((req, res) => {
  const refObj = doc(db, USER_DETAILS, req.params.id_doc)
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
    last_reset: Timestamp.now(),
  }
  updateDoc(refObj, data)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/report-issue').get((req, res) => {
  const q = query(collection(db, ISSUE_DETAILS), orderBy('date_open', 'desc'))
  getDocs(q)
    .then((data) => {
      const list = []
      data.forEach((d) => {
        list.push(d.data())
      })
      res.status(200).json(list)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/report-issue/:uid').post((req, res) => {
  addDoc(collection(db, ISSUE_DETAILS), {
    id: Timestamp.now().valueOf().toString(),
    date_close: null,
    date_open: Timestamp.now(),
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
  addDoc(collection(db, ERROR_DETAILS), {
    message: req.body.message,
    date: Timestamp.now(),
    type: req.body.type,
  })
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

module.exports = {
  router,
  getPerformance,
  trace,
  app,
  getAnalytics,
  logEvent,
}
