import JWT from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import OnboardingClient from "../../components/onboard/OnboardingClient";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const onboardingUserCookie = (await cookies()).get("onboarding-user")!
    const onboardingUserToken = onboardingUserCookie.value
    const user = JWT.verifyToken(onboardingUserToken)

    if (!user) {
        redirect("/signup")
    }

    return <OnboardingClient user={user as JwtPayload} />
}
