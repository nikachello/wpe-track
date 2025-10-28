import { z } from "zod";
import validator from "validator";
// import { PaymentType } from "@prisma/client";

// const PaymentTypeEnum = z.enum([
//   "CASH",
//   "DAYS_2",
//   "DAYS_3",
//   "DAYS_5",
//   "DAYS_15",
//   "DAYS_20",
//   "DAYS_30",
//   "SUPERPAY",
// ]);

export const signInSchema = z.object({
  email: z.string().email({ message: "შეიყვანეთ სწორი ელ-ფოსტა" }),
  password: z.string().min(6, "შეიყვანეთ პაროლი"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "შეიყვანეთ სახელი"),
  email: z.string().email({ message: "შეიყვანეთ სწორი ელ-ფოსტა" }),
  password: z.string().min(6, "შეიყვანეთ პაროლი"),
});

export const realCompanySchema = z.object({
  name: z.string().min(1, "შეიყვანეთ კომპანიის სახელი"),
  phone: z.string().refine(validator.isMobilePhone),
  email: z.string().email({ message: "შეიყვანეთ სწორი ელ ფოსტა" }),
  isInsuranceCompany: z.boolean({
    required_error: "გთხოვთ აირჩიოთ დაზღვევის სტატუსი.",
  }),
  driversAssignable: z.array(z.string()).optional(),
});

export const fakeCompanySchema = z.object({
  name: z.string().min(1, "შეიყვანეთ სტიკერის კომპანიის სახელი"),
  streetAddress: z
    .string()
    .min(1, "შეიყვანეთ სტიკერის კომპანიის ქუჩის მისამართი"),
  cityStateZip: z
    .string()
    .min(1, "შეიყვანეთ სტიკერის კომპანიის ქალაქი, შტატი და ზიპ კოდი"),
  mcNumber: z.string().min(1, "შეიყვანეთ სტიკერის კომპანიის MC ნომერი"),
  phoneNumber: z
    .string()
    .min(1, "შეიყვანეთ სტიკერის კომპანიის ტელეფონის ნომერი"),
  email: z.string().min(1, "შეიყვანეთ სტიკერის კომპანიის მეილი"),
});

export const addLoadSchema = z
  .object({
    superId: z.string().min(1, { message: "Super ID სავალდებულოა" }),
    deliveryAddress: z
      .string()
      .min(1, { message: "ჩაბარების მისამართი სავალდებულოა" }),
    pickupAddress: z
      .string()
      .min(1, { message: "აყვანის მისამართი სავალდებულოა" }),
    vin: z.string().min(1, { message: "VIN კოდი სავალდებულოა" }),
    price: z.string().min(1, { message: "ფასი სავალდებულოა" }),
    paymentType: z.string(),
    dispatcherId: z.string().optional(),
    realDriverId: z.string().optional(),
    realCompanyId: z.string().optional(),
    pickupDate: z.date().nullable(),
    deliveryDate: z.date().nullable(),
    isPaymentReceived: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.pickupDate || !data.deliveryDate) {
        return true;
      }
      return data.deliveryDate >= data.pickupDate;
    },
    {
      message: "ჩაბარების თარიღი უნდა იყოს აყვანის თარიღის შემდეგ",
      path: ["deliveryDate"],
    }
  );
