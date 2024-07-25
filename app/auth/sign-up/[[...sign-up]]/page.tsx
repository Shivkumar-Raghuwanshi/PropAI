import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-600 text-sm",
        },
      }}
    />
  );
}
