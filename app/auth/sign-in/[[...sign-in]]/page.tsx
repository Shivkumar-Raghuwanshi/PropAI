import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-600 text-sm",
        },
      }}
    />
  );
}
