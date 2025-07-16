// src/components/landing/HeroSection.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import bg from "@/assets/homePage.jpg";

const formSchema = z.object({
  fullName: z.string().min(2, "请输入姓名"),
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码不少于6位"),
});

export default function HeroSection() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log("注册信息：", values);
    // Step 3：接 Cognito 注册
  };

  return (
    <section
      className="relative flex min-h-screen items-center bg-cover bg-center px-6 text-white md:px-12"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="backdrop-brightness-45 absolute inset-0 bg-slate-900/50"></div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        {/* 左侧介绍 */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            MoveMate
          </h1>
          <p className="text-lg text-slate-300">
            实时掌握公共交通信息，轻松发现公交、地铁最新动态。
          </p>
          <div className="flex gap-4">
            <Button size="lg">探索地图</Button>
            <Button size="lg" variant="outline">
              了解功能
            </Button>
          </div>
        </div>

        {/* 右侧注册表单 */}
        <div className="w-full max-w-md flex-1 rounded-xl bg-white p-8 text-slate-900 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">注册 MoveMate</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                注册
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
