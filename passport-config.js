const LocalStrategy = require("passport-local").Strategy
const bcryptjs = require("bcryptjs")

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUsers = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: "No User Found"})
        }
        try{
            if (await bcryptjs.compare(password, user.password)){
            return done(null, user)
            } else{
                return done(null, false, {message: "Password Incorrect"})
            }
        } catch(e) {
            console.log(e);
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize