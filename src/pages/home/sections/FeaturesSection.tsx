import { motion } from "framer-motion";
import { features } from "../home.data";

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Why LumiFilm?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Empowering filmmakers with blockchain technology for transparent,
            fee-free crowdfunding
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
