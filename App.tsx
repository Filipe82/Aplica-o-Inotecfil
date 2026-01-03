import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Tickets from './components/Tickets';
import Technicians from './components/Technicians';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { MOCK_TICKETS, MOCK_TECHNICIANS, STATUS_COLORS } from './constants';
import { Ticket, Customer, Technician } from './types';
import { 
  User, Mail, Phone, MapPin, ClipboardList, 
  ChevronRight, Trash2, ArrowLeft, Clock, 
  CheckCircle2, AlertCircle, Smartphone, AlertTriangle,
  RefreshCcw, Database, Loader2, Sparkles, UserX,
  Info, ShieldCheck, AlertCircle as AlertIcon, Lock, HardHat
} from 'lucide-react';

const Customers: React.FC<{ 
  tickets: Ticket[], 
  onDeleteCustomer: (name: string) => void,
  onDeleteAllCustomers: () => void 
}> = ({ tickets, onDeleteCustomer, onDeleteAllCustomers }) => {
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);

  const customers = useMemo(() => {
    const customerMap = new Map<string, { name: string; count: number }>();
    
    tickets.forEach(ticket => {
      const existing = customerMap.get(ticket.customerName);
      if (existing) {
        existing.count += 1;
      } else {
        customerMap.set(ticket.customerName, { name: ticket.customerName, count: 1 });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tickets]);

  const handleDeleteIndividual = (name: string) => {
    const count = tickets.filter(t => t.customerName === name).length;
    if(window.confirm(`ATENÇÃO: Deseja realmente apagar o cliente "${name}"?\n\nIsso removerá permanentemente este cliente e TODAS as ${count} ordens de serviço associadas.`)) {
      onDeleteCustomer(name);
      if (selectedCustomerName === name) {
        setSelectedCustomerName(null);
      }
    }
  };

  if (selectedCustomerName) {
    const customerTickets = tickets.filter(t => t.customerName === selectedCustomerName);
    const completedCount = customerTickets.filter(t => t.status === 'Finalizado').length;

    return (
      <div className="p-4 md:p-8 animate-in slide-in-from-left-4 duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCustomerName(null)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Histórico: {selectedCustomerName}</h2>
              <p className="text-sm text-slate-500">Relatório detalhado do cliente.</p>
            </div>
          </div>
          
          <button 
            onClick={() => handleDeleteIndividual(selectedCustomerName)}
            className="flex items-center gap-2 px-5 py-2.5 text-red-600 border border-red-100 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl font-bold transition-all text-sm active:scale-95 shadow-sm"
          >
            <Trash2 size={18} />
            Apagar Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total de Ordens</p>
              <p className="text-xl font-bold text-slate-800">{customerTickets.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Finalizadas</p>
              <p className="text-xl font-bold text-slate-800">{completedCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Em Aberto</p>
              <p className="text-xl font-bold text-slate-800">{customerTickets.length - completedCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {customerTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ticket.status === 'Finalizado' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-blue-600">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">{ticket.deviceBrand} {ticket.deviceModel}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{ticket.problemDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-4 md:border-x border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Técnico</span>
                  <span className="text-sm font-medium text-slate-700">{ticket.technicianName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Data</span>
                  <span className="text-sm font-medium text-slate-700">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                Ver OS
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Base de Clientes</h2>
          <p className="text-slate-500 mt-2">Gerencie os perfis e históricos de atendimento.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
        {customers.map((customer, index) => (
          <div key={index} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col min-h-[320px] animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="pr-12">
                <h4 className="font-bold text-slate-800 text-lg leading-tight truncate max-w-[140px]">{customer.name}</h4>
                <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                  {customer.count} {customer.count === 1 ? 'Ordem' : 'Ordens'}
                </div>
              </div>
            </div>
            <div className="space-y-4 relative z-10 mb-8">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="truncate font-medium">contato@inotecfil.pt</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Phone size={16} />
                </div>
                <span className="font-medium">+351 9xx xxx xxx</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCustomerName(customer.name)}
              className="w-full mt-auto py-4 rounded-[1.5rem] bg-slate-50 text-slate-600 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-inner active:scale-[0.98]"
            >
              Ver Histórico Completo
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="bg-white p-12 md:p-20 rounded-[3.5rem] border border-dashed border-slate-200 text-center animate-in zoom-in-95 duration-700 shadow-inner bg-slate-50/30">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-lg shadow-slate-200/50 flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Sparkles size={48} className="text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sem Clientes</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-3 text-lg leading-relaxed">
            Nenhum cliente cadastrado. Novos clientes aparecerão aqui assim que o administrador criar uma Ordem de Serviço.
          </p>
        </div>
      )}
    </div>
  );
};

const Settings: React.FC<{ onDeleteApp: () => void, isAdmin: boolean }> = ({ onDeleteApp, isAdmin }) => (
  <div className="p-8 space-y-8 animate-in fade-in max-w-2xl mx-auto">
    {/* Card Sobre a Aplicação */}
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <Info size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sobre Aplicação</h2>
          <p className="text-sm text-slate-400">Informações técnicas e legais</p>
        </div>
      </div>

      <div className="space-y-6 text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nome</span>
            <p className="text-sm font-bold text-slate-800">Inotecfil - Climatização e Energias Renováveis</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Versão</span>
            <p className="text-sm font-bold text-slate-800">01</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Desenvolvido Por</span>
            <p className="text-sm font-bold text-slate-800">Filipe Oliveira</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-50">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Informações Gerais</span>
          <p className="text-sm leading-relaxed text-slate-600">
            Esta aplicação foi desenvolvida para gerenciar assistência técnica dos clientes da empresa de forma eficiente e segura, permitindo o cadastro de clientes, tipo de assistência técnica e acompanhamento de serviço.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3 mt-4 border border-blue-100/50">
          <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
            <span className="font-bold block mb-1">Privacidade & Segurança</span>
            Todos os dados são armazenados localmente no dispositivo próprio, garantindo segurança e privacidade.
          </p>
        </div>
      </div>
    </div>

    {/* Card Dados (Excluir Aplicação) - Apenas para Administradores */}
    {isAdmin ? (
      <div className="bg-white p-10 rounded-[2.5rem] border border-red-50 shadow-xl shadow-red-500/5 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Database size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dados</h2>
            <p className="text-sm text-slate-400">Gestão de armazenamento local</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-3">
            <AlertIcon size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-red-700 leading-relaxed">
              <span className="font-bold block mb-1">Aviso de Administrador</span>
              Esta funcionalidade é restrita. Ao excluir a aplicação, todos os dados locais serão apagados permanentemente e você será desconectado.
            </p>
          </div>

          <button 
            onClick={() => {
              if(window.confirm('TEM CERTEZA? Esta ação apagará TODOS os dados salvos localmente e não pode ser desfeita.')) {
                onDeleteApp();
              }
            }}
            className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Excluir aplicação
          </button>
        </div>
      </div>
    ) : (
      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 text-center">
        <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock size={20} />
        </div>
        <p className="text-xs font-medium text-slate-500">Algumas configurações de gestão de dados estão restritas ao Administrador.</p>
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);

  // Verificação de administrador baseada no email logado
  const isAdmin = useMemo(() => {
    return currentUserEmail === 'filipe.oliveira@inotecfil.pt' || currentUserEmail === 'admin@inotecfil.com';
  }, [currentUserEmail]);

  const handleLogin = (username: string) => {
    setCurrentUserEmail(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    setActiveTab('dashboard');
  };

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteCustomer = (customerName: string) => {
    setTickets(prev => prev.filter(t => t.customerName !== customerName));
  };

  const handleDeleteAllCustomers = () => {
    setTickets([]);
  };

  const handleDeleteTechnician = (id: string) => {
    if (window.confirm('Tem a certeza que deseja remover este técnico?')) {
      setTechnicians(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDeleteApplication = () => {
    // Apenas executável se for admin (proteção extra no código)
    if (!isAdmin) return;
    
    setTickets([]);
    setTechnicians(MOCK_TECHNICIANS);
    handleLogout();
    alert("Aplicação resetada. Todos os dados locais foram removidos.");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tickets={tickets} setActiveTab={setActiveTab} />;
      case 'tickets':
        return <Tickets tickets={tickets} onAddTicket={handleAddTicket} onDeleteTicket={handleDeleteTicket} />;
      case 'customers':
        return (
          <Customers 
            tickets={tickets} 
            onDeleteCustomer={handleDeleteCustomer} 
            onDeleteAllCustomers={handleDeleteAllCustomers}
          />
        );
      case 'technicians':
        return (
          <Technicians 
            tickets={tickets} 
            technicians={technicians}
            onAddTicket={handleAddTicket} 
            onDeleteTicket={handleDeleteTicket} 
            onDeleteTechnician={handleDeleteTechnician}
          />
        );
      case 'settings':
        return <Settings onDeleteApp={handleDeleteApplication} isAdmin={isAdmin} />;
      default:
        return <Dashboard tickets={tickets} setActiveTab={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;