"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_controller_1 = require("../controllers/org.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Endpoint to get organization details of a particular organization
router.get('/:orgSlug', auth_middleware_1.protect, org_controller_1.getOrg);
// Endpoint to create new organization
router.post('/create', auth_middleware_1.csrfProtection, auth_middleware_1.protect, org_controller_1.createOrg);
// Endpoint to transfer the ownership of an organization
router.patch('/transfer', auth_middleware_1.csrfProtection, auth_middleware_1.protect, org_controller_1.transferOrg);
// Endpoint to update organization data
router.patch('/:orgid', auth_middleware_1.csrfProtection, auth_middleware_1.protect, org_controller_1.updateOrg);
// Endpoint to delete a organization (only by owner)
router.delete('/:orgid', auth_middleware_1.csrfProtection, auth_middleware_1.protect, org_controller_1.deleteOrg);
exports.default = router;
