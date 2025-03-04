"use client";
import { signUpSchema } from "@/utils/zodSchemas";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { authClient } from "@/utils/auth-client";
import { redirect } from "next/navigation";

type Props = {};

const SignupForm = (props: Props) => {
  const [pending, setPending] = useState(false);

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
    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/sign-in",
      },
      {
        onRequest: () => {
          setPending(true);
          toast.success("გთხოვთ დაელოდოთ");
        },
        onSuccess: () => {
          form.reset();
          redirect("/");
        },
        onError: (ctx) => {
          toast.success(ctx.error.message);
          setPending(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  სახელი
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-xs"
                    placeholder="თქვენი სახელი"
                    {...field}
                  ></Input>
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
                <FormLabel className="text-sm text-muted-foreground">
                  ელ-ფოსტა
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-xs"
                    placeholder="john@wpe.com"
                    {...field}
                  ></Input>
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
                <FormLabel className="text-sm text-muted-foreground">
                  პაროლი
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-xs"
                    placeholder="პაროლი"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
