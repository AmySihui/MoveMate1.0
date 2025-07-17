import { Map, UploadCloud, Radar } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscoverSection() {
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
        Core Features
      </motion.h2>

      <div className="grid gap-10 md:grid-cols-3">
        {[
          {
            icon: <Map className="h-10 w-10" />,
            title: "Live Map",
            description:
              "View official and community-reported transit events in real time.",
          },
          {
            icon: <UploadCloud className="h-10 w-10" />,
            title: "Report Events",
            description:
              "Easily upload delays, suspensions, or route changes to help others.",
          },
          {
            icon: <Radar className="h-10 w-10" />,
            title: "Official Integration",
            description:
              "Seamlessly combines official APIs for transparent, efficient info.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-5 rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-xl transition hover:shadow-2xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="mb-2 rounded-full bg-black p-5 text-white">
              {item.icon}
            </div>
            <h3 className="mb-1 text-2xl font-bold text-black">{item.title}</h3>
            <p className="text-lg text-gray-700">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
