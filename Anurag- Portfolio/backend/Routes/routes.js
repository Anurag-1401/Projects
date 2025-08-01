const express = require('express')

const {newUser,getUser} = require('../Controller/userCon')

const {newMail,newReplyMail,getForm,delForm,sendMail} = require('../Controller/formCon')


const { admin, getAdminDetails } = require('../Controller/adProfileCon')
const {addProject,getProjects, editProject,delProject} = require('../Controller/projCon')
const {addSkills,getSkills,editSkills,deleteSkills} = require('../Controller/skiilCon')
const {addExperience,getExperience,editExperience,delExperience} = require('../Controller/expCon')

const {addAdmin,getAdmin,resetPass} = require('../Controller/adminAuthCon')

const {Suggestions} = require('../Controller/openAiCon')


const {MiddleCon} = require('../Controller/middleCon')
const verifyFirebaseToken = require("../Middleware/verifyFirebaseToken");


 
const router = express.Router()




router.post('/user' , newUser)
router.get('/get-visitors' , getUser)


router.post('/send-mail',newMail)
router.post('/sendreply-mail',newReplyMail)
router.get('/get-form' , getForm)
router.delete('/del-form/:id' , delForm)



router.get('/get-admin/:id' , getAdmin)
router.post('/add-admin',addAdmin)
router.put('/reset-password' , resetPass)


router.get('/getAdminDetails' , getAdminDetails)
router.post('/admin',admin)

router.post('/add-project',addProject)
router.get('/get-projects',getProjects)
router.put('/edit-projects/:id',editProject)
router.delete('/del-project/:id' , delProject)

router.post('/add-skills',addSkills)
router.get('/get-skills',getSkills)
router.put('/edit-skills',editSkills)
router.delete('/del-skills',deleteSkills)


router.post('/add-experience',addExperience)
router.get('/get-experience',getExperience)
router.put('/edit-experience/:id',editExperience)
router.delete('/del-experience/:id',delExperience)


router.post('/tech-sugg' , Suggestions)


router.get('/profile',verifyFirebaseToken,MiddleCon)

module.exports = router
