
const { userSignup, userLogin, userLogout, userLogouts } = require("../controllers/authController");
const verifyToken = require("../utils/verifyToken");

const router = require("express").Router()


router.post("/signup",userSignup)

router.post("/login",userLogin)

router.get("/logout",userLogout)



module.exports = router;