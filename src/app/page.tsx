import SearchHeader from "../components/header/searchbar-header";
import ArticlesSection from "@/components/articles/articles-section";
import Discover from "@/components/discover-section/discover";
import NavigationBar from "@/components/header/navigationBar";

// import Image from "next/image";

export default async function Home() {


  return (
    <>
      <div className="sticky top-0 w-full z-30">
        <NavigationBar/>
      </div>
      <div className="relative flex ">
        <main className="px-16 w-3/4 h-full border-r border-gray-300">
          <SearchHeader />
          <ArticlesSection />
        </main>
        <Discover />
      </div>
    </>
  );
}
