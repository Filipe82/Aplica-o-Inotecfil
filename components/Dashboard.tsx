import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, HardHat } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { STATUS_COLORS } from '../constants';
import { Ticket, TicketStatus } from '../types';

interface DashboardProps {
  tickets: Ticket[];
  setActiveTab: (tab: string) => void;
}

const chartData = [
  { name: 'Seg', tickets: 12 },
  { name: 'Ter', tickets: 19 },
  { name: 'Qua', tickets: 15 },
  { name: 'Qui', tickets: 22 },
  { name: 'Sex', tickets: 30 },
  { name: 'Sáb', tickets: 10 },
];

const Dashboard: React.FC<DashboardProps> = ({ tickets, setActiveTab }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const pendingCount = tickets.filter(t => t.status === TicketStatus.PENDING).length;
  const inProgressCount = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
  const finishedCount = tickets.filter(t => t.status === TicketStatus.FINISHED).length;
  const readyCount = tickets.filter(t => t.status === TicketStatus.READY).length;

  const stats = [
    { label: 'Total de OS', value: tickets.length, change: '+12%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Em Manutenção', value: inProgressCount, change: '+5%', icon: HardHat, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Prontas p/ Retirada', value: readyCount, change: '+2%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pendentes', value: pendingCount, change: '-4%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const recentTickets = tickets.slice(0, 4);

  const handleGenerateReport = async () => {
    if (tickets.length === 0) {
      alert("Não existem dados de ordens de serviço para gerar um relatório. Por favor, carregue dados de exemplo nas Configurações ou crie uma nova OS.");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Pequena pausa para o utilizador perceber a ação
      await new Promise(resolve => setTimeout(resolve, 500));

      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-PT');
      const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

      // Cabeçalho azul corporativo
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('INOTECFIL', 15, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SOLUÇÕES EM ASSISTÊNCIA TÉCNICA E SUPORTE', 15, 28);
      doc.text(`RELATÓRIO OPERACIONAL - EMITIDO EM ${dateStr} às ${timeStr}`, 15, 33);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo de Produtividade', 15, 55);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 58, 195, 58);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const startY = 68;
      doc.text(`Total de Ordens Registadas: ${tickets.length}`, 20, startY);
      doc.text(`Serviços em Aberto: ${pendingCount}`, 20, startY + 7);
      doc.text(`Em Manutenção: ${inProgressCount}`, 20, startY + 14);
      
      doc.text(`Aguardando Retirada: ${readyCount}`, 110, startY);
      doc.text(`Ordens Finalizadas: ${finishedCount}`, 110, startY + 7);
      doc.text(`Eficiência Global: ${tickets.length > 0 ? Math.round((finishedCount / tickets.length) * 100) : 0}%`, 110, startY + 14);

      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Listagem Completa de Ordens de Serviço', 15, 100);

      const tableData = tickets.map(t => [
        t.id,
        t.customerName || 'N/A',
        `${t.deviceBrand || ''} ${t.deviceModel || ''}`.trim() || 'Equipamento N/D',
        t.technicianName || 'Sem Atribuição',
        t.status || 'Pendente',
        new Date(t.createdAt).toLocaleDateString('pt-PT')
      ]);

      // Execução do autoTable de forma isolada para evitar conflitos de plugin
      autoTable(doc, {
        startY: 105,
        head: [['ID', 'Cliente', 'Equipamento', 'Técnico', 'Status', 'Entrada']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [37, 99, 235], 
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 8,
          textColor: [51, 65, 85],
          cellPadding: 3
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Sistema Inotecfil - Página ${data.pageNumber}`,
            105,
            pageHeight - 10,
            { align: 'center' }
          );
        }
      });

      doc.save(`Relatorio_Inotecfil_${now.toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao processar o PDF. Verifique se existem dados no sistema.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Menu Inicial</h1>
          <p className="text-slate-500">Visão geral da operação técnica</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating || tickets.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 min-w-[220px]"
        >
          {isGenerating ? "A preparar ficheiro..." : "Gerar Relatório PDF"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md hover:border-blue-100 group">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{stat.value}</h3>
              <span className={`text-xs font-medium mt-2 block ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} vs mês anterior
              </span>
            </div>
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Movimento de Serviços
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  itemStyle={{color: '#2563eb', fontWeight: 'bold'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Entradas Recentes
          </h3>
          <div className="space-y-4">
            {recentTickets.length > 0 ? (
              recentTickets.map(ticket => (
                <div key={ticket.id} className="p-5 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">{ticket.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm ${STATUS_COLORS[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                    {ticket.deviceBrand} {ticket.deviceModel}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{ticket.customerName}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <AlertCircle size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhuma OS em destaque.</p>
              </div>
            )}
            <button 
              onClick={() => setActiveTab('tickets')}
              className="w-full py-4 mt-2 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-2xl transition-all"
            >
              Consultar Histórico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;