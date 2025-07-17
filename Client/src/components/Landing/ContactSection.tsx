import { motion } from "framer-motion";
import avatar from "@/assets/avatar.svg";

export default function ContactSection() {
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
        Contact Me
      </motion.h2>

      <motion.div
        className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-xl transition hover:shadow-2xl"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <img
          src={avatar}
          alt="chef"
          className="mb-4 h-28 w-28 rounded-full shadow-md"
        />
        <h3 className="mb-2 text-2xl font-bold text-black">Amy Wang</h3>
        <p className="mb-4 text-lg text-gray-700">
          Let's make public transit better together! MoveMate is open for
          contributions, ideas, and feedback.
        </p>
        <a
          href="mailto:x23326344@student.ncirl.ie"
          className="inline-block rounded-full bg-black px-8 py-4 text-lg text-white outline-none transition-colors visited:text-white hover:bg-gray-700 focus:outline-none focus:ring-0"
        >
          x23326344@student.ncirl.ie
        </a>
      </motion.div>
    </motion.section>
  );
}
