import { Router } from 'express';
import { protect, restrictTo } from '../controllers/auth.controller';
import {
    changeManager,
    changeRole,
    deleteEmp,
    getEmps,
    getMyOrgs,
    joinOrg,
    searchEmployee,
    sendInvite,
} from '../controllers/emp.controller';

const router = Router();

router.get('/myOrgs', protect, getMyOrgs);
// TODO employees under me

// end-point to invite a user to organization
router.post('/sendInvite', protect, sendInvite);
router.post('/acceptInvite', protect, joinOrg);

// end-point to accept invite to an organization
router.post('/acceptInvite', protect, joinOrg);

// end-point to get all the employees belonging to a particular organization
router.get('/:orgid', protect, getEmps);

router.get('/:orgid/search', protect, searchEmployee);

// end-point to change the role of an employee
router.patch('/:orgid/changeRole', protect, restrictTo('Admin'), changeRole);

// end-point to change manager of an employee
router.patch(
    '/:orgid/changeManager',
    protect,
    restrictTo('Admin'),
    changeManager
);

// end-point to delete employee from an organization
router.delete('/:orgid/delete', protect, restrictTo('Owner'), deleteEmp);

export default router;
