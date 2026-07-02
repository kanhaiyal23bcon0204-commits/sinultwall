import { Navigate, NavLink, Outlet, useNavigate } from "react-router";
import { LayoutDashboard, Upload, LogOut, ArrowUpRight } from "lucide-react";
import { Logo } from "../Logo";
import { useAdminAuth } from "../../../lib/admin-auth";
import { Loader } from "../Skeletons";
import { cn } from "../ui/utils";

export function ProtectedAdminRoute() {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) return <Loader label="Checking access" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

function AdminLayout() {
  const { email, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/upload", label: "Upload", icon: Upload },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-white/60 p-5 backdrop-blur-xl md:flex">
        <Logo />
        <nav className="mt-8 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-[var(--primary)] to-[#a06bff] text-white shadow-[0_10px_24px_-10px_rgba(124,92,255,0.7)]"
                    : "text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]"
          >
            <ArrowUpRight className="h-4 w-4" /> View site
          </button>
          <div className="truncate px-3.5 pt-3 text-xs text-[var(--muted-foreground)]">
            {email}
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/admin/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--destructive)] hover:bg-[var(--accent)]"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 px-4 py-8 sm:px-8">
        {/* Mobile top bar */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <Logo />
          <button
            onClick={() => {
              signOut();
              navigate("/admin/login");
            }}
            className="rounded-xl bg-white/70 px-3 py-2 text-sm font-medium text-[var(--destructive)]"
          >
            Sign out
          </button>
        </div>
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
