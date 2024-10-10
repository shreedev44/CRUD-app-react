import express from 'express'
import { adminRouteProtector, refreshToken } from '../middlewares/jwtAuth';
import * as adminController from '../controllers/adminController'

const adminRouter = express.Router();

adminRouter.post('/login', adminController.verifyAdmin);

adminRouter.get('/fetch-admin', adminRouteProtector ,adminController.fetchAdmin)

adminRouter.get('/fetch-users', adminRouteProtector, adminController.fetchUsers)

adminRouter.post('/add-user', adminRouteProtector, adminController.addUser)

adminRouter.patch('/edit-user/:userId', adminRouteProtector, adminController.editUser)

adminRouter.delete('/delete-user/:userId', adminRouteProtector, adminController.deleteUser)

adminRouter.get('/logout', adminRouteProtector, adminController.logout)

adminRouter.get('/refresh-token', refreshToken)

export default adminRouter