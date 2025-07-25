import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.model.js'

export const signOut=async (req,res,next)=>{
    try {
        res.clearCookie('access_token')
           .status(200)
           .json('User has been signed out')
    } catch (error) {
        next(error)
    }
}