import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Loader2, Plus, RefreshCcw, Minus, X } from "lucide-react"
import { api } from "@/lib/axios"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLoggedUserId } from "@/lib/userLogged"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string;
  name: string;
  value: number;
  updatedAt: string;
  materials?: ProductMaterial[];
}

interface AugmentedProduct extends Product {
  materialsDisplay: string;
}

interface RawMaterial {
  id: string;
  name: string;
  stock_quantity: number;
  updatedAt: string;
}

interface ProductMaterial {
  id?: string;
  product_id: string;
  raw_material_id: string;
  required_quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<AugmentedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [allRawMaterials, setAllRawMaterials] = useState<RawMaterial[]>([])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newValue, setNewValue] = useState(0)
  const [newMaterials, setNewMaterials] = useState<ProductMaterial[]>([{ product_id: '', raw_material_id: '', required_quantity: 0 }]); 
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editName, setEditName] = useState("")
  const [editValue, setEditValue] = useState(0)
  const [editMaterials, setEditMaterials] = useState<ProductMaterial[]>([]);
  const [isUpdating, setIsUpdating] = useState(false)


  async function fetchAllRawMaterials() {
    try {
      const response = await api.get("/raw-materials");
      setAllRawMaterials(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar matérias-primas disponíveis");
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true)
      const productsResponse = await api.get("/products");
      const productsData: Product[] = productsResponse.data.data;

      const allProductMaterialsResponse = await api.get("/products-materials");
      const allProductMaterials: ProductMaterial[] = allProductMaterialsResponse.data.data.map((m: any) => ({
        id: m.id,
        raw_material_id: m.raw_material_id,
        required_quantity: m.required_quantity,
        product_id: m.product_id,
      }));
      
      const augmentedProducts: AugmentedProduct[] = productsData.map(product => {
        const materialsForProduct = allProductMaterials.filter(pm => pm.product_id === product.id);
        
        const materialsDisplayParts = materialsForProduct.map(pm => {
          const rawMaterial = allRawMaterials.find(rm => rm.id === pm.raw_material_id);
          return rawMaterial ? `${pm.required_quantity}x ${rawMaterial.name}` : '';
        }).filter(Boolean);

        return {
          ...product,
          materialsDisplay: materialsDisplayParts.length > 0 ? materialsDisplayParts.join(', ') : 'Nenhum material associado',
        };
      });

      setProducts(augmentedProducts);
    } catch (error) {
      toast.error("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchAllRawMaterials();
  }, [allRawMaterials.length])


  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newName.trim()) {
      return toast.error("O nome do produto é obrigatório.")
    }

    if (newValue <= 0) {
      return toast.error("O valor do produto deve ser positivo.")
    }

    const validMaterials = newMaterials.filter(m => m.raw_material_id && m.required_quantity > 0);

    if (validMaterials.length === 0) {
      return toast.error("É necessário informar ao menos uma matéria-prima com quantidade para o produto.");
    }

    if (newMaterials.length > 0 && validMaterials.length !== newMaterials.length) {
      return toast.error("Preencha todas as matérias-primas selecionadas e suas quantidades necessárias ou remova as linhas vazias.");
    }
    
    const materialIds = validMaterials.map(m => m.raw_material_id);
    const hasDuplicates = new Set(materialIds).size !== materialIds.length;
    if (hasDuplicates) {
        return toast.error("Não é possível selecionar a mesma matéria-prima múltiplas vezes.");
    }


    setIsSubmitting(true)
    try {

      const user_id = getLoggedUserId();

      const productResponse = await api.post("/products", {
        name: newName,
        value: newValue,
        created_by: user_id,
        updated_by: user_id
      })
      const createdProductId = productResponse.data.data[0].id;

      if (validMaterials.length > 0) {
        await Promise.all(validMaterials.map(material => 
          api.post("/products-materials", {
            product_id: createdProductId,
            raw_material_id: material.raw_material_id,
            required_quantity: material.required_quantity,
            created_by: user_id,
            updated_by: user_id
          })
        ));
      }

      toast.success("Produto criado com sucesso!")
      
      fetchProducts()
      
      setNewName("")
      setNewValue(0)
      setNewMaterials([{ product_id: '', raw_material_id: '', required_quantity: 0 }]);
      setIsCreateOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar produto")
    } finally {
      setIsSubmitting(false)
    }
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setEditName(product.name)
    setEditValue(product.value)
    
    const fetchProductMaterials = async () => {
      try {
        const response = await api.get(`/products-materials/product/${product.id}`);
        const fetchedMaterials = response.data.data.map((m: any) => ({
          id: m.id,
          raw_material_id: m.raw_material_id,
          required_quantity: m.required_quantity,
        }));
        setEditMaterials(fetchedMaterials.length > 0 ? fetchedMaterials : [{ raw_material_id: '', required_quantity: 0 }]);
      } catch (error) {
        toast.error("Erro ao carregar matérias-primas do produto.");
        setEditMaterials([{ product_id: '', raw_material_id: '', required_quantity: 0 }]); 
      }
    };

    fetchProductMaterials();
    setIsEditOpen(true)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProduct) return

    if (!editName.trim()) {
      return toast.error("O nome do produto é obrigatório.")
    }

    if (editValue <= 0) {
      return toast.error("O valor do produto deve ser positivo.")
    }

    const validMaterials = editMaterials.filter(m => m.raw_material_id && m.required_quantity > 0);
    
    if (validMaterials.length === 0) {
      return toast.error("É necessário informar ao menos uma matéria-prima com quantidade para o produto.");
    }
    
    if (editMaterials.length > 0 && validMaterials.length !== editMaterials.length) {
      return toast.error("Preencha todas as matérias-primas selecionadas e suas quantidades necessárias ou remova as linhas vazias.");
    }

    const materialIds = validMaterials.map(m => m.raw_material_id);
    const hasDuplicates = new Set(materialIds).size !== materialIds.length;
    if (hasDuplicates) {
        return toast.error("Não é possível selecionar a mesma matéria-prima múltiplas vezes.");
    }

    setIsUpdating(true)
    try {
      const user_id = getLoggedUserId();

      await api.put(`/product/${editingProduct.id}`, {
        name: editName,
        value: editValue,
        updated_by: user_id
      })

      const currentMaterialsResponse = await api.get(`/products-materials/product/${editingProduct.id}`);
      const currentMaterials: ProductMaterial[] = currentMaterialsResponse.data.data.map((m: any) => ({
        id: m.id,
        raw_material_id: m.raw_material_id,
        required_quantity: m.required_quantity,
      }));

      const materialsToAdd: ProductMaterial[] = [];
      const materialsToUpdate: ProductMaterial[] = [];
      const materialsToDelete: string[] = [];

      for (const editMaterial of validMaterials) {
        if (!editMaterial.id) { 
          materialsToAdd.push(editMaterial);
        } else { 
          const correspondingCurrent = currentMaterials.find(cm => cm.id === editMaterial.id);
          if (correspondingCurrent && 
              (correspondingCurrent.raw_material_id !== editMaterial.raw_material_id || 
               correspondingCurrent.required_quantity !== editMaterial.required_quantity)) {
            materialsToUpdate.push(editMaterial);
          }
        }
      }

      for (const currentMaterial of currentMaterials) {
        const stillExistsInEdit = validMaterials.some(em => em.id === currentMaterial.id);
        if (!stillExistsInEdit) {
          materialsToDelete.push(currentMaterial.id!); 
        }
      }

      const materialPromises: Promise<any>[] = [];

      materialsToAdd.forEach(material => {
        materialPromises.push(api.post("/products-materials", {
          product_id: editingProduct.id,
          raw_material_id: material.raw_material_id,
          required_quantity: material.required_quantity,
          created_by: user_id,
          updated_by: user_id
        }));
      });

      materialsToUpdate.forEach(material => {
        materialPromises.push(api.put(`/product-material/${material.id}`, {
          raw_material_id: material.raw_material_id,
          required_quantity: material.required_quantity,
          updated_by: user_id
        }));
      });

      materialsToDelete.forEach(materialId => {
        materialPromises.push(api.delete(`/product-material/${materialId}`));
      });

      await Promise.all(materialPromises);

      toast.success("Produto atualizado!")
      
      fetchProducts()
      
      setIsEditOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar")
    } finally {
      setIsUpdating(false)
    }
  }

  function openDeleteDialog(product: Product) {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!productToDelete) return

    try {
      const materialsResponse = await api.get(`/products-materials/product/${productToDelete.id}`);
      const associatedMaterials: ProductMaterial[] = materialsResponse.data.data.map((m: any) => ({
        id: m.id,
        raw_material_id: m.raw_material_id,
        required_quantity: m.required_quantity,
      }));
      const deleteMaterialPromises = associatedMaterials.map(material => 
        api.delete(`/product-material/${material.id}`)
      );
      await Promise.all(deleteMaterialPromises);

      await api.delete(`/product/${productToDelete.id}`)
      toast.success("Produto removido!")
      setProducts(prev => prev.filter(item => item.id !== productToDelete.id))
    } catch (error) {
      toast.error("Erro ao excluir item. Certifique-se de que não há outras dependências.")
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleMaterialChange = (
    index: number, 
    field: keyof ProductMaterial, 
    value: string | number,
    state: ProductMaterial[], 
    setState: React.Dispatch<React.SetStateAction<ProductMaterial[]>>
  ) => {
    const updatedMaterials = [...state];
    if (field === 'raw_material_id') {
        updatedMaterials[index][field] = value as string;
    } else if (field === 'required_quantity') {
        updatedMaterials[index][field] = Math.max(0, value as number);
    }
    setState(updatedMaterials);
  };

  const addMaterial = (setState: React.Dispatch<React.SetStateAction<ProductMaterial[]>>) => {
    setState(prev => [...prev, { product_id: '', raw_material_id: '', required_quantity: 0 }]);
  };

  const removeMaterial = (index: number, setState: React.Dispatch<React.SetStateAction<ProductMaterial[]>>) => {
    setState(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Páginas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Produtos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Produtos
              </h1>
              <span className="text-sm text-muted-foreground">
                Total de produtos: <span className="font-medium text-primary">{products.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={fetchProducts} 
                variant="outline"
                className="cursor-pointer"
              >
                <RefreshCcw className="mr-2 size-4" />
                Atualizar Lista
              </Button>
                
              <Button onClick={() => setIsCreateOpen(true)} className="bg-green-600 text-white hover:bg-green-500 cursor-pointer">
                <Plus className="mr-2 size-4" />
                Criar
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Materiais</TableHead> {/* New TableHead */}
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center"> 
                        Nenhum produto encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.id}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value / 100)}
                        </TableCell>
                        <TableCell>
                          {item.materialsDisplay}
                        </TableCell>
                        <TableCell>
                          {item.updatedAt ? (
                              new Date(item.updatedAt).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                              })
                            ) : (
                              "Sem data"
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(item)}
                              className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openDeleteDialog(item)} 
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* AlertDialog for create */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[425px] px-2">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
                <DialogDescription>
                  Adicione um novo produto.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Camisa, Calça, Boné..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="value">Valor do Produto (em centavos)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="value"
                      type="number"
                      className="text-center"
                      value={newValue === 0 ? "" : newValue}
                      onChange={(e) => setNewValue(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="(Ex: 1250 para R$12,50)"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Dynamic Material Inputs for Create */}
                <div className="grid gap-2">
                  <Label>Matérias-Primas Necessárias</Label>
                  {newMaterials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={material.raw_material_id}
                        onValueChange={(value) => handleMaterialChange(index, 'raw_material_id', value, newMaterials, setNewMaterials)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allRawMaterials.map((rm) => (
                            <SelectItem key={rm.id} value={rm.id}>
                              {rm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleMaterialChange(index, 'required_quantity', material.required_quantity - 1, newMaterials, setNewMaterials)}
                        disabled={isSubmitting}
                      >
                        <Minus className="size-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        className="w-[80px] text-center"
                        value={material.required_quantity}
                        onChange={(e) => handleMaterialChange(index, 'required_quantity', Number(e.target.value), newMaterials, setNewMaterials)}
                        disabled={isSubmitting}
                      />

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleMaterialChange(index, 'required_quantity', material.required_quantity + 1, newMaterials, setNewMaterials)}
                        disabled={isSubmitting}
                      >
                        <Plus className="size-4" />
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeMaterial(index, setNewMaterials)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addMaterial(setNewMaterials)}
                    disabled={isSubmitting}
                    className="mt-2"
                  >
                    <Plus className="mr-2 size-4" /> Adicionar Matéria-Prima
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Criar Produto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for edit */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px] px-2">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogDescription>
                  Altere as informações do produto selecionado.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-value">Valor do Produto (em centavos)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-value"
                      type="number"
                      className="text-center"
                      value={editValue === 0 ? "" : editValue}
                      onChange={(e) => setEditValue(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="(Ex: 1250 para R$12,50)"
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                {/* Dynamic Material Inputs for Edit */}
                <div className="grid gap-2">
                  <Label>Matérias-Primas Necessárias</Label>
                  {editMaterials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={material.raw_material_id}
                        onValueChange={(value) => handleMaterialChange(index, 'raw_material_id', value, editMaterials, setEditMaterials)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allRawMaterials.map((rm) => (
                            <SelectItem key={rm.id} value={rm.id}>
                              {rm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleMaterialChange(index, 'required_quantity', material.required_quantity - 1, editMaterials, setEditMaterials)}
                        disabled={isUpdating}
                      >
                        <Minus className="size-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        className="w-[80px] text-center"
                        value={material.required_quantity}
                        onChange={(e) => handleMaterialChange(index, 'required_quantity', Number(e.target.value), editMaterials, setEditMaterials)}
                        disabled={isUpdating}
                      />

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleMaterialChange(index, 'required_quantity', material.required_quantity + 1, editMaterials, setEditMaterials)}
                        disabled={isUpdating}
                      >
                        <Plus className="size-4" />
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeMaterial(index, setEditMaterials)}
                        disabled={isUpdating}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addMaterial(setEditMaterials)}
                    disabled={isUpdating}
                    className="mt-2"
                  >
                    <Plus className="mr-2 size-4" /> Adicionar Matéria-Prima
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsEditOpen(false)}
                  disabled={isUpdating}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* AlertDialog for remove */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem certeza que deseja excluir o produto: 
                  <span className="font-bold text-foreground"> {productToDelete?.name}</span>? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

      </SidebarInset>
    </SidebarProvider>
  )
}
