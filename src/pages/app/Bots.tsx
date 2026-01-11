import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Bot, MoreVertical, Edit2, Pause, Play, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BotItem {
  id: string;
  name: string;
  handle: string;
  status: 'online' | 'offline' | 'paused';
  created_at: string;
}

export default function Bots() {
  const [bots, setBots] = useState<BotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const { user } = useAuth();

  const fetchBots = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar bots');
      return;
    }

    setBots((data || []) as BotItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBots();
  }, [user]);

  const handleCreate = async () => {
    if (!newName.trim() || !newHandle.trim() || !user) return;

    setCreating(true);

    const { error } = await supabase.from('bots').insert({
      user_id: user.id,
      name: newName.trim(),
      handle: newHandle.trim(),
    });

    setCreating(false);

    if (error) {
      toast.error('Erro ao criar bot');
      return;
    }

    toast.success('Bot criado com sucesso!');
    setNewName('');
    setNewHandle('');
    setCreateOpen(false);
    fetchBots();
  };

  const handleStatusChange = async (botId: string, newStatus: 'online' | 'offline' | 'paused') => {
    const { error } = await supabase
      .from('bots')
      .update({ status: newStatus })
      .eq('id', botId);

    if (error) {
      toast.error('Erro ao atualizar status');
      return;
    }

    setBots(bots.map((b) => (b.id === botId ? { ...b, status: newStatus } : b)));
    toast.success('Status atualizado');
  };

  const handleDelete = async (botId: string) => {
    const { error } = await supabase.from('bots').delete().eq('id', botId);

    if (error) {
      toast.error('Erro ao excluir bot');
      return;
    }

    setBots(bots.filter((b) => b.id !== botId));
    toast.success('Bot excluído');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Meus Bots</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie seus bots de vendas
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display">Novo Bot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="botName">Nome do Bot</Label>
                  <Input
                    id="botName"
                    placeholder="Ex: Bot Principal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-glow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botHandle">Handle / Identificador</Label>
                  <Input
                    id="botHandle"
                    placeholder="Ex: @meubot"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="input-glow"
                  />
                </div>
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleCreate}
                  disabled={!newName.trim() || !newHandle.trim() || creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Bot'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bots list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bots.length === 0 ? (
          <div className="card-glow rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              Nenhum bot ainda
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Crie seu primeiro bot para começar a automatizar suas vendas.
            </p>
            <Button variant="hero" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Bot
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="card-glow rounded-xl border border-border bg-card p-5 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{bot.name}</h3>
                      <p className="text-xs text-muted-foreground">{bot.handle}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {bot.status === 'paused' ? (
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleStatusChange(bot.id, 'online')}
                        >
                          <Play className="h-4 w-4" />
                          Ativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleStatusChange(bot.id, 'paused')}
                        >
                          <Pause className="h-4 w-4" />
                          Pausar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="gap-2 text-destructive"
                        onClick={() => handleDelete(bot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={bot.status} />
                  <span className="text-xs text-muted-foreground">
                    Criado em {new Date(bot.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
