import React, { useState } from 'react';
import { 
  UserRoundCog, MapPin, ClipboardList, ArrowLeft, 
  ChevronRight, Clock, Plus, User, 
  Smartphone, Tag, Calendar, X, FileText, Trash2, Phone, Mail
} from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { Technician, Ticket, TicketStatus, Priority } from '../types';

interface TechniciansProps {
  tickets: Ticket[];
  technicians: Technician[];
  onAddTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onDeleteTechnician: (id: string) => void;
}

const Technicians: React.FC<TechniciansProps> = ({ 
  tickets, 
  technicians, 
  onAddTicket, 
  onDeleteTicket,
  onDeleteTechnician 
}) => {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    deviceModel: '',
    problemDescription: '',
    priority: Priority.MEDIUM,
    createdAt: new Date().toISOString().split('T')[0]
  });

  const getTechOrders = (techId: string) => {
    return tickets.filter(t => t.technicianId === techId);
  };

  const getActiveCount = (techId: string) => {
    return tickets.filter(t => 
      t.technicianId === techId && 
      t.status !== TicketStatus.FINISHED && 
      t.status !== TicketStatus.CANCELLED
    ).length;
  };

  const handleCreateQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTech) return;

    const newTicket: Ticket = {
      id: `OS-${Math.floor(Math.random() * 900) + 100}`,
      customerId: 'NEW',
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      technicianId: selectedTech.id,
      technicianName: selectedTech.name,
      deviceType: 'Manutenção Geral', 
      deviceBrand: 'Padrão',
      deviceModel: formData.deviceModel,
      problemDescription: formData.problemDescription || 'Sem descrição detalhada.',
      status: TicketStatus.PENDING,
      priority: formData.priority,
      createdAt: new Date(formData.createdAt).toISOString(),
    };

    onAddTicket(newTicket);
    setIsAddModalOpen(false);
    setFormData({
      customerName: '',
      customerAddress: '',
      customerPhone: '',
      customerEmail: '',
      deviceModel: '',
      problemDescription: '',
      priority: Priority.MEDIUM,
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  if (selectedTech) {
    const techOrders = getTechOrders(selectedTech.id);

    return (
      <div className="animate-in slide-in-from-left-4 duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTech(null)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Ordem de Serviço: {selectedTech.name}</h2>
              <p className="text-sm text-slate-500">Trabalhos para {selectedTech.role}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Nova Ordem de Serviço</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {techOrders.length > 0 ? (
            techOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all group animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-600">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800">{order.deviceBrand} {order.deviceModel}</h4>
                    <p className="text-xs text-slate-500">Cliente: <span className="font-medium text-slate-700">{order.customerName}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-6 px-4 md:border-x border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Prioridade</span>
                    <span className="text-sm font-medium text-slate-700">{order.priority}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Criada em</span>
                    <span className="text-sm font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onDeleteTicket(order.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Apagar Ordem de Serviço"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                    Ver Detalhes
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Clock size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Nenhuma Ordem Atribuída</h3>
              <p className="text-slate-500">Este técnico não tem ordens de serviço no momento.</p>
            </div>
          )}
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 border border-slate-100 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[95vh]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2.5 rounded-2xl text-blue-600">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Nova OS</h3>
                    <p className="text-xs text-slate-500">Atribuindo a {selectedTech.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateQuickOrder} className="space-y-4 text-slate-700">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <User size={14} className="text-blue-500" /> Cliente
                  </label>
                  <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="Nome do cliente" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Phone size={14} className="text-blue-500" /> Telefone
                    </label>
                    <input required type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} placeholder="Telemóvel" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Mail size={14} className="text-blue-500" /> E-mail
                    </label>
                    <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} placeholder="E-mail" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <MapPin size={14} className="text-blue-500" /> Endereço
                  </label>
                  <input required type="text" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} placeholder="Morada do cliente" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <Smartphone size={14} className="text-blue-500" /> Modelo / Equipamento
                  </label>
                  <input required type="text" value={formData.deviceModel} onChange={e => setFormData({...formData, deviceModel: e.target.value})} placeholder="Ex: Inversor 5kW" className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <FileText size={14} className="text-blue-500" /> Descrição do Serviço
                  </label>
                  <textarea required rows={3} value={formData.problemDescription} onChange={e => setFormData({...formData, problemDescription: e.target.value})} placeholder="Descreva o serviço..." className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none transition-all font-medium resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Tag size={14} className="text-blue-500" /> Prioridade
                    </label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Priority})} className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none font-medium">
                      <option value={Priority.LOW}>{Priority.LOW}</option>
                      <option value={Priority.MEDIUM}>{Priority.MEDIUM}</option>
                      <option value={Priority.HIGH}>{Priority.HIGH}</option>
                      <option value={Priority.URGENT}>{Priority.URGENT}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                      <Calendar size={14} className="text-blue-500" /> Data
                    </label>
                    <input required type="date" value={formData.createdAt} onChange={e => setFormData({...formData, createdAt: e.target.value})} className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none font-medium" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] mt-2">Criar Ordem</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 text-center animate-in fade-in">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-100 p-4 rounded-3xl text-blue-600 mb-4">
          <UserRoundCog size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Equipa de Técnicos</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">Monitorize a produtividade e atribua novas tarefas aos seus técnicos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {technicians.map((tech) => {
           const activeCount = getActiveCount(tech.id);
           
           return (
             <div key={tech.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-left hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <UserRoundCog size={28} />
                  </div>
                  <button 
                    onClick={() => onDeleteTechnician(tech.id)}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Remover Técnico"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="relative z-10">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{tech.name}</h4>
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1 mb-4">{tech.role}</p>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="font-medium">{tech.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <ClipboardList size={14} />
                      <span className="font-bold">{activeCount} Ativas</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTech(tech)}
                    className="w-full py-3 rounded-2xl border-2 border-blue-50 text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                  >
                    Ver Perfil e Ordens
                  </button>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default Technicians;