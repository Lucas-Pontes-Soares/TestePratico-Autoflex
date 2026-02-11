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
import { useNavigate } from "react-router"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { Spinner } from "./spinner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  async function handleSignup(e: React.SubmitEvent) {
  e.preventDefault()

  if (password !== confirmPassword) {
    return toast.error(`As ${password} senhas ${confirmPassword} não coincidem!`, )
  }

  setIsLoading(true)

  try {
    await api.post("/users", {
      name,
      email,
      password
    })

    const loginResponse = await api.post("/user/login", { 
      email, 
      password 
    })
    
    localStorage.setItem("autoflex:auth", loginResponse.data.token)
    
    toast.success("Conta criada e login realizado com sucesso!")
    
    navigate("/products") 

  } catch (error: any) {
    const message = error.response?.data?.message || "Erro ao processar solicitação"
    toast.error(message)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registre sua conta</CardTitle>
          <CardDescription>
            Entre com seu e-mail abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="João Nascimento" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirme a senha
                    </FieldLabel>
                    <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner/> : null}
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
                <FieldDescription className="text-center">
                  Já possui uma conta? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
