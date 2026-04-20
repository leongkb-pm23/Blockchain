import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3
              className="mb-3 text-xl font-bold text-primary"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              LumiFilm
            </h3>
            <p className="text-sm text-muted-foreground">
              Decentralized film crowdfunding platform powered by blockchain
              technology.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTE_PATHS.EXPLORE}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.CREATE}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.DASHBOARD}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">About</h4>
            <p className="text-sm text-muted-foreground">
              LumiFilm brings transparency and decentralization to film
              crowdfunding, empowering creators and supporters alike.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 LumiFilm. All rights reserved. Demo platform for educational
            purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
