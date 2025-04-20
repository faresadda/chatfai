const express=require('express')
const router=express.Router()
const usersService=require('../controllers/usersController')
const userValidator=require('../validators/userValidator')
const passwordValidator=require('../validators/passwordValidator')
const verifyToken=require('../middlewares/verifyToken')

router.route('/registre')
    .post(userValidator,usersService.registre)

router.route('/login')
    .post(userValidator,usersService.login)

router.route('/profile/:id')
    .get(verifyToken,usersService.getUser)
    .put(verifyToken,usersService.updateUser)
    .delete(verifyToken,usersService.deleteUser)

router.route('/security/:id')
    .put(passwordValidator,usersService.updatePassword)

router.route('/verify/:id')
    .post(usersService.verifyEmail)

router.route('/accountRecovery')
    .post(usersService.accountRecovery)

router.route('/passwordRecovery/:id')
    .post(passwordValidator,usersService.newPassword)

router.route('/resendCode/:id')
    .put(usersService.resendCode)
module.exports=router