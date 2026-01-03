import React, { useState } from 'react';
import { 
  HardHat, User, Lock, ArrowRight, Loader2, Mail, 
  ArrowLeft, CheckCircle, ShieldAlert, Phone, HelpCircle,
  Eye, EyeOff
} from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

type LoginView = 'login' | 'recovery' | 'email-recovery' | 'success' | 'blocked';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<LoginView>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulação de verificação de credenciais
    setTimeout(() => {
      // Verificação das credenciais permitidas
      const isAuthorized = 
        (username === 'filipe.oliveira@inotecfil.pt' && password === '1234567890') ||
        (username === 'admin@inotecfil.com' && password === 'admin123');

      if (isAuthorized) {
        onLogin(username);
        setIsLoading(false);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setIsLoading(false);
        
        if (newAttempts >= 5) {
          setView('blocked');
        } else {
          setError(`Credenciais inválidas. Tentativa ${newAttempts} de 5.`);
        }
      }
    }, 800);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setView('success');
      setIsLoading(false);
      setFailedAttempts(0); // Reseta tentativas ao iniciar recuperação
    }, 1200);
  };

  const handleEmailRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Simula a recuperação mostrando o e-mail em um alerta ou view de sucesso
      setView('success');
      setIsLoading(false);
      setFailedAttempts(0);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-slate-100 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-slate-100 relative">
          
          {/* Header Comum */}
          <div className="p-8 pb-4 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white mb-6 transition-colors duration-500 ${view === 'blocked' ? 'bg-red-500' : 'bg-blue-600'}`}>
              {view === 'blocked' ? <ShieldAlert size={32} /> : <HardHat size={32} />}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inotecfil</h1>
            <p className={`${view === 'blocked' ? 'text-red-600' : 'text-blue-600'} text-sm font-medium uppercase tracking-widest mt-1`}>
              {view === 'blocked' ? 'Acesso Bloqueado' : 'Suporte Técnico'}
            </p>
          </div>

          {/* View: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-8 pt-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 animate-bounce">
                    <ShieldAlert size={14} />
                    {error}
                  </div>
                )}
                
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={20} />
                  </span>
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    placeholder="E-mail"
                  />
                </div>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    placeholder="Senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={22} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setView('recovery')}
                  className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Esqueceu a sua senha?
                </button>
              </div>
            </form>
          )}

          {/* View: BLOCKED (Acesso Negado 5x) */}
          {view === 'blocked' && (
            <div className="p-8 pt-4 text-center space-y-6 animate-in zoom-in duration-300">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800">Muitas tentativas falhas</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Por segurança, bloqueamos o acesso temporário após 5 erros seguidos. Escolha como deseja prosseguir:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setView('recovery')}
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm group-hover:text-blue-600">
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Recuperar Senha</div>
                    <div className="text-xs text-slate-500">Já sei meu e-mail de acesso</div>
                  </div>
                </button>

                <button
                  onClick={() => setView('email-recovery')}
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm group-hover:text-blue-600">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Não me lembro do meu email</div>
                    <div className="text-xs text-slate-500">Recuperar pelo telefone</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => {setView('login'); setFailedAttempts(0);}}
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2 w-full"
              >
                <ArrowLeft size={16} /> Voltar ao Login
              </button>
            </div>
          )}

          {/* View: RECOVERY (Senha) */}
          {view === 'recovery' && (
            <form onSubmit={handleRecoverySubmit} className="p-8 pt-4 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Recuperar Senha</h2>
                <p className="text-sm text-slate-500 mt-2">Informe seu e-mail para receber as instruções.</p>
              </div>

              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={20} />
                </span>
                <input
                  required
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  placeholder="Seu e-mail cadastrado"
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Enviar Instruções <ArrowRight size={22} /></>}
              </button>

              <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm font-medium text-slate-400 hover:text-slate-600">
                Voltar
              </button>
            </form>
          )}

          {/* View: EMAIL RECOVERY */}
          {view === 'email-recovery' && (
            <form onSubmit={handleEmailRecoverySubmit} className="p-8 pt-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Recuperar E-mail</h2>
                <p className="text-sm text-slate-500 mt-2">Informe o celular cadastrado para ver seu e-mail.</p>
              </div>

              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Phone size={20} />
                </span>
                <input
                  required
                  type="tel"
                  value={recoveryPhone}
                  onChange={(e) => setRecoveryPhone(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Validar Identidade <CheckCircle size={22} /></>}
              </button>

              <button type="button" onClick={() => setView('blocked')} className="w-full text-center text-sm font-medium text-slate-400 hover:text-slate-600">
                Voltar
              </button>
            </form>
          )}

          {/* View: SUCCESS */}
          {view === 'success' && (
            <div className="p-8 pt-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Solicitação Enviada!</h2>
                <p className="text-slate-500 mt-3 px-4 leading-relaxed">
                  As informações de acesso foram processadas. {recoveryEmail ? `Verifique o e-mail: ${recoveryEmail}` : 'Um SMS foi enviado com seus dados.'}
                </p>
              </div>

              <button
                onClick={() => setView('login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-200"
              >
                Voltar para o Login
              </button>
            </div>
          )}

        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          &copy; 2024 Inotecfil &bull; Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;