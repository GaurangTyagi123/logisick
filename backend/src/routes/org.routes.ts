import { Router } from 'express';
import {
    createOrg,
    deleteOrg,
    getOrg,
    transferOrg,
    updateOrg,
} from '../controllers/org.controller';
import { csrfProtection, protect } from '../middlewares/auth.middleware';

const router = Router();
// Endpoint to get organization details of a particular organization
router.get('/:orgSlug',protect, getOrg);

// Endpoint to create new organization
router.post('/create',csrfProtection, protect, createOrg);

// Endpoint to transfer the ownership of an organization
router.patch('/transfer',csrfProtection, protect, transferOrg);
// Endpoint to update organization data
router.patch('/:orgid',csrfProtection, protect, updateOrg);

// Endpoint to delete a organization (only by owner)
router.delete('/:orgid',csrfProtection, protect, deleteOrg);

export default router;
