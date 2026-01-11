import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from '@/components/shared/CopyButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Bot,
  Shield,
  Target,
  Settings,
  Save,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Randomizer {
  id: string;
  name: string;
  slug: string;
  mode: string;
  active: boolean;
  cloaker_enabled: boolean;
}

interface UtmifyConfig {
  id: string;
  enabled: boolean;
  api_token: string | null;
  utm_script: string | null;
  pixel_script: string | null;
}

interface NativePixel {
  id: string;
  provider: string;
  pixel_id: string;
  access_token: string | null;
}

export default function RandomizerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [randomizer, setRandomizer] = useState<Randomizer | null>(null);
  const [utmifyConfig, setUtmifyConfig] = useState<UtmifyConfig | null>(null);
  const [pixels, setPixels] = useState<NativePixel[]>([]);

  // Form states
  const [name, setName] = useState('');
  const [mode, setMode] = useState('random');
  const [active, setActive] = useState(true);
  const [utmifyEnabled, setUtmifyEnabled] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [utmScript, setUtmScript] = useState('');
  const [pixelScript, setPixelScript] = useState('');

  // New pixel form
  const [newPixelProvider, setNewPixelProvider] = useState('meta');
  const [newPixelId, setNewPixelId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data: randData, error: randError } = await supabase
        .from('randomizers')
        .select('*')
        .eq('id', id)
        .single();

      if (randError || !randData) {
        toast.error('Randomizador não encontrado');
        navigate('/app/randomizadores');
        return;
      }

      setRandomizer(randData);
      setName(randData.name);
      setMode(randData.mode);
      setActive(randData.active);

      // Fetch utmify config
      const { data: utmData } = await supabase
        .from('utmify_configs')
        .select('*')
        .eq('randomizer_id', id)
        .single();

      if (utmData) {
        setUtmifyConfig(utmData);
        setUtmifyEnabled(utmData.enabled);
        setApiToken(utmData.api_token || '');
        setUtmScript(utmData.utm_script || '');
        setPixelScript(utmData.pixel_script || '');
      }

      // Fetch pixels
      const { data: pixelsData } = await supabase
        .from('native_pixels')
        .select('*')
        .eq('randomizer_id', id);

      if (pixelsData) {
        setPixels(pixelsData);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);

    // Update randomizer
    const { error: randError } = await supabase
      .from('randomizers')
      .update({ name, mode, active })
      .eq('id', id);

    if (randError) {
      toast.error('Erro ao salvar randomizador');
      setSaving(false);
      return;
    }

    // Upsert utmify config
    const { error: utmError } = await supabase.from('utmify_configs').upsert({
      randomizer_id: id,
      enabled: utmifyEnabled,
      api_token: apiToken || null,
      utm_script: utmScript || null,
      pixel_script: pixelScript || null,
    });

    if (utmError) {
      toast.error('Erro ao salvar configuração UTM');
      setSaving(false);
      return;
    }

    toast.success('Alterações salvas com sucesso!');
    setSaving(false);
  };

  const handleAddPixel = async () => {
    if (!id || !newPixelId.trim()) return;

    const { error } = await supabase.from('native_pixels').insert({
      randomizer_id: id,
      provider: newPixelProvider,
      pixel_id: newPixelId.trim(),
    });

    if (error) {
      toast.error('Erro ao adicionar pixel');
      return;
    }

    toast.success('Pixel adicionado!');
    setNewPixelId('');

    // Refresh pixels
    const { data } = await supabase
      .from('native_pixels')
      .select('*')
      .eq('randomizer_id', id);

    if (data) setPixels(data);
  };

  const handleRemovePixel = async (pixelId: string) => {
    const { error } = await supabase
      .from('native_pixels')
      .delete()
      .eq('id', pixelId);

    if (error) {
      toast.error('Erro ao remover pixel');
      return;
    }

    setPixels(pixels.filter((p) => p.id !== pixelId));
    toast.success('Pixel removido');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!randomizer) return null;

  const shortUrl = `https://flx.pay/r/${randomizer.slug}`;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/randomizadores')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {randomizer.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground font-mono">{shortUrl}</span>
              <CopyButton text={shortUrl} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bots" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="bots" className="gap-2">
              <Bot className="h-4 w-4" />
              Bots
            </TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2">
              <Target className="h-4 w-4" />
              Rastreamento
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Bots Tab */}
          <TabsContent value="bots" className="space-y-4">
            <div className="card-glow rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Associação de Bots
              </h3>
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Nenhum bot associado a este randomizador.
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Crie bots primeiro em "Meus Bots" para associá-los aqui.
                </p>
              </div>
            </div>

            <div className="card-glow rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Bots Reserva
              </h3>
              <p className="text-muted-foreground text-sm">
                Bots reserva são ativados automaticamente quando os bots principais estão offline.
              </p>
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            {/* Utmify Section */}
            <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-foreground">Utmify</h3>
                  <p className="text-muted-foreground text-sm">
                    Integração com rastreamento Utmify
                  </p>
                </div>
                <Switch checked={utmifyEnabled} onCheckedChange={setUtmifyEnabled} />
              </div>

              {utmifyEnabled && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>Token da API</Label>
                    <Input
                      placeholder="Seu token Utmify"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      className="input-glow font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Script UTM</Label>
                    <Input
                      placeholder="Cole o script UTM aqui"
                      value={utmScript}
                      onChange={(e) => setUtmScript(e.target.value)}
                      className="input-glow font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Script Pixel</Label>
                    <Input
                      placeholder="Cole o script do pixel aqui"
                      value={pixelScript}
                      onChange={(e) => setPixelScript(e.target.value)}
                      className="input-glow font-mono text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Native Pixels Section */}
            <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <h3 className="font-display font-semibold text-foreground">Pixels Nativos</h3>
                <p className="text-muted-foreground text-sm">
                  Adicione pixels do Meta, Google ou TikTok
                </p>
              </div>

              {/* Existing pixels */}
              {pixels.length > 0 && (
                <div className="space-y-2">
                  {pixels.map((pixel) => (
                    <div
                      key={pixel.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-primary uppercase">
                          {pixel.provider}
                        </span>
                        <span className="text-sm font-mono text-foreground">{pixel.pixel_id}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePixel(pixel.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new pixel */}
              <div className="flex gap-2">
                <Select value={newPixelProvider} onValueChange={setNewPixelProvider}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="ID do Pixel"
                  value={newPixelId}
                  onChange={(e) => setNewPixelId(e.target.value)}
                  className="flex-1 input-glow font-mono"
                />
                <Button variant="outline" onClick={handleAddPixel} disabled={!newPixelId.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="card-glow rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-display font-semibold text-foreground">Configurações Gerais</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Randomizador</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glow"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modo de Distribuição</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Aleatório</SelectItem>
                      <SelectItem value="weighted">Ponderado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <Label>Status Ativo</Label>
                    <p className="text-muted-foreground text-xs">
                      Randomizador recebendo tráfego
                    </p>
                  </div>
                  <Switch checked={active} onCheckedChange={setActive} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed */}
        <div className="fixed bottom-6 right-6 lg:right-12">
          <Button variant="success" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Todas as Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
