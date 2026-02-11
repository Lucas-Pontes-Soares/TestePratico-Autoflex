import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Loader2, Plus, RefreshCcw, Minus } from "lucide-react"
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

interface RawMaterial {
  id: string;
  name: string;
  stock_quantity: number;
  updatedAt: string;
}

export default function RawMaterials() {
  const [materials, setMaterials] = useState<RawMaterial[]>([])
  const [loading, setLoading] = useState(true)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState<RawMaterial | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newStock, setNewStock] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null)
  const [editName, setEditName] = useState("")
  const [editStock, setEditStock] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)


  async function fetchMaterials() {
    try {
      setLoading(true)
      const response = await api.get("/raw-materials")
      setMaterials(response.data.data)
    } catch (error) {
      toast.error("Erro ao carregar matérias-primas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function handleCreate(e: React.SubmitEvent) {
    e.preventDefault()
    
    if (!newName.trim()) {
      return toast.error("O nome da matéria-prima é obrigatório.")
    }

    setIsSubmitting(true)
    try {

      const user_id = getLoggedUserId();

      await api.post("/raw-materials", {
        name: newName,
        stock_quantity: newStock,
        created_by: user_id,
        updated_by: user_id
      })

      toast.success("Matéria-prima criada com sucesso!")
      
      fetchMaterials()
      
      setNewName("")
      setNewStock(0)
      setIsCreateOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar matéria-prima")
    } finally {
      setIsSubmitting(false)
    }
  }

  function openEditDialog(material: RawMaterial) {
    setEditingMaterial(material)
    setEditName(material.name)
    setEditStock(material.stock_quantity)
    setIsEditOpen(true)
  }

  async function handleUpdate(e: React.SubmitEvent) {
    e.preventDefault()
    if (!editingMaterial) return

    setIsUpdating(true)
    try {

      const user_id = getLoggedUserId();

      await api.put(`/raw-material/${editingMaterial.id}`, {
        name: editName,
        stock_quantity: editStock,
        updated_by: user_id
      })

      toast.success("Matéria-prima atualizada!")
      
      fetchMaterials()
      
      setIsEditOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar")
    } finally {
      setIsUpdating(false)
    }
  }

  function openDeleteDialog(material: RawMaterial) {
    setMaterialToDelete(material)
    setIsDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!materialToDelete) return

    try {
      await api.delete(`/raw-material/${materialToDelete.id}`)
      toast.success("Matéria-prima removida!")
      setMaterials(prev => prev.filter(item => item.id !== materialToDelete.id))
    } catch (error) {
      toast.error("Erro ao excluir item")
    } finally {
      setIsDeleteDialogOpen(false)
      setMaterialToDelete(null)
    }
  }

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
                <BreadcrumbPage>Matérias Primas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-4 gap-y-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Estoque de Matérias Primas
              </h1>
              <span className="text-sm text-muted-foreground">
                Total de matérias primas: <span className="font-medium text-primary">{materials.length}</span>
              </span>
            </div>

            <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
              <Button 
                onClick={fetchMaterials} 
                variant="outline"
                className="cursor-pointer w-full md:w-auto"
              >
                <RefreshCcw className="mr-2 size-4" />
                Atualizar Lista
              </Button>
                
              <Button onClick={() => setIsCreateOpen(true)} className="bg-green-600 text-white hover:bg-green-500 cursor-pointer w-full md:w-auto">
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
                    <TableHead>Qtd. Estoque</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma matéria-prima encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    materials.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.id}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <span className={item.stock_quantity < 10 ? "text-red-500 font-bold" : ""}>
                            {item.stock_quantity}
                          </span>
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
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Nova Matéria-Prima</DialogTitle>
                <DialogDescription>
                  Adicione um novo insumo ao estoque.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Matéria-Prima</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Madeira, Aço, Vidro..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stock">Quantidade Inicial em Estoque</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setNewStock(prev => Math.max(0, prev - 1))}
                      disabled={isSubmitting}
                    >
                      <Minus className="size-4" />
                    </Button>
                    
                    <Input
                      id="stock"
                      type="number"
                      className="text-center"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      disabled={isSubmitting}
                    />

                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setNewStock(prev => prev + 1)}
                      disabled={isSubmitting}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
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
                  {isSubmitting ? "Criando..." : "Criar Matéria-Prima"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for edit */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Editar Matéria-Prima</DialogTitle>
                <DialogDescription>
                  Altere as informações do insumo selecionado.
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
                  <Label htmlFor="edit-stock">Quantidade em Estoque</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditStock(prev => Math.max(0, prev - 1))}
                      disabled={isUpdating}
                    >
                      <Minus className="size-4" />
                    </Button>
                    
                    <Input
                      id="edit-stock"
                      type="number"
                      className="text-center"
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      disabled={isUpdating}
                    />

                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditStock(prev => prev + 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
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
                  Você tem certeza que deseja excluir a matéria-prima: 
                  <span className="font-bold text-foreground"> {materialToDelete?.name}</span>? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Cancelar</AlertDialogCancel>
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