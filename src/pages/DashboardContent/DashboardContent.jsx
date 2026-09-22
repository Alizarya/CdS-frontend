import Header from "../../components/Header/Header";
import AdminContent from "../../components/AdminContent/AdminContent";
import AdminRss from "../../components/AdminRss/AdminRss";
import AdminMember from "../../components/AdminMember/AdminMember";
import Footer from "../../components/Footer/Footer";

function DashboardContent() {
  return (
    <>
      <Header />

      <main>
        <AdminMember/>
        <AdminContent />
        <AdminRss/>
      </main>

      <Footer />
    </>
  );
}

export default DashboardContent;