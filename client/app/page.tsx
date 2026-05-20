import LandingPage from "../sections/LandingPage";
import PageTransition from "../components/PageTransition";

export default function Page() {
  return (
    <PageTransition>
      <LandingPage />
    </PageTransition>
  );
}