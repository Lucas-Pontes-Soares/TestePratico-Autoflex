import { Router } from 'express';
import * as productController from './controllers/product.controller.ts';
import * as rawMaterialController from './controllers/raw_material.controller.ts';
import * as productMaterialController from './controllers/product_material.controller.ts';
import * as userController from './controllers/user.controller.ts';
import { verifyToken } from '../middlewares/auth.ts';
import { verifyIsSelf } from '../middlewares/isSelf.ts';

const router = Router();

router.get('/health', (req, res) => {
    res.send('OK');
});

// users
router.post('/users', userController.create);
router.post('/user/login', userController.login);
router.get('/user/:id', verifyToken, userController.get);
router.get('/users', verifyToken, userController.getAll);
router.delete('/user/:id', verifyToken, verifyIsSelf, userController.remove);
router.put('/user/:id', verifyToken, verifyIsSelf, userController.update);

// products
router.post('/products', verifyToken, productController.create);
router.get('/product/:id', verifyToken, productController.get);
router.get('/products', verifyToken, productController.getAll);
router.delete('/product/:id', verifyToken, productController.remove);
router.put('/product/:id', verifyToken, productController.update);

// raw materials
router.post('/raw-materials', verifyToken, rawMaterialController.create);
router.get('/raw-material/:id', verifyToken, rawMaterialController.get);
router.get('/raw-materials', verifyToken, rawMaterialController.getAll);
router.delete('/raw-material/:id', verifyToken, rawMaterialController.remove);
router.put('/raw-material/:id', verifyToken, rawMaterialController.update);

// products materials
router.post('/products-materials', verifyToken, productMaterialController.create);
router.get('/product-material/:id', verifyToken, productMaterialController.get);
router.get('/products-materials', verifyToken, productMaterialController.getAll);
router.get('/products-materials/product/:id', verifyToken, productMaterialController.getByProductId);
router.get('/products-materials/production-suggestion', verifyToken, productMaterialController.getProductsByDescValue);
router.delete('/product-material/:id', verifyToken, productMaterialController.remove);
router.put('/product-material/:id', verifyToken, productMaterialController.update);

export default router;