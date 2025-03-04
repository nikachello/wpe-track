import React from "react";
import SignupForm from "@/components/forms/auth/SignupForm";
import AuthFormWrapper from "@/components/forms/auth/AuthFormWrapper";

const SignupPage = () => {
  return (
    <AuthFormWrapper
      title="რეგისტრაცია"
      description="გთხოვთ დარეგისტრირდეთ"
      formComponent={<SignupForm />}
      linkQuestion="გაქვთ ანგარიში?"
      linkText="შესვლა"
      linkHref="/login"
    />
  );
};

export default SignupPage;
