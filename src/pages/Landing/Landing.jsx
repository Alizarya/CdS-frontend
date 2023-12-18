// Import des styles 
import "./Landing.css";

// Import des données
import DataMembers from "../../data/DataMembers";
import SocialsLogos from "../../data/DataSocialsLogo";

// Import des composants
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";

import { Link } from 'react-router-dom';

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
          <img className="homeImg" src="/images/Landing/groupe.jpg" alt="Le café des science lors de PlayAzur, photo de groupe" />
          <Button texte="Découvrir nos membres" to="/members" />
        </section>

        <section className="landingMember">
          <img className="loupe" src="/images/Landing/doodle_loupe.png" alt="doodle d'une loupe"/>
          <div className="landingMemberCard">
            {randomMember && (
              <>
                <div className="landingMemberCardImgContainer">
                  <img className="landingMemberCardImg"
                    src={randomMember.image}
                    alt={`photo de profil de ${randomMember.pseudo || randomMember.name}`}
                  />
                  <p class="landingMemberCardImgBorder"></p>
                </div>
                <div className="landingMemberCardInfo">
                {randomMember.pseudo ? (
                  <>
                    <h2>{randomMember.pseudo}</h2>
                    <h3>{randomMember.name}</h3>
                  </>
                ) : (
                  <h2>{randomMember.name}</h2>
                )}
                <p className="tags">{randomMember.tags}</p>
                <p>{randomMember.shortdescription}</p>

                <div className="landingMemberCardInfoSocial">
                  {Object.keys(randomMember.links).map((link, index) => (
                    <a key={index} href={randomMember.links[link]} target="_blank">
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

    </div>

    );
  }
  
  // Export de la fonction composant
  export default Landing;