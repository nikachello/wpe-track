"use client";
import React, { useState, useTransition } from "react";
import { fakeCompanySchema } from "@/utils/zodSchemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FakeCompany } from "@prisma/client";
import { createFakeCompany, updateFakeCompany } from "@/actions/admin-actions";
import { toast } from "sonner"; // optional, for notifications
import { useRouter } from "next/navigation";

const AddFakeCompanyForm = ({
  fakeCompany,
}: {
  fakeCompany: FakeCompany | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof fakeCompanySchema>>({
    resolver: zodResolver(fakeCompanySchema),
    defaultValues: {
      name: fakeCompany?.name || "",
      streetAddress: fakeCompany?.streetAddress || "",
      cityStateZip: fakeCompany?.cityStateZip || "",
      mcNumber: fakeCompany?.mcNumber || "",
      phoneNumber: fakeCompany?.phoneNumber || "",
      email: fakeCompany?.email || "",
    },
  });

  const onSubmit = (values: z.infer<typeof fakeCompanySchema>) => {
    startTransition(async () => {
      try {
        if (fakeCompany) {
          // Edit existing one
          await updateFakeCompany(fakeCompany.id, values);
          toast.success("კომპანია წარმატებით შეიცვალა");
          setIsEditing(false);
        } else {
          // Create new
          await createFakeCompany(values);
          toast.success("კომპანია წარმატებით შეიქმნა");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "დაფიქსირდა შეცდომა");
        } else {
          toast.error("დაფიქსირდა შეცდომა");
        }
      }
      router.refresh();
    });
  };

  if (fakeCompany && !isEditing) {
    return (
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="font-semibold text-lg">სტიკერის კომპანია</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>სახელი:</strong> {fakeCompany.name}
          </p>
          <p>
            <strong>მისამართი:</strong> {fakeCompany.streetAddress}
          </p>
          <p>
            <strong>ქალაქი / შტატი / ZIP:</strong> {fakeCompany.cityStateZip}
          </p>
          <p>
            <strong>MC ნომერი:</strong> {fakeCompany.mcNumber}
          </p>
          <p>
            <strong>ტელეფონი:</strong> {fakeCompany.phoneNumber}
          </p>
          <p>
            <strong>მეილი:</strong> {fakeCompany.email}
          </p>
        </div>

        <Button onClick={() => setIsEditing(true)}>შეცვლა</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full border p-4 rounded-lg"
      >
        <h2 className="font-semibold text-lg">
          {fakeCompany
            ? "შეცვალეთ სტიკერის კომპანია"
            : "შექმენით სტიკერის კომპანია"}
        </h2>

        {[
          { name: "name", label: "კომპანიის სახელი" },
          { name: "streetAddress", label: "კომპანიის ქუჩის მისამართი" },
          { name: "cityStateZip", label: "კომპანიის ქალაქი, შტატი, ზიპ კოდი" },
          { name: "mcNumber", label: "კომპანიის MC ნომერი" },
          { name: "phoneNumber", label: "კომპანიის ტელეფონის ნომერი" },
          { name: "email", label: "კომპანიის მეილი" },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof z.infer<typeof fakeCompanySchema>}
            render={({ field: inputField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input className="text-xs" {...inputField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "იტვირთება..."
              : fakeCompany
              ? "შეინახეთ ცვლილებები"
              : "შექმენით"}
          </Button>
          {fakeCompany && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              გაუქმება
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddFakeCompanyForm;
