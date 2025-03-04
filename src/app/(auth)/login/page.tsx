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
import LoginForm from "@/components/forms/auth/LoginForm";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex flex-col min-w-[350px]">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>შესვლა</CardTitle>
          <CardDescription>შედით სისტემაში</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="flex flex-row gap-2 text-sm text-muted-foreground">
            არ გაქვთ ანგარიში?
            <Link className="text-primary hover:underline" href="/sign-up">
              დარეგისტრირდით
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
