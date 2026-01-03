import React, { useState, useRef } from 'react';
import { 
  Plus, Search, Filter, Sparkles, AlertCircle, 
  Smartphone, Tag, ChevronDown, CheckCircle2, Loader2,
  Trash2, Edit, User, MapPin, Phone, Mail, Image as ImageIcon, X,
  CheckCircle, XCircle, FileText, UserRoundCog
} from 'lucide-react';
import { MOCK_TECHNICIANS, STATUS_COLORS } from '../constants';
import { Ticket, TicketStatus, Priority } from '../types';
import { getAIDiagnosis } from '../services/geminiService';

interface TicketsProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
}

const Tickets: React.FC<TicketsProps> = ({ tickets, onAddTicket, onDeleteTicket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    problemDescription: '',
    priority: Priority.MEDIUM,
    technicianId: '',
    photos: [] as string[],
    isSolved: 'Não', 
    solvedDescription: '',
    resolutionDescription: ''
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const isSolvedBool = formData.isSolved === 'Sim';
    const selectedTech = MOCK_TECHNICIANS.find(t => t.id === formData.technicianId);
    
    const newTicket: Ticket = {
      id: `OS-${Math.floor(Math.random() * 9000) + 1000}`,
      customerId: 'NEW',
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      deviceType: formData.deviceType || 'Manutenção',
      deviceBrand: formData.deviceBrand || 'Padrão',
      deviceModel: formData.deviceModel,
      problemDescription: formData.problemDescription,
      technicianId: formData.technicianId,
      technicianName: selectedTech?.name || 'Não Atribuído',
      status: isSolvedBool ? TicketStatus.FINISHED : TicketStatus.PENDING,
      priority: formData.priority,
      createdAt: new Date().toISOString(),
      photos: formData.photos,
      isSolved: isSolvedBool,
      solvedDescription: !isSolvedBool ? formData.solvedDescription : '',
      resolutionDescription: isSolvedBool ? formData.resolutionDescription : ''
    };
    
    onAddTicket(newTicket);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerAddress: '',
      customerPhone: '',
      customerEmail: '',
      deviceType: '',
      deviceBrand: '',
      deviceModel: '',
      problemDescription: '',
      priority: Priority.MEDIUM,
      technicianId: '',
      photos: [],
      isSolved: 'Não',
      solvedDescription: '',
      resolutionDescription: ''
    });
    setAiResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleGetAIDiagnosis = async () => {
    if (!formData.deviceBrand || !formData.problemDescription) {
      alert("Por favor, preencha a marca do equipamento e a descrição do problema para a IA diagnosticar.");
      return;
    }
    setIsDiagnosisLoading(true);
    const result = await getAIDiagnosis(
      formData.deviceType, 
      formData.deviceBrand, 
      formData.deviceModel, 
      formData.problemDescription
    );
    setAiResult(result);
    setIsDiagnosisLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ordem de Serviço</h1>
          <p className="text-slate-500">Gerencie todos os reparos em um só lugar.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          <span>Nova Ordem de Serviço</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Procurar por cliente" 
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={18} />
          Filtrar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">EQUIPAMENTO</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Técnico</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all group animate-in fade-in">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-blue-600">{ticket.id}</span>
                      <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                        {ticket.customerName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{ticket.customerName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700 font-medium">{ticket.deviceBrand} {ticket.deviceModel}</span>
                      <span className="text-xs text-slate-500">{ticket.deviceType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{ticket.technicianName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border w-fit ${STATUS_COLORS[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onDeleteTicket(ticket.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 animate-in zoom-in-95 duration-200 border border-slate-100 text-slate-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-2xl text-blue-600">
                  <Plus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Nova Ordem de Serviço</h2>
                  <p className="text-sm text-slate-500">Registe os detalhes do cliente e do equipamento.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-8">
              {/* Seção Cliente */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                  <User size={16} /> Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      Nome do Cliente
                    </label>
                    <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="Ex: João Silva" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Phone size={14} className="text-blue-500" /> Número Telefone
                    </label>
                    <input required type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="+351 9xx xxx xxx" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <MapPin size={14} className="text-blue-500" /> Endereço Cliente
                    </label>
                    <input required type="text" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="Rua, Número, Freguesia, Concelho" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Mail size={14} className="text-blue-500" /> E-mail
                    </label>
                    <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="exemplo@email.com" />
                  </div>
                </div>
              </div>

              {/* Seção Equipamento */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                  <Smartphone size={16} /> Detalhes do Serviço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Marca / Tipo</label>
                    <input required type="text" value={formData.deviceBrand} onChange={e => setFormData({...formData, deviceBrand: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="Ex: Huawei / Fotovoltaico" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Modelo</label>
                    <input required type="text" value={formData.deviceModel} onChange={e => setFormData({...formData, deviceModel: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" placeholder="Ex: SUN2000" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Descrição do Problema / Serviço</label>
                    <textarea required rows={4} value={formData.problemDescription} onChange={e => setFormData({...formData, problemDescription: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium resize-none" placeholder="Descreva detalhadamente o que precisa ser feito..." />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  Salvar Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;