"use client";
import { addRealCompany, editRealCompany } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCompanyContext } from "@/context/RealCompanyContext";
import { realCompanySchema } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddRealCompanyForm = () => {
  const { setDrawerOpen, editData, resetEditData } = useCompanyContext();

  const form = useForm<z.infer<typeof realCompanySchema>>({
    resolver: zodResolver(realCompanySchema),
    defaultValues: {
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
    });
  }, [editData, form]);

  const queryClient = useQueryClient();

  const mutationAdd = useMutation({
    mutationFn: addRealCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["real-companies"] });
      toast.success("კომპანია დაემატა წარმატებით");
      form.reset();
      setDrawerOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
        form.reset();
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: ({
      id,
      ...values
    }: { id: string } & z.infer<typeof realCompanySchema>) =>
      editRealCompany(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["real-companies"] });
      toast.success("კომპანიის მონაცემები განახლდა წარმატებით");
      resetEditData();
      setDrawerOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
        form.reset();
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof realCompanySchema>) => {
    if (!editData) {
      mutationAdd.mutate(values);
    } else {
      mutationEdit.mutate({ id: editData.id, ...values });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>კომპანიის სახელი</FormLabel>
              <FormControl>
                <Input className="text-xs" placeholder="Company" {...field} />
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
              <FormLabel>კომპანიის ელ-ფოსტა</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="john@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>კომპანიის ტელეფონი</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="+11234567891"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="outline"
          className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto"
          type="submit"
        >
          {editData ? "ჩასწორება" : "დამატება"}
        </Button>
      </form>
    </Form>
  );
};

export default AddRealCompanyForm;
