import { Router } from 'express';
import authRoutes from './auth.routes.js';
import invoiceRoutes from './invoice.routes.js';
import vendorRoutes from './vendor.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/vendors', vendorRoutes);

export default router;
