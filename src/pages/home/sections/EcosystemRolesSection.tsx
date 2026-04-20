import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ecosystemRoles } from "../home.data";

export function EcosystemRolesSection() {
  return (
    <section id="ecosystem-roles" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Platform Roles</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            One ecosystem for investors, campaign creators, and film companies
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {ecosystemRoles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{role.title}</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  {role.description}
                </p>
                <Link to={role.href}>
                  <Button variant="outline" className="group w-full">
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
