import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CopyButton } from '@/components/shared/CopyButton';
import { User, Mail, Key, CreditCard, LogOut, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  name: string | null;
  plan: string | null;
}

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('name, plan')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setName(data.name || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast.error('Erro ao atualizar perfil');
      return;
    }

    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const apiKey = `flx_${user?.id?.slice(0, 8)}_${Math.random().toString(36).slice(2, 10)}`;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Minha Conta</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Profile Section */}
        <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Perfil</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="input-glow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-secondary"
                  />
                </div>
              </div>

              <Button variant="hero" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Plano</h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div>
              <p className="font-medium text-foreground">Plano {profile?.plan || 'Free'}</p>
              <p className="text-sm text-muted-foreground">
                Acesso básico à plataforma
              </p>
            </div>
            <Button variant="outline" disabled>
              Upgrade (em breve)
            </Button>
          </div>
        </div>

        {/* API Section */}
        <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">API & Tokens</h2>
          </div>

          <div className="space-y-2">
            <Label>Chave da API</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
              <code className="flex-1 text-sm font-mono text-foreground truncate">{apiKey}</code>
              <CopyButton text={apiKey} />
            </div>
            <p className="text-xs text-muted-foreground">
              Use esta chave para integrar com a API do FlexionPay
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="card-glow rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sair da conta</p>
              <p className="text-sm text-muted-foreground">
                Você será desconectado de todos os dispositivos
              </p>
            </div>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
