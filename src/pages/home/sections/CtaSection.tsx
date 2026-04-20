import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ctaContent } from "../home.data";

export function CtaSection() {
  const PrimaryIcon = ctaContent.primaryAction.icon;

  return (
    <section id="cta" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 z-0">
        <img
          src={ctaContent.backgroundImage}
          alt="CTA background"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-chart-2/30" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-6 text-4xl font-bold md:text-6xl">
            {ctaContent.title}
          </h2>
          <p className="mb-10 text-xl text-muted-foreground">
            {ctaContent.description}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to={ctaContent.primaryAction.href}>
              <Button size="lg" className="group">
                {ctaContent.primaryAction.label}
                <PrimaryIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to={ctaContent.secondaryAction.href}>
              <Button size="lg" variant="outline">
                {ctaContent.secondaryAction.label}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
