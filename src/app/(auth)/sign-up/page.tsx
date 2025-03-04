import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/components/forms/auth/SignupForm";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex flex-col min-w-[350px]">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>რეგისტრაცია</CardTitle>
          <CardDescription>გთხოვთ დარეგისტრირდეთ</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="flex flex-row gap-2 text-sm text-muted-foreground">
            გაქვთ ანგარიში?
            <Link className="text-primary hover:underline" href="/login">
              შესვლა
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
