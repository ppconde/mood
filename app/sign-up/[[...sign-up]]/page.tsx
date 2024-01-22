import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <SignUp afterSignInUrl="/new-user" redirectUrl="/new-user" />
);

export default SignUpPage;