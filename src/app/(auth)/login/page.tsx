import React from "react";
import LoginForm from "@/components/forms/auth/LoginForm";
import AuthFormWrapper from "@/components/forms/auth/AuthFormWrapper";

const LoginPage = () => {
  return (
    <AuthFormWrapper
      title="შესვლა"
      description="შედით სისტემაში"
      formComponent={<LoginForm />}
      linkQuestion="არ გაქვთ ანგარიში?"
      linkText="დარეგისტრირდით"
      linkHref="/sign-up"
    />
  );
};

export default LoginPage;
