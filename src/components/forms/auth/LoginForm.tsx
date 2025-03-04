"use client";
import { signInSchema } from "@/utils/zodSchemas";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";

type Props = {};

const LoginForm = (props: Props) => {
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
            {pending ? "დაელოდეთ..." : "შესვლა"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
