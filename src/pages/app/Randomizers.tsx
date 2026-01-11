import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Shuffle,
  Shield,
  ExternalLink,
  Settings,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Randomizer {
  id: string;
  name: string;
  slug: string;
  mode: string;
  active: boolean;
  cloaker_enabled: boolean;
  created_at: string;
}

export default function Randomizers() {
  const [randomizers, setRandomizers] = useState<Randomizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const { user } = useAuth();

  const fetchRandomizers = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('randomizers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar randomizadores');
      return;
    }

    setRandomizers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomizers();
  }, [user]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 20);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !user) return;

    setCreating(true);
    const slug = generateSlug(newName) + '-' + Math.random().toString(36).substring(2, 6);

    const { error } = await supabase.from('randomizers').insert({
      user_id: user.id,
      name: newName.trim(),
      slug,
    });

    setCreating(false);

    if (error) {
      toast.error('Erro ao criar randomizador');
      return;
    }

    toast.success('Randomizador criado com sucesso!');
    setNewName('');
    setCreateOpen(false);
    fetchRandomizers();
  };

  const getShortUrl = (slug: string) => {
    return `https://flx.pay/r/${slug}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Randomizadores
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie a distribuição de tráfego entre seus bots
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Novo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display">Novo Randomizador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Randomizador</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Campanha Black Friday"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-glow"
                  />
                </div>
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Randomizador'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Randomizers list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : randomizers.length === 0 ? (
          <div className="card-glow rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shuffle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              Nenhum randomizador ainda
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Crie seu primeiro randomizador para começar a distribuir tráfego.
            </p>
            <Button variant="hero" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Randomizador
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {randomizers.map((randomizer) => (
              <div
                key={randomizer.id}
                className="card-glow rounded-xl border border-border bg-card p-5 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shuffle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{randomizer.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">
                        Modo: {randomizer.mode === 'random' ? 'Aleatório' : 'Ponderado'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={randomizer.active ? 'active' : 'inactive'} />
                </div>

                {randomizer.cloaker_enabled && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-xs font-medium text-success">Cloaker Nativo</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                    <span className="text-xs text-muted-foreground flex-1 truncate font-mono">
                      {getShortUrl(randomizer.slug)}
                    </span>
                    <CopyButton text={getShortUrl(randomizer.slug)} />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      asChild
                    >
                      <Link to={`/app/randomizadores/${randomizer.id}`}>
                        <Settings className="h-4 w-4" />
                        Configurar
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={getShortUrl(randomizer.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
