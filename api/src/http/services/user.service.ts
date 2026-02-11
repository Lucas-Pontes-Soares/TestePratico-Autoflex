import { randomUUID } from "node:crypto";
import { db } from "../../db/client.ts";
import { schema } from "../../db/schema/index.ts";
import type { UserSchema, UserSchemaUpdate } from "../schemas/user.schema.ts";
import { eq, sql } from "drizzle-orm";
import bcrypt from 'bcrypt';

export async function login(email: string, password: string){
    const user = await db.select().from(schema.users)
    .where(eq(schema.users.email, email));

    const isValidCredentials = await bcrypt.compare(password, user[0].password);

    if(isValidCredentials){
        return user;
    }
    return;
}

export async function create(data: UserSchema) {
   const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await db.insert(schema.users).values({
        id: randomUUID(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })
    .returning();
  
    const userWithoutPassword = user.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    return userWithoutPassword;
};

export async function get(user_id: string) {
    const user = await db.select().from(schema.users)
    .where(eq(schema.users.id, user_id));
  
    const userWithoutPassword = user.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    return userWithoutPassword;
};

export async function getAll() {
    const users = await db.select().from(schema.users);
  
    const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    return usersWithoutPassword;
};

export async function findByEmail(email: string) {
    const user = await db.select().from(schema.users)
    .where(eq(schema.users.email, email));
  
    const userWithoutPassword = user.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    return userWithoutPassword;
};

export async function remove(user_id: string) {
    const user = await db.delete(schema.users)
    .where(eq(schema.users.id, user_id))
    .returning();
  
    const userWithoutPassword = user.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    return userWithoutPassword;
};

export async function update(user_id: string, data: UserSchemaUpdate) {
    const { name, email, old_password, new_password } = data;
    let password_to_update: string | undefined = undefined;

    if (new_password && old_password) {
        const [user] = await db.select().from(schema.users)
            .where(eq(schema.users.id, user_id));

        const isPasswordCorrect = bcrypt.compareSync(old_password, user.password);

        if (isPasswordCorrect) {
            password_to_update = await bcrypt.hash(new_password, 10);
        }
    }

    const updatedUser = await db.update(schema.users).set({ 
        name: name || undefined, 
        email: email || undefined, 
        password: password_to_update,
        updated_at: sql`NOW()` 
    })
    .where(eq(schema.users.id, user_id))
    .returning();
  
    return updatedUser;
}