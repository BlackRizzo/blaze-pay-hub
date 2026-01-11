import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { 
  Zap, 
  BarChart3, 
  Bot, 
  Shuffle, 
  Shield, 
  Target, 
  Users,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Zap,
    title: 'Pagamentos Instantâneos',
    description: 'Processe pagamentos em tempo real com taxas competitivas e sem burocracia.'
  },
  {
    icon: Bot,
    title: 'Bots Inteligentes',
    description: 'Automatize suas vendas com bots configuráveis que trabalham 24/7 para você.'
  },
  {
    icon: Shuffle,
    title: 'Randomizadores',
    description: 'Distribua tráfego de forma inteligente entre múltiplos bots e ofertas.'
  },
  {
    icon: BarChart3,
    title: 'Relatórios Detalhados',
    description: 'Acompanhe métricas em tempo real com dashboards interativos e completos.'
  },
  {
    icon: Target,
    title: 'Rastreamento UTM & Pixels',
    description: 'Integre com Meta, Google e TikTok Ads para rastrear conversões com precisão.'
  },
  {
    icon: Shield,
    title: 'Cloaker Nativo',
    description: 'Proteção avançada para suas campanhas com sistema de cloaking integrado.'
  }
];

const steps = [
  {
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se em menos de 2 minutos e comece a configurar sua operação.'
  },
  {
    number: '02',
    title: 'Configure seus bots',
    description: 'Adicione seus bots, configure randomizadores e integre seus pixels.'
  },
  {
    number: '03',
    title: 'Comece a vender',
    description: 'Lance suas campanhas e acompanhe os resultados em tempo real.'
  }
];

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Infoprodutor',
    content: 'O FlexionPay revolucionou minha operação. Os randomizadores são incríveis e o suporte é excepcional.',
    avatar: 'CS'
  },
  {
    name: 'Ana Martins',
    role: 'Afiliada Digital',
    content: 'Finalmente uma plataforma que entende o que precisamos. O rastreamento de pixels é perfeito!',
    avatar: 'AM'
  },
  {
    name: 'Ricardo Oliveira',
    role: 'Gestor de Tráfego',
    content: 'A melhor ferramenta para gestão de múltiplos bots. O dashboard é completo e intuitivo.',
    avatar: 'RO'
  }
];

const faqs = [
  {
    question: 'Como funciona o sistema de randomizadores?',
    answer: 'Os randomizadores distribuem o tráfego entre diferentes bots de forma aleatória ou ponderada, permitindo testes A/B e otimização de conversões.'
  },
  {
    question: 'Quais gateways de pagamento são suportados?',
    answer: 'Integramos com os principais gateways do mercado, incluindo soluções próprias de checkout otimizado para alta conversão.'
  },
  {
    question: 'O sistema de cloaker é seguro?',
    answer: 'Sim, nosso cloaker nativo utiliza tecnologia avançada para proteger suas campanhas mantendo total conformidade com as políticas.'
  },
  {
    question: 'Posso integrar pixels de múltiplas plataformas?',
    answer: 'Absolutamente! Suportamos Meta (Facebook), Google Ads, TikTok e outras plataformas de forma nativa.'
  }
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </a>
              <a href="#depoimentos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Entrar</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth/register">Criar conta</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#recursos" className="block text-foreground py-2">Recursos</a>
              <a href="#como-funciona" className="block text-foreground py-2">Como Funciona</a>
              <a href="#depoimentos" className="block text-foreground py-2">Depoimentos</a>
              <a href="#faq" className="block text-foreground py-2">FAQ</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth/login">Entrar</Link>
                </Button>
                <Button variant="hero" asChild className="w-full">
                  <Link to="/auth/register">Criar conta</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-glow pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6 animate-fade-in">
              <Zap className="h-4 w-4" />
              Plataforma #1 em pagamentos digitais
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 animate-slide-up">
              A revolução em{' '}
              <span className="text-gradient">pagamentos</span>{' '}
              e automação
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Gerencie bots, randomize tráfego, rastreie conversões e maximize seus lucros 
              com a plataforma mais completa do mercado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth/register">
                  Começar agora
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/auth/login">
                  Já tenho conta
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient">R$ 50M+</p>
                <p className="text-sm text-muted-foreground mt-1">Processados</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient">10K+</p>
                <p className="text-sm text-muted-foreground mt-1">Usuários ativos</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-bold text-gradient">99.9%</p>
                <p className="text-sm text-muted-foreground mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Tudo que você precisa em <span className="text-gradient">um só lugar</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recursos poderosos para escalar sua operação digital com segurança e eficiência.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-glow p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="como-funciona" className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Comece em <span className="text-gradient">3 passos simples</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sem complicação, sem burocracia. Configure sua operação em minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-primary text-primary-foreground font-display font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              O que nossos <span className="text-gradient">clientes dizem</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Milhares de profissionais confiam no FlexionPay para suas operações.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Perguntas <span className="text-gradient">frequentes</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <ChevronRight
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Pronto para <span className="text-gradient">revolucionar</span> suas vendas?
            </h2>
            <p className="text-muted-foreground mb-8">
              Junte-se a milhares de profissionais que já estão escalando com o FlexionPay.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth/register">
                Criar minha conta grátis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 FlexionPay. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
