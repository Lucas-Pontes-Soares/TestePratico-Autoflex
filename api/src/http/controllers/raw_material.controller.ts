import express from 'express';
import { rawMaterialSchema, rawMaterialSchemaUpdate } from '../schemas/raw_material.schema.ts';
import type { RawMaterialSchema, RawMaterialSchemaUpdate } from '../schemas/raw_material.schema.ts';
import * as rawMaterialService from '../services/raw_material.service.ts';

export async function create(req: express.Request<any, any, RawMaterialSchema>, res: express.Response) {
  try {
    const parsedBody = rawMaterialSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const response = await rawMaterialService.create(parsedBody.data);
    console.log(response);

    return res.status(201).json({ message: 'Raw material created with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating raw material' });
  }
};

export async function get(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const raw_material_id = req.params.id;

    if (!raw_material_id) {
      return res.status(400).json({ errors: 'Raw material ID is required' });
    }

    const response = await rawMaterialService.get(raw_material_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Raw material not found'});
    }

    return res.status(200).json({ message: 'Raw material found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding raw material' });
  }
};

export async function getAll(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const response = await rawMaterialService.getAll()
    console.log(response);

    return res.status(200).json({ message: 'Raw materials found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding raw materials' });
  }
};

export async function remove(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const raw_material_id = req.params.id;

    if (!raw_material_id) {
      return res.status(400).json({ errors: 'Raw material ID is required' });
    }

    const response = await rawMaterialService.remove(raw_material_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Raw material not found'});
    }

    return res.status(200).json({ message: 'Raw material deleted with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting raw material' });
  }
};

export async function update(req: express.Request<any, any, RawMaterialSchemaUpdate>, res: express.Response) {
  try {
    const parsedBody = rawMaterialSchemaUpdate.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const raw_material_id = req.params.id;

    if (!raw_material_id) {
      return res.status(400).json({ errors: 'Raw material ID is required' });
    }

    const response = await rawMaterialService.update(raw_material_id, parsedBody.data);
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'Raw material not found'});
    }

    return res.status(200).json({ message: 'Raw material updated with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating raw material' });
  }
};