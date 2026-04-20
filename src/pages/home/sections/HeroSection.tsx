import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { heroContent } from "../home.data";

export function HeroSection() {
  const PrimaryIcon = heroContent.primaryAction.icon;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent.backgroundImage}
          alt="Cinematic background"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(50)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-muted"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="mb-6 bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-6xl font-bold text-transparent md:text-8xl"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {heroContent.title}
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to={heroContent.primaryAction.href}>
              <Button size="lg" className="group">
                {heroContent.primaryAction.label}
                <PrimaryIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to={heroContent.secondaryAction.href}>
              <Button size="lg" variant="outline">
                {heroContent.secondaryAction.label}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
