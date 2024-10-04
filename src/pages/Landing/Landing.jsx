// Import des styles 
import "./Landing.css";
import "./LandingResponsive.css"

// Import des données
import SocialsLogos from "../../data/DataSocialsLogo";
import DataSocials from "../../data/DataSocials";
import { getMembers } from "../../utils/axiosMembers"; 

// Import des composants
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import ContactForm from "../../components/ContactForm/ContactForm";

// Import des besoins 
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"; 

function Landing() {
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(true); 

  // Récupération des membres à partir de l'API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await getMembers(); 
        setMembers(membersData); 
      } catch (error) {
        console.error("Erreur lors de la récupération des membres:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchMembers(); 
  }, []); 

  // Fonction de recherche de membre random dans la BDD avec softDelete à false
  const getRandomMember = () => {
    const activeMembers = members.filter(member => !member.softDelete); 
    if (activeMembers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * activeMembers.length);
    return activeMembers[randomIndex];
  };

  const randomMember = getRandomMember(); 

  return (
    <div className="landing">
      <Header />

      <section className="home">
        <h1 className="banner">C'est fort de sciences !</h1>
        <img className="homeImg" src="/images/Landing/goupePA.jpg" alt="Le café des science lors de PlayAzur, en groupe" />
        <Button texte="Découvrir nos membres" to="/members" />
      </section>

      {loading ? ( 
        <p>Loading...</p>
      ) : (
        <section className="landingMember">
          <img className="loupe" src="/images/Landing/doodle_loupe.png" alt="doodle d'une loupe" />
          <div className="landingMemberCard">
            {randomMember && (
              <>
                <Link to={`/Members/${randomMember._id}`}> 
                  <div className="landingMemberCardImgContainer">
                    <img
                      className="landingMemberCardImg"
                      src={randomMember.image}
                      alt={`profil de ${randomMember.pseudo || randomMember.name}`}
                    />
                    <p className="landingMemberCardImgBorder"></p>
                  </div>
                </Link>
                <div className="landingMemberCardInfo">
                  {randomMember.pseudo ? (
                    <>
                      <h2>{randomMember.pseudo}</h2>
                      <h3>{randomMember.name}</h3>
                    </>
                  ) : (
                    <h2>{randomMember.name}</h2>
                  )}
               
                  <p>{randomMember.shortdescription}</p>

                  <div className="landingMemberCardInfoSocial">
                    {Object.keys(randomMember.links).map((link, index) => (
                      <a key={index} href={randomMember.links[link]} target="_blank" rel="noreferrer">
                        {SocialsLogos[link] && (
                          <i className={SocialsLogos[link]} />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="support" id="support">
        <div className="helloasso">
          <div className="helloasso-text">
            <p>Le Café des sciences est une association qui existe grâce notamment au soutien de ses membres et à leur travail <b>bénévole</b>.</p>
            <p>Si vous appréciez notre travail, n’hésitez pas à faire un <b>don</b> ! </p>
            <p>Il servira à couvrir les frais de fonctionnement courant ou pourra être utilisé pour financer un projet spécifique !</p>
          </div>
            <Link to="https://www.helloasso.com/associations/c-fetiers-des-sciences" target="_blank" rel="noopener noreferrer"> 
              <img className="supportImg" src="/images/Landing/logo-web-bleu.png" alt="Logo de HelloAsso" />
              <p className="supportTxt">Faire un don</p>
            </Link>          
        </div>

        <div className="socials">
          {DataSocials.map((social, index) => (
            <Button
              key={index}
              to={social.link}
              icon={social.icon}
              texte={social.title}
              openNewTab={true} 
            />
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
            <ContactForm />
      </section>

      <Footer />
    </div>
  );
}

// Export de la fonction composant
export default Landing;
