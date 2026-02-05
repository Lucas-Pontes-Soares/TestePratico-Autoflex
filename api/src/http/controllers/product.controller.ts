import express from 'express';
import { productSchema, productSchemaUpdate } from '../schemas/product.schema.ts';
import type { ProductSchema, ProductSchemaUpdate } from '../schemas/product.schema.ts';
import * as productService from '../services/product.service.ts';

export async function create(req: express.Request<any, any, ProductSchema>, res: express.Response) {
  try {
    const parsedBody = productSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const response = await productService.create(parsedBody.data);
    console.log(response);

    return res.status(201).json({ message: 'Product created with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating product' });
  }
};

export async function get(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const product_id = req.params.id;

    if (!product_id) {
        return res.status(400).json({ errors: 'Product_id is required' });
    }

    const response = await productService.get(product_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product not found'});
    }

    return res.status(200).json({ message: 'Product found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding product' });
  }
};

export async function getAll(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const response = await productService.getAll()
    console.log(response);

    return res.status(200).json({ message: 'Products found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding products' });
  }
};

export async function remove(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const product_id = req.params.id;

    if (!product_id) {
        return res.status(400).json({ errors: 'Product_id is required' });
    }

    const response = await productService.remove(product_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product not found'});
    }

    return res.status(200).json({ message: 'Product deleted with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting product' });
  }
};

export async function update(req: express.Request<any, any, ProductSchemaUpdate>, res: express.Response) {
  try {
    const parsedBody = productSchemaUpdate.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const product_id = req.params.id;

    if (!product_id) {
        return res.status(400).json({ errors: 'Product_id is required' });
    }

    const response = await productService.update(product_id, parsedBody.data);
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Product not found'});
    }

    return res.status(200).json({ message: 'Product updated with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating product' });
  }
};