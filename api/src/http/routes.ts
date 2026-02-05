import { Router } from 'express';
import * as productController from './controllers/product.controller.ts';

const router = Router();

router.get('/health', (req, res) => {
    res.send('OK');
});

// products
router.post('/products', productController.create);
router.get('/product/:id', productController.get);
router.get('/products', productController.getAll);
router.delete('/product/:id', productController.remove);
router.put('/product/:id', productController.update);

export default router;