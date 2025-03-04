import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormWrapperProps {
  title: string;
  description: string;
  formComponent: ReactNode;
  linkText: string;
  linkHref: string;
  linkQuestion: string;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  title,
  description,
  formComponent,
  linkText,
  linkHref,
  linkQuestion,
}) => {
  return (
    <div className="flex flex-col min-w-[350px]">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{formComponent}</CardContent>
        <CardFooter className="flex justify-center">
          <p className="flex flex-row gap-2 text-sm text-muted-foreground">
            {linkQuestion}
            <Link className="text-primary hover:underline" href={linkHref}>
              {linkText}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthFormWrapper;
