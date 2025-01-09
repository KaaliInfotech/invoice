const express = require("express");
const { userUpdate, userSingleView, userList, userDelete, getTodayUserList,changeupgradeStatus, getFilterUserList } = require("../controller/userController");
const authenticate = require("../middleware/token");

const router = express.Router();

router.put("/userUpdate/:id",userUpdate);
router.delete("/userDelete/:id",userDelete);
router.get("/userSingalView/:id",userSingleView);
router.get("/userList", userList);
router.get("/getTodayUserList", getTodayUserList);
router.get("/getFilterUserList", getFilterUserList);
router.patch("/upgradestatus/:id", changeupgradeStatus);

module.exports = router;
