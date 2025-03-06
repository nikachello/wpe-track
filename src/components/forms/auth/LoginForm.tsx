"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";
import { authClient } from "@/utils/auth-client";
import { signInSchema } from "@/utils/zodSchemas";
import { AuthFormField } from "./AuthFormField";

const LoginForm = () => {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,

        callbackURL: "/",
      },
      {
        onRequest: () => {
          setPending(true);
          toast.success("გთხოვთ დაელოდოთ");
        },
        onSuccess: () => {
          form.reset();
        },
        onError: (ctx) => {
          if (ctx.error.status === 401) {
            toast.success("არასწორი მონაცემები");
          }
          setPending(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <AuthFormField
            control={form.control}
            name="email"
            label="ელ-ფოსტა"
            placeholder="john@wpe.com"
          />

          <AuthFormField
            control={form.control}
            name="password"
            label="პაროლი"
            placeholder="პაროლი"
            type="password"
          />

          <Button disabled={pending} type="submit" className="w-full">
            {pending ? "დაელოდეთ..." : "შესვლა"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
