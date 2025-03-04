"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";
import { authClient } from "@/utils/auth-client";
import { signUpSchema } from "@/utils/zodSchemas";
import { useRouter } from "next/navigation";
import { AuthFormField } from "./AuthFormField";

const SignupForm = () => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const { name, email, password } = values;

    try {
      setPending(true);
      toast.info("გთხოვთ დაელოდოთ");

      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      form.reset();
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <AuthFormField
            control={form.control}
            name="name"
            label="სახელი"
            placeholder="თქვენი სახელი"
          />

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
            {pending ? "დაელოდეთ..." : "რეგისტრაცია"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
