const express=require('express')
const router=express.Router()
const usersService=require('../controllers/usersController')
const userValidator=require('../validators/userValidator')
const passwordValidator=require('../validators/passwordValidator')
const verifyToken=require('../middlewares/verifyToken')

router.route('/registre')
    .post(userValidator,passwordValidator,usersService.registre)

router.route('/login')
    .post(usersService.login)

router.route('/profile/:id')
    .get(verifyToken,usersService.getUser)
    .put(verifyToken,userValidator,usersService.updateUser)
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


router.route('/chats/:id')
    .post(verifyToken,usersService.addChat)
    .get(verifyToken,usersService.getChats)
    .delete(verifyToken,usersService.deleteChats)
    
module.exports=router