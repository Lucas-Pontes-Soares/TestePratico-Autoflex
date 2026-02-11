import { randomUUID } from "node:crypto";
import { db } from "../../db/client.ts";
import { schema } from "../../db/schema/index.ts";
import type { ProductMaterialSchema, ProductMaterialSchemaUpdate } from "../schemas/product_material.schema.ts";
import { desc, eq, sql } from "drizzle-orm";
import { _isoTime } from "zod/v4/core";
import { nextTick } from "node:process";
import { products } from "../../db/schema/products.ts";

export async function create(data: ProductMaterialSchema) {
    const newProductMaterial = await db.insert(schema.products_materials).values({
        id: randomUUID(),
        product_id: data.product_id,
        raw_material_id: data.raw_material_id,
        required_quantity: data.required_quantity,
        createdBy: data.created_by,
        updatedBy: data.updated_by
    })
    .returning();
  
    return newProductMaterial;
};

export async function get(products_materials_id: string) {
    const productMaterial = await db.select().from(schema.products_materials)
    .where(eq(schema.products_materials.id, products_materials_id));
  
    return productMaterial;
};

export async function getByProductId(product_id: string) {
    const productMaterial = await db.select().from(schema.products_materials)
    .where(eq(schema.products_materials.product_id, product_id));
  
    return productMaterial;
};


export async function getAll() {
    const productsMaterials = await db.select().from(schema.products_materials);
  
    return productsMaterials;
};

// This logic iteratively prioritizes high-value products by calculating the maximum possible production for each item
export async function getProductionSuggestion() {
    // find all products order by value
    const productsByDescValue = await db.select().from(schema.products)
    .orderBy(desc(schema.products.value))

    // find all stocks
    const materialsStock = await db.select().from(schema.raw_materials);

    // Fetch all product_materials once
    const allRawMaterials = await db.select().from(schema.raw_materials); 
    const allProductMaterials = await db.select().from(schema.products_materials);

    // manipulate stock in memory
    const virtualStock = new Map(
        materialsStock.map(m => [m.id, m.stock_quantity])
    );

    let productsBuild = new Map<string, number>();

    // for each product
    for(const product of productsByDescValue){
        let canProduceMore = true;

        // produce more of this product
        while(canProduceMore){
            canProduceMore = false;
            //console.log("product")

            // find raw material used in this product
            const products_materials = allProductMaterials.filter(pm => pm.product_id === product.id);

            let hasMaterialToBuild;
            let countEachSufficientMaterial = 0;
            let countEachSufficientMaterialToAnother = 0;

            // for each material
            for(const material of products_materials) {
                let typesOfMaterialUsed = products_materials.length;

                // verify stock of material
                const stock = virtualStock.get(material.raw_material_id) || 0;
                const hasEnoughtMaterial = stock >= material.required_quantity;

                if(hasEnoughtMaterial){
                    // verify is possible create another, multiplying by 2
                    if(stock >= (material.required_quantity * 2)){
                        countEachSufficientMaterialToAnother++;
                    }

                    countEachSufficientMaterial++;
                    //console.log("has");
                    console.log(countEachSufficientMaterial)
                    console.log(typesOfMaterialUsed)
                    //console.log("----");
                    
                    // if there is sufficient stock for each material
                    if(countEachSufficientMaterial == typesOfMaterialUsed) {
                        hasMaterialToBuild = true;
                        //console.log("create")

                        // if there is sufficient stock for each material to create another
                        if(countEachSufficientMaterialToAnother == typesOfMaterialUsed) {
                            canProduceMore = true;
                            //console.log("create another")
                        }
                    }
                }
            }

            // removing from stock, if is possible build
            if(hasMaterialToBuild) {
                for(const material of products_materials){
                    const currentStock = virtualStock.get(material.raw_material_id)!;
                    virtualStock.set(material.raw_material_id, currentStock - material.required_quantity);
                }
                // annex product build and your quantity
                let quantity = productsBuild.get(product.id) || 0;
                productsBuild.set(product.id, ++quantity);
            }
        }
    }

    let totalValueGenerated = 0;
    let totalItemsProduced = 0;

    // format the response
    const items = Array.from(productsBuild.entries()).map(([productId, quantity]) => {
        // find product to get value
        const productInfo = productsByDescValue.find(p => p.id === productId)!;
        const totalProductValue = quantity * Number(productInfo.value);

        totalValueGenerated += totalProductValue;
        totalItemsProduced += quantity;

        // Fetch and format associated materials for this product
        const associatedMaterials = allProductMaterials
            .filter(pm => pm.product_id === productId)
            .map(pm => {
                const rawMaterial = allRawMaterials.find(rm => rm.id === pm.raw_material_id);
                return {
                    id: pm.raw_material_id,
                    name: rawMaterial ? rawMaterial.name : 'Unknown Material',
                    required_quantity: pm.required_quantity,
                };
            });

        return {
            productName: productInfo.name,
            quantityProduced: quantity,
            unitValue: Number(productInfo.value),
            totalValue: totalProductValue,
            materials: associatedMaterials,
        };
    });

    return {
        items,
        totalItemsProduced,
        totalValueGenerated,
    };
}

export async function remove(products_materials_id: string) {
    const productMaterial = await db.delete(schema.products_materials)
    .where(eq(schema.products_materials.id, products_materials_id))
    .returning();
  
    return productMaterial;
};

export async function update(products_materials_id: string, data: ProductMaterialSchemaUpdate) {
    const productMaterial = await db.update(schema.products_materials).set({ 
        product_id: data.product_id || undefined,
        raw_material_id: data.raw_material_id || undefined,
        required_quantity: data.required_quantity || undefined, 
        updatedBy: data.updated_by, 
        updatedAt: sql`NOW()` 
    })
    .where(eq(schema.products_materials.id, products_materials_id))
    .returning();
  
    return productMaterial;
}
