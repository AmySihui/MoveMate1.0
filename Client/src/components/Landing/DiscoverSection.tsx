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
        MoveMate 三大核心功能
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3">
        {[
          {
            icon: <Map className="h-8 w-8" />,
            title: "实时地图",
            description: "查看官方实时数据和社区上报事件，掌握最新交通状况。",
          },
          {
            icon: <UploadCloud className="h-8 w-8" />,
            title: "上传事件",
            description:
              "随时上传你遇到的封路、延误等交通事件，帮助更多人避开拥堵。",
          },
          {
            icon: <Radar className="h-8 w-8" />,
            title: "官方整合",
            description:
              "结合 Luas、DART 等官方数据，信息透明高效，一站式掌握。",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-4 rounded-lg bg-muted p-6 text-center shadow-md transition hover:shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="rounded-full bg-primary p-4 text-white">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
