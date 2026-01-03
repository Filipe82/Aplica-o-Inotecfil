import React from 'react';
import { 
  ClipboardList, 
  Users, 
  Settings, 
  Bell, 
  Search,
  HardHat,
  ChevronRight,
  LogOut,
  UserRoundCog,
  LayoutDashboard
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'tickets', icon: ClipboardList, label: 'Ordem de Serviço' },
    { id: 'customers', icon: Users, label: 'Clientes' },
    { id: 'technicians', icon: UserRoundCog, label: 'Técnicos' },
  ];

  const activeLabel = menuItems.find(item => item.id === activeTab)?.label || 
                    (activeTab === 'settings' ? 'Configurações' : '');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-sm z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <HardHat size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-800 tracking-tight leading-none">Inotecfil</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-wider">Suporte Técnico</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 space-y-1">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'settings' 
              ? 'bg-blue-50 text-blue-700 font-medium' 
              : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} className="rotate-180" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 hidden lg:block mr-4">
              {activeLabel}
            </h2>
            <div className="relative w-64 lg:w-96 max-w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Procurar Ordem de serviço..." 
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-full transition-all">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                IN
              </div>
              <div className="flex flex-col items-start leading-none hidden sm:flex">
                <span className="text-sm font-bold text-slate-700">Filipe Oliveira</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;