import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Eye, EyeOff, Key, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentConfig {
  id: string;
  user_id: string;
  pixgo_api_key: string;
  is_configured: boolean;
  created_at: string;
  updated_at: string;
}

export default function PaymentSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingConfig();
    }
  }, [user]);

  const checkExistingConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_configs')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data && !error) {
        setApiKey(data.pixgo_api_key || '');
        setIsConfigured(data.is_configured);
      }
    } catch (err) {
      // No config exists yet
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua API Key do PixGo.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('payment_configs')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (existing) {
        await supabase
          .from('payment_configs')
          .update({
            pixgo_api_key: apiKey,
            is_configured: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('payment_configs')
          .insert({
            user_id: user?.id,
            pixgo_api_key: apiKey,
            is_configured: true
          });
      }

      setIsConfigured(true);
      toast({
        title: "Sucesso!",
        description: "Sua API Key do PixGo foi salva com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a API Key. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Pagamento</h1>
          <p className="text-muted-foreground mt-1">
            Configure sua integração com o PixGo para receber pagamentos via Pix
          </p>
        </div>

        {/* Status Card */}
        <Card className={cn(
          "border transition-all duration-300",
          isConfigured 
            ? "border-green-500/30 bg-green-500/5" 
            : "border-yellow-500/30 bg-yellow-500/5"
        )}>
          <CardContent className="flex items-center gap-4 p-4">
            {isConfigured ? (
              <>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">PixGo Configurado</h3>
                  <p className="text-sm text-muted-foreground">
                    Sua integração está ativa e pronta para receber pagamentos
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Configuração Pendente</h3>
                  <p className="text-sm text-muted-foreground">
                    Insira sua API Key do PixGo para ativar os pagamentos
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* API Key Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>API Key do PixGo</CardTitle>
                <CardDescription>
                  Sua chave de acesso para a API do PixGo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  placeholder="Insira sua API Key do PixGo"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sua API Key é armazenada de forma segura e criptografada
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={loading || checking}
              className="w-full sm:w-auto"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar API Key"}
            </Button>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>
                  Como protegemos seus dados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Sua API Key é criptografada antes de ser armazenada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Apenas você tem acesso às suas credenciais</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Conexões são feitas via HTTPS com TLS 1.3</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Integramos exclusivamente com o PixGo para máxima segurança</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* How to get API Key */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Como obter sua API Key?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
              <li>Acesse o painel do PixGo em <span className="text-primary">pixgo.com.br</span></li>
              <li>Navegue até Configurações → API</li>
              <li>Clique em "Gerar Nova Chave"</li>
              <li>Copie a chave gerada e cole no campo acima</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
