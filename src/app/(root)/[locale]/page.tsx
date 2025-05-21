import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
export default function Home() {
  return (
    <>
      <SignedOut>
        <Button
          asChild
          variant={"outline"}
          className="text-primary cursor-pointer "
        >
          <SignInButton />
        </Button>
        <Button
          asChild
          variant={"outline"}
          className="hover:text-primary cursor-pointer"
        >
          <SignUpButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
