import { Router } from 'express';
import * as productController from './controllers/product.controller.ts';
import * as rawMaterialController from './controllers/raw_material.controller.ts';
import * as productMaterialController from './controllers/product_material.controller.ts';

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

// raw materials
router.post('/raw-materials', rawMaterialController.create);
router.get('/raw-material/:id', rawMaterialController.get);
router.get('/raw-materials', rawMaterialController.getAll);
router.delete('/raw-material/:id', rawMaterialController.remove);
router.put('/raw-material/:id', rawMaterialController.update);

// products materials
router.post('/products-materials', productMaterialController.create);
router.get('/product-material/:id', productMaterialController.get);
router.get('/products-materials', productMaterialController.getAll);
router.get('/products-materials/production-suggestion', productMaterialController.getProductsByDescValue);
router.delete('/product-material/:id', productMaterialController.remove);
router.put('/product-material/:id', productMaterialController.update);

export default router;