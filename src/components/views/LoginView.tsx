import { useState, useEffect, type FormEvent } from 'react';
import { 
  Coffee, 
  Lock, 
  Mail, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import cafeLogo from '../../assets/cafe-logo-all.jpg';

export const LoginView = () => {
  const { login, loginAsDemo, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-DO', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Autofill form when selecting a demo role
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_ACCOUNTS[role];
    setEmail(demo.email);
    setPassword(demo.passwordHint);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage('Por favor ingresa tu correo electrónico corporativo.');
      return;
    }

    const result = await login(email, password);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleInstantDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
  };

  const getShiftName = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Turno Matutino (Barra & Desayunos)';
    if (hour < 18) return 'Turno Tarde (Café Especial & Pastelería)';
    return 'Turno Vespertino / Cierre';
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C3E35] flex flex-col justify-between selection:bg-[#C8963E]/20 selection:text-[#0F281E] relative overflow-hidden font-sans">
      
      {/* Background Decorative Ambient Elements */}
      <div 
        aria-hidden="true" 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C8963E]/5 blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#0F281E]/5 blur-3xl pointer-events-none" 
      />

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C8963E] bg-[#0F281E] flex items-center justify-center p-1 shadow-md">
            <img 
              src={cafeLogo} 
              alt="AllDayCafé Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#0F281E] block">
              AllDayCafé
            </span>
            <span className="text-[11px] font-semibold text-[#6B7C72] tracking-wider uppercase">
              Management Platform
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden sm:flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#EBE6DC] shadow-sm">
          <div className="flex items-center space-x-2 text-xs text-[#0F281E] font-medium">
            <Clock size={14} className="text-[#C8963E]" />
            <span className="font-semibold text-[#0F281E]">{currentTime || '--:--'}</span>
          </div>
          <span className="h-3 w-px bg-[#EBE6DC]" />
          <div className="flex items-center space-x-1.5 text-[11px] text-[#1E653F] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1E653F] animate-pulse" />
            <span>Terminal Operativa</span>
          </div>
        </div>
      </header>

      {/* Main Center Container */}
      <main className="w-full max-w-5xl mx-auto px-4 py-4 flex-1 flex flex-col justify-center items-center z-10">
        
        {/* Header Text & Shift Info */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3D6] text-[#8F6010] border border-[#C8963E]/30 mb-1">
            <Sparkles size={13} className="text-[#C8963E]" />
            <span>Acceso Seguro de Colaboradores</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F281E] tracking-tight">
            Bienvenido a tu Cafetería
          </h1>
          <p className="text-sm text-[#6B7C72]">
            {getShiftName()} • Ingresa tus credenciales para acceder al Punto de Venta, Gestión o Finanzas.
          </p>
        </div>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Quick Demo Access Column */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#0F281E] to-[#183D2F] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl border border-[#C8963E]/20 relative overflow-hidden">
            <div 
              aria-hidden="true" 
              className="absolute top-0 right-0 w-44 h-44 bg-[#C8963E]/10 rounded-full blur-2xl pointer-events-none" 
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1B3D2F]">
                <div className="flex items-center gap-2">
                  <Coffee size={18} className="text-[#C8963E]" />
                  <h2 className="text-sm font-bold tracking-wide uppercase text-[#FEF3D6]">
                    Roles de Acceso
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C8963E]/20 text-[#FEF3D6] border border-[#C8963E]/30">
                  Demo 1-Clic
                </span>
              </div>

              <p className="text-xs text-[#D8D1C2]/90 leading-relaxed">
                Selecciona cualquier perfil para ingresar inmediatamente o autocompletar el formulario:
              </p>

              {/* Role Cards */}
              <div className="space-y-2.5 pt-1">
                {(['empleado', 'admin', 'jefe'] as UserRole[]).map((r) => {
                  const acc = DEMO_ACCOUNTS[r];
                  const isSelected = selectedRole === r;
                  return (
                    <div 
                      key={r}
                      onClick={() => handleSelectRole(r)}
                      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-[#183D2F] border-[#C8963E] shadow-md ring-1 ring-[#C8963E]' 
                          : 'bg-[#091812]/50 border-[#1B3D2F] hover:bg-[#183D2F]/50 hover:border-[#C8963E]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {r === 'empleado' && <Coffee size={15} className="text-[#C8963E]" />}
                          {r === 'admin' && <UserCheck size={15} className="text-[#C8963E]" />}
                          {r === 'jefe' && <ShieldCheck size={15} className="text-[#C8963E]" />}
                          <span className="text-xs font-bold text-white capitalize">
                            {r}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-[#C8963E] bg-[#0F281E] px-2 py-0.5 rounded-full border border-[#C8963E]/30">
                          {r === 'empleado' ? 'POS' : r === 'admin' ? 'Operativo' : 'Ejecutivo'}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-[#D8D1C2] truncate">{acc.name}</p>
                      <p className="text-[11px] text-[#6B7C72] truncate">{acc.email}</p>

                      <div className="mt-2.5 pt-2 border-t border-[#1B3D2F] flex items-center justify-between">
                        <span className="text-[10px] text-[#FEF3D6]/70">
                          Clave: <code className="text-[#C8963E] font-mono">{acc.passwordHint}</code>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantDemoLogin(r);
                          }}
                          className="text-[10px] font-bold text-[#FEF3D6] hover:text-[#C8963E] flex items-center gap-1 group"
                        >
                          Entrar directo <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sede Info Badge */}
            <div className="mt-4 pt-3 border-t border-[#1B3D2F] flex items-center justify-between text-[11px] text-[#D8D1C2]/70 relative z-10">
              <span className="flex items-center gap-1">
                <Store size={12} className="text-[#C8963E]" />
                Sede Central Colonial
              </span>
              <span className="text-[10px] text-[#6B7C72]">SaaS v2.4</span>
            </div>
          </div>

          {/* Login Form Column */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_-2px_rgba(15,40,30,0.08)] border border-[#EBE6DC] flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0F281E] tracking-tight">
                  Autenticación
                </h2>
                <p className="text-xs text-[#6B7C72] mt-1">
                  Ingresa las credenciales autorizadas para este terminal.
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div 
                  role="alert" 
                  className="mb-5 p-3.5 rounded-xl bg-[#FEF3D6] border border-[#C8963E]/40 flex items-start space-x-3 text-xs text-[#8F6010] animate-fadeIn"
                >
                  <AlertCircle size={16} className="text-[#8F6010] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="login-email" 
                    className="block text-xs font-bold text-[#0F281E] uppercase tracking-wider mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7C72]">
                      <Mail size={16} />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@allday.cafe"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EBE6DC] rounded-xl text-sm text-[#0F281E] placeholder-[#6B7C72]/60 focus:outline-none focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs font-bold text-[#0F281E] uppercase tracking-wider"
                    >
                      Contraseña
                    </label>
                    <span className="text-[11px] text-[#6B7C72]">
                      Demo: <code className="text-[#C8963E] font-mono font-semibold">{DEMO_ACCOUNTS[selectedRole].passwordHint}</code>
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7C72]">
                      <Lock size={16} />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 bg-[#FAF8F5] border border-[#EBE6DC] rounded-xl text-sm text-[#0F281E] placeholder-[#6B7C72]/60 focus:outline-none focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B7C72] hover:text-[#0F281E] transition-colors"
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Terminal Info */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center space-x-2 text-[#6B7C72] cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="rounded border-[#EBE6DC] text-[#0F281E] focus:ring-[#C8963E] accent-[#0F281E]" 
                    />
                    <span>Recordar sesión en esta terminal</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#0F281E] text-[#FEF3D6] hover:bg-[#183D2F] border border-[#C8963E]/30 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C8963E] focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#FEF3D6] border-t-transparent rounded-full animate-spin" />
                      <span>Verificando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión en el Sistema</span>
                      <ArrowRight size={16} className="text-[#C8963E] transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t border-[#EBE6DC] flex items-center justify-between text-[11px] text-[#6B7C72]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#1E653F]" />
                Encriptación SSL de Terminal Activa
              </span>
              <span>AllDayCafé Dashboard</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer Notice */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-[#6B7C72] z-10 border-t border-[#EBE6DC]/60">
        <p>
          AllDayCafé Dashboard &copy; {new Date().getFullYear()} • Plataforma Integral de Control Operativo y Financiero
        </p>
      </footer>
    </div>
  );
};
