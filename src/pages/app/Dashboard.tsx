import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CardKPI } from '@/components/shared/CardKPI';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for the chart
const chartData = [
  { hour: '00h', visitors: 12 },
  { hour: '02h', visitors: 8 },
  { hour: '04h', visitors: 5 },
  { hour: '06h', visitors: 15 },
  { hour: '08h', visitors: 45 },
  { hour: '10h', visitors: 78 },
  { hour: '12h', visitors: 95 },
  { hour: '14h', visitors: 88 },
  { hour: '16h', visitors: 102 },
  { hour: '18h', visitors: 115 },
  { hour: '20h', visitors: 85 },
  { hour: '22h', visitors: 42 },
];

const kpiData = {
  totalSales: 'R$ 0,00',
  yearSales: 'R$ 0,00',
  monthSales: 'R$ 0,00',
  daySales: 'R$ 0,00',
  totalUsers: '0',
  yearUsers: '0',
  monthUsers: '0',
  dayUsers: '0',
};

export default function Dashboard() {
  const [period, setPeriod] = useState('today');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Visão Geral
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Acompanhe suas métricas em tempo real
          </p>
        </div>

        {/* KPIs - Sales */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Vendas
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardKPI
              title="Total Vendas"
              value={kpiData.totalSales}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <CardKPI
              title="Vendas no Ano"
              value={kpiData.yearSales}
              icon={<Calendar className="h-5 w-5" />}
            />
            <CardKPI
              title="Vendas no Mês"
              value={kpiData.monthSales}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <CardKPI
              title="Vendas Hoje"
              value={kpiData.daySales}
              icon={<DollarSign className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* KPIs - Users */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Usuários
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardKPI
              title="Total Usuários"
              value={kpiData.totalUsers}
              icon={<Users className="h-5 w-5" />}
            />
            <CardKPI
              title="Usuários no Ano"
              value={kpiData.yearUsers}
              icon={<Calendar className="h-5 w-5" />}
            />
            <CardKPI
              title="Usuários no Mês"
              value={kpiData.monthUsers}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <CardKPI
              title="Usuários Hoje"
              value={kpiData.dayUsers}
              icon={<Users className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Chart Section */}
        <div className="card-glow rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-display font-semibold text-foreground">
              Usuários por Horário
            </h2>
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="today" className="text-xs">Hoje</TabsTrigger>
                <TabsTrigger value="yesterday" className="text-xs">Ontem</TabsTrigger>
                <TabsTrigger value="week" className="text-xs">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 18%)" />
                <XAxis
                  dataKey="hour"
                  stroke="hsl(220, 13%, 60%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(220, 13%, 60%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 17%, 8%)',
                    border: '1px solid hsl(220, 13%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(220, 13%, 91%)',
                  }}
                  labelStyle={{ color: 'hsl(220, 13%, 60%)' }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(24, 100%, 50%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
