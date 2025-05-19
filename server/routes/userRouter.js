const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.post("/logout", authMiddleware, userController.logout);
router.get('/all', checkRole('ADMIN'), userController.getAll);
module.exports = router;
