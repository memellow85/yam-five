const express = require('express')
const {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} = require('firebase/auth')
const {
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

const firebase = require('./firebase.js')

const router = express.Router()

const USER_DETAILS = 'users'
const ISSUE_DETAILS = 'messages'
const ERROR_DETAILS = 'errors'
const CAMPAIGN_DETAILS = 'campaigns'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

router.route('/login').post((req, res) => {
  signInWithEmailAndPassword(firebase.auth, req.body.email, req.body.password)
    .then((resp) => {
      res.status(200).json(resp)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/logout').post((req, res) => {
  signOut(firebase.auth)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/user-recovery-email').post((req, res) => {
  sendPasswordResetEmail(firebase.auth, req.body.recovery)
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
    getDocs(collection(firebase.db, USER_DETAILS))
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
    createUserWithEmailAndPassword(
      firebase.auth,
      req.body.email,
      req.body.password
    )
      .then(() => {
        const user = firebase.auth.currentUser
        sendEmailVerification(user)
        const data = Object.assign(
          {},
          {
            uid: user.uid,
            last_updated: Timestamp.now(),
            last_reset: Timestamp.now(),
          },
          req.body
        )
        addDoc(collection(firebase.db, USER_DETAILS), data)
          .then((docUser) => {
            const refObj = doc(firebase.db, USER_DETAILS, docUser.id)
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
        collection(firebase.db, USER_DETAILS),
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
      const refObj = doc(firebase.db, USER_DETAILS, req.params.id)
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
    const refObj = doc(firebase.db, USER_DETAILS, req.params.id)
    const data = Object.assign(
      {},
      {
        last_updated: Timestamp.now(),
      },
      req.body
    )
    getDoc(refObj)
      .then((resp) => {
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
  const refObj = doc(firebase.db, USER_DETAILS, req.params.id_doc)
  const data = Object.assign(
    {},
    {
      last_reset: Timestamp.now(),
    },
    req.body
  )
  updateDoc(refObj, data)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/campaigns').get((req, res) => {
  const q = query(
    collection(firebase.db, CAMPAIGN_DETAILS),
    where('active', '==', true)
  )
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

router.route('/campaign').post((req, res) => {
  addDoc(collection(firebase.db, CAMPAIGN_DETAILS), req.body)
    .then((docCampaign) => {
      const refObj = doc(firebase.db, CAMPAIGN_DETAILS, docCampaign.id)
      updateDoc(refObj, {
        id_doc: docCampaign.id,
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

router.route('/campaign/:id_doc').put((req, res) => {
  const refObj = doc(firebase.db, CAMPAIGN_DETAILS, req.params.id_doc)
  updateDoc(refObj, req.body)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/reset-campaign').put((req, res) => {
  getDocs(collection(firebase.db, USER_DETAILS))
    .then((data) => {
      const users = []
      data.forEach((d) => {
        users.push(d.data())
      })
      const updateUsers = async (users) => {
        await asyncForEach(users, async (user) => {
          const refObj = doc(firebase.db, USER_DETAILS, user.id_doc)
          await updateDoc(refObj, req.body)
        })
        res.status(200).send()
      }
      updateUsers(users)
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/report-issue').get((req, res) => {
  const q = query(
    collection(firebase.db, ISSUE_DETAILS),
    orderBy('date_open', 'desc')
  )
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
  const data = Object.assign({}, req.body, {
    uid: req.params.uid,
    id: Timestamp.now().valueOf().toString(),
    date_open: Timestamp.now(),
  })
  addDoc(collection(firebase.db, ISSUE_DETAILS), data)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

router.route('/errors').post((req, res) => {
  const data = Object.assign({}, req.body, {
    date: Timestamp.now(),
  })
  addDoc(collection(firebase.db, ERROR_DETAILS), data)
    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      res.status(404).json(error)
    })
})

module.exports = router
