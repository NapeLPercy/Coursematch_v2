import HowItWorks from "./HowItWorks";
import FAQ from "../components/data-display/FAQ";
import Testimonials from "./Testimonials";
import AboutUs from "./About";
import SEO from "../components/ui/SEO";
import { homeFaqs } from "../Utils/textData/SeoFaqs";
import WhyChooseUs from "./WhyChooseUs";
import Hero from "./Hero";
// Home Component
export default function Home() {
  return (
    <>
      <SEO
        title="CourseMatch South Africa | Find Your Perfect Course"
        description="Discover university courses in South Africa based on your APS score."
        url="https://coursematchapp.co.za/"
        faq={homeFaqs}
      />
      <Hero />
      <AboutUs />
      <WhyChooseUs/>
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}
