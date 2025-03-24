import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Details from "@/components/Details";
import Features from "@/components/Features";
import Docs from "@/components/Docs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Navbar />
      <About />
      <Details />
      <Features />
      <Docs />
      <Footer />
    </main>
  );
}
