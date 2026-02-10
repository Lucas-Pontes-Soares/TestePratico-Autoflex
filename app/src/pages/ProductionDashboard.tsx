import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Drill, Loader2, RefreshCcw } from "lucide-react"
import { api } from "@/lib/axios"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductionItem {
  productName: string;
  quantityProduced: number;
  unitValue: number;
  totalValue: number;
  materials?: {
    id: string;
    name: string;
    required_quantity: number;
  }[];
}

interface ProductionSuggestionResponse {
  items: ProductionItem[];
  totalItemsProduced: number;
  totalValueGenerated: number;
}

export default function ProductionDashboard() {
  const [productionData, setProductionData] = useState<ProductionSuggestionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProductionSuggestion() {
    setLoading(true);
    try {
      const response = await api.get("/products-materials/production-suggestion");
      setProductionData(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar sugestão de produção.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductionSuggestion();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  };

  const formatMaterials = (materials?: ProductionItem['materials']) => {
    if (!materials || materials.length === 0) {
      return "N/A";
    }
    return materials.map(m => `${m.required_quantity}x ${m.name}`).join(', ');
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
                <BreadcrumbPage>Dashboard de Produção</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Dashboard de Produção
              </h1>
              <span className="text-sm text-muted-foreground">
                Sugestão de produção baseada no estoque de matérias-primas, priorizando produtos com maior valor.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={fetchProductionSuggestion}
                variant="outline"
                className="cursor-pointer"
                disabled={loading}
              >
                <RefreshCcw className="mr-2 size-4" />
                Atualizar Sugestão
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            productionData && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total de Itens Produzidos
                      </CardTitle>
                      <Drill className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-500">
                        {productionData.totalItemsProduced}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Itens
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Valor Total Gerado
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-500">
                        {formatCurrency(productionData.totalValueGenerated)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Com base na produção sugerida.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Qtd. Produzida</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Materiais</TableHead>
                        <TableHead>Materiais Totais</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productionData.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Nenhuma sugestão de produção encontrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        productionData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.quantityProduced}</TableCell>
                            <TableCell>{formatCurrency(item.unitValue)}</TableCell>
                            <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                            <TableCell>{formatMaterials(item.materials)}</TableCell>
                            <TableCell>
                                {item.materials?.map(m => 
                                    `${item.quantityProduced * m.required_quantity}x ${m.name}`
                                ).join(', ')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
