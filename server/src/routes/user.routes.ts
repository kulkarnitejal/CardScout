import { Router } from 'express';
import { deleteUserAccount } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

// Delete user account (requires authentication)
router.delete('/delete', authenticateUser, deleteUserAccount);

export default router;

