import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Spinner } from "./spinner"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.SubmitEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post("/user/login", { email, password })
      
      localStorage.setItem("autoflex:auth", response.data.token)
      
      toast.success("Login realizado com sucesso!")
      navigate("/products")
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao fazer login"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Login com e-mail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  {/*
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                  */}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner/> : null}
                  {isLoading ? "Entrando..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Não possui uma conta? <a href="/register">Registrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}