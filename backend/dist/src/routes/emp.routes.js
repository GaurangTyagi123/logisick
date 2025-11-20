"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emp_controller_1 = require("../controllers/emp.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/myOrgs", auth_middleware_1.protect, emp_controller_1.getMyOrgs); // done
// end-point to invite a user to organization
router.post("/sendInvite", auth_middleware_1.csrfProtection, auth_middleware_1.protect, emp_controller_1.sendInvite); // ?
// router.post('/acceptInvite', protect, joinOrg); // ?
// end-point to accept invite to an organization
router.post("/acceptInvite", auth_middleware_1.csrfProtection, auth_middleware_1.protect, emp_controller_1.joinOrg); // ?
// end-point to get all the employees belonging to a particular organization
router.get("/:orgid", auth_middleware_1.protect, emp_controller_1.getEmps); // done
router.get("/:orgid/search", auth_middleware_1.protect, emp_controller_1.searchEmployee); // done
// end-point to change the role of an employee
router.patch("/:orgid/changeRole", auth_middleware_1.csrfProtection, auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("Admin", "Owner"), emp_controller_1.changeRole); // ?
// end-point to change manager of an employee
router.patch("/:orgid/changeManager", auth_middleware_1.csrfProtection, auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("Admin", "Owner"), emp_controller_1.changeManager); // ?
// end-point to delete employee from an organization
router.delete("/:orgid/delete", auth_middleware_1.csrfProtection, auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)("Admin", "Owner"), emp_controller_1.deleteEmp); // done
exports.default = router;
