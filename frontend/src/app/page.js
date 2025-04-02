import Header from "../components/Header";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Details from "../components/Details";
import Features from "../components/Features";
import Docs from "../components/Docs";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial";
import Faq from "../components/faq";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Header />
      <Features />
      <Details />
      <Testimonial/>
      <Docs />
      <Faq />
      <About />
      <Footer />
    </main>
  );
}
