import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field";
import { Box } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        
        <p className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Box className="size-4" />
          </div>
          AutoFlex
        </p>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Página não encontrada</CardTitle>
            <CardDescription>
              <span className="text-red-400 font-bold">Erro 404:</span> O conteúdo que você busca não existe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldDescription className="text-center">
              Deseja voltar para a segurança? <a href="/products" className="underline underline-offset-4 hover:text-primary">Início</a>
            </FieldDescription>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}