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
        平台亮点
      </motion.h2>

      <div className="flex flex-col justify-between gap-8 md:flex-row">
        {[
          {
            title: "社区共享",
            description: "用户可实时上报延误、封路等事件，提升出行透明度。",
          },
          {
            title: "官方数据对接",
            description: "整合 Luas、DART 等官方 API，信息权威、及时。",
          },
          {
            title: "全开源透明",
            description: "项目完全开源，数据与代码可查，确保公信力。",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-lg bg-muted p-6 text-center shadow-md transition hover:shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
