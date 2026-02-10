import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLoggedUserId } from "@/lib/userLogged";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


  async function fetchUserProfile() {
    const userId = getLoggedUserId();
    if (!userId) {
      toast.error("Usuário não logado.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/user/${userId}`); 
      if (response.data.data && response.data.data.length > 0) {
        const fetchedProfile = response.data.data[0];
        setUserProfile(fetchedProfile);
        setEditableName(fetchedProfile.name); 
        setEditableEmail(fetchedProfile.email);
      } else {
          toast.error("Dados do usuário não encontrados.");
          navigate("/login");
      }
    } catch (error) {
      toast.error("Erro ao carregar perfil do usuário.");
      console.error("Failed to fetch user profile:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!userProfile) return;

    if (!editableName.trim()) {
      return toast.error("O nome é obrigatório.");
    }
    if (!editableEmail.trim()) {
      return toast.error("O email é obrigatório.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editableEmail)) {
      return toast.error("Por favor, insira um email válido.");
    }

    setIsUpdatingProfile(true);
    try {
      await api.put(`/user/${userProfile.id}`, {
        name: editableName,
        email: editableEmail,
        updated_by: userProfile.id, 
      });
      toast.success("Perfil atualizado com sucesso!");
      fetchUserProfile(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar o perfil.");
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!userProfile) return;

    if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      return toast.error("Todos os campos de senha são obrigatórios.");
    }

    if (newPassword.length < 6) {
      return toast.error("A nova senha deve ter no mínimo 6 caracteres.");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("A nova senha e a confirmação não coincidem.");
    }

    setIsUpdatingPassword(true);
    try {
      await api.put(`/user/${userProfile.id}`, {
        old_password: oldPassword,
        new_password: newPassword,
        updated_by: userProfile.id,
      });
      toast.success("Senha atualizada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar a senha.");
      console.error("Failed to update password:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  if (loading) {
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
                  <BreadcrumbPage>Perfil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 items-center justify-center p-6">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!userProfile) {
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
                  <BreadcrumbPage>Perfil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 items-center justify-center p-6">
            <p>Não foi possível carregar o perfil do usuário.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
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
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Meu Perfil
              </h1>
              <span className="text-sm text-muted-foreground">
                Visualize e edite suas informações de perfil.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editableName}
                      onChange={(e) => setEditableName(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editableEmail}
                      onChange={(e) => setEditableEmail(e.target.value)}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  {userProfile.avatar && (
                    <div className="grid gap-2">
                      <Label>Avatar</Label>
                      <img src={userProfile.avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                  )}
                  <Button type="submit" className="w-full mt-2" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? <Spinner/> : null}
                    {isUpdatingProfile ? "Atualizando..." : "Atualizar Perfil"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Atualizar Senha</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="old-password">Senha Antiga</Label>
                    <Input
                      id="old-password"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isUpdatingPassword}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isUpdatingPassword}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={isUpdatingPassword}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? <Spinner/> : null}
                    {isUpdatingPassword ? "Atualizando..." : "Atualizar Senha"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}