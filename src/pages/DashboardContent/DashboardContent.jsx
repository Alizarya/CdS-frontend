import Header from "../../components/Header/Header";
import AdminContent from "../../components/AdminContent/AdminContent";
import AdminRss from "../../components/AdminRss/AdminRss";
import Footer from "../../components/Footer/Footer";

function DashboardContent() {
  return (
    <>
      <Header />

      <main>
        <AdminContent />
        <AdminRss/>
      </main>

      <Footer />
    </>
  );
}

export default DashboardContent;