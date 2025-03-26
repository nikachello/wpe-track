"use client";
import {
  addRealCompany,
  editRealCompany,
  getCompanyAssignableDrivers,
  getInsuranceDrivers,
} from "@/actions/admin-actions";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCompanyContext } from "@/context/RealCompanyContext";
import { realCompanySchema } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Select, { MultiValue } from "react-select";
import { Driver } from "@prisma/client";

type DriverOption = {
  value: string;
  label: string;
};

const AddRealCompanyForm = () => {
  const { setDrawerOpen, editData, resetEditData } = useCompanyContext();

  const { data: existingAssignableDrivers } = useQuery({
    queryKey: ["assignableDrivers", editData?.id],
    queryFn: () => getCompanyAssignableDrivers(editData!.id),
    enabled: !!editData?.id, // Only run the query if editData exists
  });

  const { data: insuranceDrivers } = useQuery({
    queryKey: ["insuranceDrivers"],
    queryFn: getInsuranceDrivers,
  });

  const driverOptions: DriverOption[] = useMemo(
    () =>
      insuranceDrivers?.map((driver: Driver) => ({
        value: driver.id,
        label: `${driver.name} ${driver.lastName}`,
      })) || [],
    [insuranceDrivers]
  );

  const form = useForm<z.infer<typeof realCompanySchema>>({
    resolver: zodResolver(realCompanySchema),
    defaultValues: {
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      isInsuranceCompany: editData?.isInsuranceCompany || false,
      driversAssignable: [], // Start with an empty array
    },
  });

  useEffect(() => {
    // When editing and existingAssignableDrivers is loaded
    if (editData && existingAssignableDrivers) {
      form.reset({
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        isInsuranceCompany: editData.isInsuranceCompany || false,
        // Populate driversAssignable with the IDs of existing assigned drivers
        driversAssignable: existingAssignableDrivers.map(
          (driver) => driver.value
        ),
      });
    }
  }, [editData, existingAssignableDrivers, form]);

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
    console.log(values);
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

        <FormField
          control={form.control}
          name="isInsuranceCompany"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>დავამატოთ თუ არა დაზღვევის კომპანიად</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value.toString()} // Convert boolean to string
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">კი</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">არა</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("isInsuranceCompany") === true && (
          <FormField
            control={form.control}
            name="driversAssignable"
            render={() => (
              <FormItem className="space-y-3">
                <FormLabel>აირჩიეთ მძღოლები</FormLabel>
                <FormControl>
                  <Controller
                    name="driversAssignable"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--input))",
                            color: "hsl(var(--foreground))",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--input))",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "hsl(var(--primary))"
                              : state.isFocused
                              ? "hsl(var(--accent))"
                              : "transparent",
                            color: state.isSelected
                              ? "hsl(var(--primary-foreground))"
                              : state.isFocused
                              ? "hsl(var(--accent-foreground))"
                              : "hsl(var(--foreground))",
                            ":hover": {
                              backgroundColor: "hsl(var(--accent))",
                              color: "hsl(var(--accent-foreground))",
                            },
                          }),
                        }}
                        isMulti
                        options={driverOptions}
                        value={driverOptions.filter((option) =>
                          value?.includes(option.value)
                        )}
                        onChange={(newValue) => {
                          const selectedValues = (
                            newValue as MultiValue<DriverOption>
                          ).map((option) => option.value);
                          onChange(selectedValues);
                        }}
                        placeholder="Select drivers..."
                        closeMenuOnSelect={false}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
