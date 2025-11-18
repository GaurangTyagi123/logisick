"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const org_controller_1 = require("../controllers/org.controller");
const router = (0, express_1.Router)();
// Endpoint to get organization details of a particular organization
router.get('/:orgSlug', auth_controller_1.protect, org_controller_1.getOrg);
// Endpoint to create new organization
router.post('/create', auth_controller_1.protect, org_controller_1.createOrg);
// Endpoint to transfer the ownership of an organization
router.patch('/transfer', auth_controller_1.protect, org_controller_1.transferOrg);
// Endpoint to update organization data
router.patch('/:orgid', auth_controller_1.protect, org_controller_1.updateOrg);
// Endpoint to delete a organization (only by owner)
router.delete('/:orgid', auth_controller_1.protect, org_controller_1.deleteOrg);
exports.default = router;
