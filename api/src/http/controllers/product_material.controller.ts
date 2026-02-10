import express from 'express';
import { productMaterialSchema, productMaterialSchemaUpdate } from '../schemas/product_material.schema.ts';
import type { ProductMaterialSchema, ProductMaterialSchemaUpdate } from '../schemas/product_material.schema.ts';
import * as productMaterialService from '../services/product_material.service.ts';
import * as productService from '../services/product.service.ts';
import * as rawMaterialService from '../services/raw_material.service.ts';

export async function create(req: express.Request<any, any, ProductMaterialSchema>, res: express.Response) {
  try {
    const parsedBody = productMaterialSchema.safeParse(req.body);

    const raw_material_id = req.body.raw_material_id;
    if(raw_material_id){
      const response_raw_material = await rawMaterialService.get(raw_material_id);
      if(response_raw_material.length <= 0){
        return res.status(404).json({ message: 'Raw material not found'});
      }
    }

    const product_id = req.body.product_id;
    if(product_id) {
      const response_product = await productService.get(product_id);
      if(response_product.length <= 0){
        return res.status(404).json({ message: 'Product not found'});
      }
    }

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const response = await productMaterialService.create(parsedBody.data);
    
    console.log(response);

    return res.status(201).json({ message: 'Product material created with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating product material' });
  }
};

export async function get(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const products_materials_id = req.params.id;

    if (!products_materials_id) {
      return res.status(400).json({ errors: 'Product material ID is required' });
    }

    const response = await productMaterialService.get(products_materials_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product material not found'});
    }

    return res.status(200).json({ message: 'Product material found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding product material' });
  }
};

export async function getByProductId(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const product_id = req.params.id;

    if (!product_id) {
      return res.status(400).json({ errors: 'Product ID is required' });
    }

    const response = await productMaterialService.getByProductId(product_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product material not found'});
    }

    return res.status(200).json({ message: 'Product material found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding product material' });
  }
}

export async function getAll(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const response = await productMaterialService.getAll()
    console.log(response);

    return res.status(200).json({ message: 'Products materials found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding products materials' });
  }
};

export async function getProductsByDescValue(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const response = await productMaterialService.getProductionSuggestion()
    console.log(response);

    return res.status(200).json({ message: 'Products materials found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding products materials' });
  }
}

export async function remove(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const products_materials_id = req.params.id;

    if (!products_materials_id) {
      return res.status(400).json({ errors: 'Product material ID is required' });
    }

    const response = await productMaterialService.remove(products_materials_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product material not found'});
    }

    return res.status(200).json({ message: 'Product material deleted with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting product material' });
  }
};

export async function update(req: express.Request<any, any, ProductMaterialSchemaUpdate>, res: express.Response) {
  try {
    const parsedBody = productMaterialSchemaUpdate.safeParse(req.body);

    const products_materials_id = req.params.id;

    const raw_material_id = req.body.raw_material_id;
    if(raw_material_id){
      const response_raw_material = await rawMaterialService.get(raw_material_id);
      if(response_raw_material.length <= 0){
        return res.status(404).json({ message: 'Raw material not found'});
      }
    }

    const product_id = req.body.product_id;
    if(product_id) {
      const response_product = await productService.get(product_id);
      if(response_product.length <= 0){
        return res.status(404).json({ message: 'Product not found'});
      }
    }

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.issues });
    }

    if (!products_materials_id) {
      return res.status(400).json({ errors: 'Product material ID is required' });
    }

    const response = await productMaterialService.update(products_materials_id, parsedBody.data);
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product material not found'});
    }

    return res.status(200).json({ message: 'Product material updated with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating product material' });
  }
};