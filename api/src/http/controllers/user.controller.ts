import express from 'express';
import { userSchema, userSchemaUpdate } from '../schemas/user.schema.ts';
import type { UserSchema, UserSchemaUpdate } from '../schemas/user.schema.ts';
import * as userService from '../services/user.service.ts';
import bcrypt from 'bcrypt';
import * as jwt from '../../lib/jwt.ts';

export async function create(req: express.Request<any, any, UserSchema>, res: express.Response) {
  try {
    const parsedBody = userSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const existingUser = await userService.findByEmail(parsedBody.data.email);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const response = await userService.create(parsedBody.data);
    console.log(response);

    return res.status(201).json({ message: 'User created with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

export async function get(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ errors: 'User ID is required' });
    }

    const response = await userService.get(user_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'User not found'});
    }

    return res.status(200).json({ message: 'User found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding user' });
  }
};

export async function getAll(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const response = await userService.getAll()
    console.log(response);

    return res.status(200).json({ message: 'Users found with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error finding users' });
  }
};

export async function remove(req: express.Request<any, any, any>, res: express.Response) {
  try {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ errors: 'User ID is required' });
    }

    const response = await userService.remove(user_id)
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'User not found'});
    }

    return res.status(200).json({ message: 'User deleted with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

export async function update(req: express.Request<any, any, UserSchemaUpdate>, res: express.Response) {
  try {
    const parsedBody = userSchemaUpdate.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.issues });
    }

    const user_id = req.params.id;

    if (!user_id) {
      return res.status(400).json({ errors: 'User ID is required' });
    }

    const response = await userService.update(user_id, parsedBody.data);
    console.log(response);

    if(response.length <= 0) {
      return res.status(404).json({ message: 'User not found'});
    }

    return res.status(200).json({ message: 'User updated with success', data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

export async function login(req: express.Request<any, any, Pick<UserSchema, 'email' | 'password'>>, res: express.Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userLogged = await userService.login(email, password);

    let payload;

    if(userLogged) {
      payload = {
        user_id: userLogged[0].id,
        email: userLogged[0].email
      }
    } else {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.generateToken(payload);

    return res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during login' });
  }
};