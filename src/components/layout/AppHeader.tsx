import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAddress, ROUTE_PATHS, useWalletStore } from "@/lib/index";
import { NAV_LINKS } from "./layout.constants";

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isConnected, address, connect, disconnect, isConnecting } = useWalletStore();

  const isActive = (path: string) => {
    if (path === ROUTE_PATHS.HOME) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={ROUTE_PATHS.HOME} className="flex items-center">
          <span
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            LumiFilm
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-muted-foreground">
                {formatAddress(address!)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-border/60 hover:border-primary/60"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => void connect()}
              disabled={isConnecting}
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/40 bg-card/95 backdrop-blur-md md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border/40 pt-2">
                {isConnected ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatAddress(address!)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        disconnect();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border-border/60 hover:border-primary/60"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      void connect();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isConnecting}
                    className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
