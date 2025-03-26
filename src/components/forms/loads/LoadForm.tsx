"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addLoadSchema } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const LoadForm = ({
  onSuccess,
  editData = null,
  setDrawerOpen,
}: {
  onSuccess?: () => void;
  editData?: object | null;
  setDrawerOpen: (open: boolean) => void;
  drawerOpen: boolean;
}) => {
  const form = useForm<z.infer<typeof addLoadSchema>>({
    resolver: zodResolver(addLoadSchema),
    defaultValues: editData || {
      superId: "",
      deliveryAddress: "",
      pickupAddress: "",
      vin: "",
      price: "",
      paymentType: "CASH",
      dispatcherId: "",
      realDriverId: "",
      realCompanyId: "",
      pickupDate: null,
      deliveryDate: null,
      isPaymentReceived: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof addLoadSchema>) => {
    console.log(values);

    // Add your API call here
    // Example:
    // if (editData) {
    //   await updateLoad({ id: editData.id, ...values });
    // } else {
    //   await createLoad(values);
    // }

    if (onSuccess) onSuccess();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Load Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ტვირთის საბაზისო ინფორმაცია</h3>

            <FormField
              control={form.control}
              name="superId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Super ID</FormLabel>
                  <FormControl>
                    <Input placeholder="სუპერის ID..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN კოდი</FormLabel>
                  <FormControl>
                    <Input placeholder="მანქანის VIN კოდი..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ფასი</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>გადახდის ტიპი</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიეთ გადახდის ტიპი" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">ნაღდი</SelectItem>
                      <SelectItem value="DAYS_2">2 დღე</SelectItem>
                      <SelectItem value="DAYS_3">3 დღე</SelectItem>
                      <SelectItem value="DAYS_5">5 დღე</SelectItem>
                      <SelectItem value="DAYS_15">15 დღე</SelectItem>
                      <SelectItem value="DAYS_20">20 დღე</SelectItem>
                      <SelectItem value="DAYS_30">30 დღე</SelectItem>
                      <SelectItem value="SUPERPAY">SuperPay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">მისამართები</h3>

            <FormField
              control={form.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>აყვანის მისამართი</FormLabel>
                  <FormControl>
                    <Input placeholder="საიდან..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ჩაბარების მისამართი</FormLabel>
                  <FormControl>
                    <Input placeholder="სად..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>აყვანის თარიღი</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>აირჩიეთ თარიღი</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>ჩაბარების თარიღი</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>აირჩიეთ თარიღი</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <FormField
          control={form.control}
          name="isPaymentReceived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>გადახდილია</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={() => setDrawerOpen(false)}
            variant="outline"
            type="button"
          >
            გაუქმება
          </Button>
          <Button type="submit">დამატება</Button>
        </div>
      </form>
    </Form>
  );
};

export default LoadForm;
