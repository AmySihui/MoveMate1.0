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
import { Link } from "react-router-dom";
import { signUp } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(3, "请输入用户名（不能是邮箱）"),
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码不少于6位"),
});

export default function HeroSection() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    try {
      const { username, email, password } = values;
      try {
        await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
        console.log("注册成功");
        navigate("/login");
      } catch (error: any) {
        console.error("注册失败:", error);
        form.setError("username", { type: "manual", message: error.message });
      }

      navigate("/login");
    } catch (error: any) {
      console.error("注册失败：", error);
      form.setError("email", {
        type: "manual",
        message: error.message || "注册失败",
      });
    }
  };

  return (
    <section
      className="relative flex min-h-[80vh] items-center bg-cover bg-center px-6 text-white md:px-12"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="backdrop-brightness-45 absolute inset-0 bg-slate-900/50"></div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-20 md:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            MoveMate
          </h1>
          <p className="text-2xl text-slate-300 md:text-2xl">
            Share and discover real-time public transit updates.
            <br />
            Report delays, suspensions, or changes.
            <br />
            Search for routes and view live transit maps with ease.
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              className="bg-black px-12 py-6 text-3xl text-white transition-colors hover:bg-white hover:text-black"
            >
              <Link to="/map">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-md flex-1 rounded-xl bg-white p-6 text-slate-900 shadow-xl">
          <h2 className="mb-4 text-3xl font-bold">Sign up for MoveMate</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="Enter a username (not email)"
                        {...field}
                      />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black text-lg text-white hover:bg-gray-700"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
