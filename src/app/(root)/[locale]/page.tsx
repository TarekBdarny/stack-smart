import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
export default async function Home() {
  const user = await currentUser();
  if (user) syncUser();

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
