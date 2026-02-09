import { Box } from "lucide-react"

import { LoginForm } from "@/components/ui/login-form"

export default function Login() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <p className="flex items-center gap-2 self-center font-medium">
          <div className="bg-sidebar-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Box className="size-4" />
          </div>
          AutoFlex
        </p>
        <LoginForm />
      </div>
    </div>
  )
}
