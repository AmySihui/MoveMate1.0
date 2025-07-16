import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
      }}
      className="mx-auto max-w-7xl px-6 py-16"
    >
      <motion.h2
        className="mb-10 text-center text-3xl font-bold md:text-4xl"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        Platform Highlights
      </motion.h2>

      <div className="flex flex-col justify-between gap-8 md:flex-row">
        {[
          {
            title: "Community Driven",
            description:
              "Users can report delays and incidents to improve travel transparency.",
          },
          {
            title: "Official Data",
            description:
              "Integrated with official APIs for reliable and timely information.",
          },
          {
            title: "Open Source",
            description: "Fully open source for transparency and trust.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="mx-2 flex-1 rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-xl transition hover:shadow-2xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="mb-2 text-2xl font-bold text-black">
              {feature.title}
            </h3>
            <p className="text-lg text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
