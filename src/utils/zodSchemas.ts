import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "შეიყვანეთ სწორი ელ-ფოსტა" }),
  password: z.string().min(6, "შეიყვანეთ პაროლი"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "შეიყვანეთ სახელი"),
  email: z.string().email({ message: "შეიყვანეთ სწორი ელ-ფოსტა" }),
  password: z.string().min(6, "შეიყვანეთ პაროლი"),
});
