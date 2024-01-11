// Import des styles 
import "./Landing.css";

// Import des données
import DataMembers from "../../data/DataMembers";
import SocialsLogos from "../../data/DataSocialsLogo";
import DataSocials from "../../data/DataSocials";

// Import des composants
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import ContactForm from "../../components/ContactForm/ContactForm";
import Tags from "../../components/Tags/Tags";

import { Link } from "react-router-dom";


function Landing() {

  // Fonction de recherche de membre random dans la BDD
  const getRandomMember = () => {
    const randomIndex = Math.floor(Math.random() * DataMembers.length);
    return DataMembers[randomIndex];
  };
  const randomMember = getRandomMember();

    return (
      <div className="landing">

        <Header />

        <section className="home">
          <img className="homeImg" src="/images/Landing/groupe.webp" alt="Le café des science lors de PlayAzur, en groupe" />
          <Button texte="Découvrir nos membres" to="/members" />
        </section>

        <section className="landingMember">
          <img className="loupe" src="/images/Landing/doodle_loupe.png" alt="doodle d'une loupe"/>
          <div className="landingMemberCard">
            {randomMember && (
              <>
                <Link to={`/Members/${randomMember.id}`}>
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
                <Tags memberId={randomMember.id} />
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

        <section className="support" id="support">
          <div className="helloasso">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
            <Link to="https://www.helloasso.com/associations/c-fetiers-des-sciences"> <img className="supportImg" src="/images/Landing/logo-web-bleu.png" alt="Logo de HelloAsso" /></Link>
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

        <Footer/>

    </div>

    );
  }
  
  // Export de la fonction composant
  export default Landing;