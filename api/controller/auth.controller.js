import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next)=>{
    
    //next will be invoked here and executed from index.js app.use(err, req, res, next)
     const { username,email,password } = req.body
     if( !username || !email || !password || username==='' || email==='' || password==='' )
        next(errorHandler(400,'All Fields are Required'))
    //Here next will be invoked by custom error handler function.
     const hashedPassword = bcryptjs.hashSync(password,10)
    
     const newUser = new User({
        username,
        email,
        password:hashedPassword
    })
    try {
   await newUser.save()
   res.json('SignUp successful')
    }
    catch(error){
        next(error) // Send this error as argument in middleware in index.js 
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'));
    }
  
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
         //For valid user we set a token which will be encrypted.And save this to the Cookie of the browser and use it later to authenticate the user.
         // We add id and isAdmin to ensure the user is an admin or not.
         
         const token = jwt.sign({ id: validUser._id , isAdmin:validUser.isAdmin },
                  process.env.JWT_SECRET_KEY//A secret key , user's have Cookie encrypted by this key.
                  //{expiresIn:'1d'} Add an expiration time for the Cookie if don't add anything ,this is going to be expired when the user close their browser like a one-time session.
                );
  
        const {password:pass,...rest}=validUser._doc //Remove the password from validUser.
                                                 //Named the user as rest.
        //Attatch the token to the Cookie.
       res
        .status(200)
        .cookie('access_token', token, {
         httpOnly: true, // Here a prop sameSite not taking cause we have  different    front end and backend
         })
         .json(rest); // This json will send back to the user and add it to   the Redux toolkit and add it to global state later.
     } catch (error) {
      next(error);
    }
  };