import JWT from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies as getCookies } from "next/headers";
import OnboardingClient from "../../components/onboard/OnboardingClient";
import { redirect } from "next/navigation";
import cookies from "@/config/cookies";

export default async function OnboardingPage() {
    const onboardingUserCookie = (await getCookies()).get(cookies.ONBOARDING_USER)!
    const onboardingUserToken = onboardingUserCookie.value
    const user = JWT.verifyToken(onboardingUserToken)

    if (!user) {
        redirect("/sign-up")
    }

    return <OnboardingClient user={user as JwtPayload} />
}
