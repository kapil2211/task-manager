import logo from "../assets/TM_logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br 
      from-emerald-100 via-white to-rose-100 relative overflow-hidden">

      {/* Header */}
      <header className="absolute top-6 left-10 z-20 flex items-center gap-3">
        <img
          src={logo}
          alt="TaskTracker Logo"
          className="h-32 md:h-36 w-auto object-contain drop-shadow-2xl"
         // className="h-14 w-auto object-contain drop-shadow-xl"
        />
      </header>

      {children}
    </div>
  );
};

export default Layout;
