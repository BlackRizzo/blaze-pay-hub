import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Download, Filter, Search, BarChart3 } from 'lucide-react';

// Mock data
const mockReports = [
  {
    id: '1',
    date: '2024-01-15',
    bot: 'Bot Principal',
    visits: 1250,
    conversions: 45,
    revenue: 'R$ 4.500,00',
    rate: '3.6%',
  },
  {
    id: '2',
    date: '2024-01-14',
    bot: 'Bot Secundário',
    visits: 890,
    conversions: 28,
    revenue: 'R$ 2.800,00',
    rate: '3.1%',
  },
  {
    id: '3',
    date: '2024-01-13',
    bot: 'Bot Promo',
    visits: 2100,
    conversions: 89,
    revenue: 'R$ 8.900,00',
    rate: '4.2%',
  },
];

export default function Reports() {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedBot, setSelectedBot] = useState('all');

  const handleExport = () => {
    // Generate CSV
    const headers = ['Data', 'Bot', 'Visitas', 'Conversões', 'Receita', 'Taxa'];
    const rows = mockReports.map((r) => [
      r.date,
      r.bot,
      r.visits,
      r.conversions,
      r.revenue,
      r.rate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'relatorio-flexionpay.csv';
    link.click();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Analise o desempenho de suas campanhas
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="card-glow rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Data Início
              </Label>
              <Input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="input-glow"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Data Fim
              </Label>
              <Input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="input-glow"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                Bot
              </Label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os bots" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os bots</SelectItem>
                  <SelectItem value="principal">Bot Principal</SelectItem>
                  <SelectItem value="secundario">Bot Secundário</SelectItem>
                  <SelectItem value="promo">Bot Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="hero" className="gap-2">
                <Search className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-glow rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Data</TableHead>
                  <TableHead className="text-muted-foreground">Bot</TableHead>
                  <TableHead className="text-muted-foreground text-right">Visitas</TableHead>
                  <TableHead className="text-muted-foreground text-right">Conversões</TableHead>
                  <TableHead className="text-muted-foreground text-right">Receita</TableHead>
                  <TableHead className="text-muted-foreground text-right">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id} className="border-border">
                    <TableCell className="font-medium">
                      {new Date(report.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{report.bot}</TableCell>
                    <TableCell className="text-right">{report.visits.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{report.conversions}</TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {report.revenue}
                    </TableCell>
                    <TableCell className="text-right">{report.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mockReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum dado para o período selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
