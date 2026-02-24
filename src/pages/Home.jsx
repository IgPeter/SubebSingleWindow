// pages/Home.jsx
import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import MainUi from "../components/ui/MainUi";
import Footer from "../components/ui/footer"; // Adjust path if needed
import SportingActivity from "../components/ui/SportActivity";
import NewsActivity from "../components/ui/NewsEvents";

function Home() {
  return (
    <MainLayout>
      <MainUi />
      <SportingActivity />
      <NewsActivity />
      <Footer />
    </MainLayout>
  );
}

export default Home;
