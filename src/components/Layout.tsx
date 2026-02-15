import logo from "../assets/logo.png";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br 
      from-emerald-100 via-white to-rose-100 relative overflow-hidden">

      {/* Header */}
      <header className="absolute top-6 left-10 z-20 flex items-center gap-3">

        <img src={logo} alt="logo" className="w-10 h-10 drop-shadow-lg" />

        <h1
          className="text-3xl font-extrabold 
          bg-gradient-to-r from-emerald-500 via-teal-400 to-rose-500
          bg-clip-text text-transparent
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]
          tracking-wide"
        >
          Task Manager
        </h1>
      </header>

      {children}
    </div>
  );
};

export default Layout;
