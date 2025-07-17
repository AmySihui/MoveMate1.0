import { Authenticator } from "@aws-amplify/ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Authenticator
        formFields={{
          signIn: {
            username: {
              label: "Username",
              placeholder: "Enter your username",
            },
            password: {
              label: "Password",
              placeholder: "Enter your password",
            },
          },
          signUp: {
            username: {
              label: "Username",
              placeholder: "Choose a username (not email)",
            },
            email: {
              label: "Email",
              placeholder: "Enter your email address",
            },
            password: {
              label: "Password",
              placeholder: "Create your password",
            },
            confirm_password: {
              label: "Confirm Password",
              placeholder: "Confirm your password",
            },
          },
        }}
      >
        {({ user }) => {
          useEffect(() => {
            if (user) {
              const params = new URLSearchParams(location.search);
              const redirect = params.get("redirect");
              if (redirect) {
                navigate(redirect + location.search, { replace: true });
              } else {
                navigate("/", { replace: true });
              }
            }
          }, [user, location, navigate]);
          return <div />;
        }}
      </Authenticator>
    </div>
  );
}
