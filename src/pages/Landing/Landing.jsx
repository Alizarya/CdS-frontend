// Import des styles 
import "./Landing.css";



// Import des composants
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button"

function Landing() {
    return (
      <div className="landing">
        <Header />
        <div className="home">
          <img className="homeImg" src="/images/Landing/groupe.jpg" alt="Le café des science lors de PlayAzur, photo de groupe" />
          <Button texte="Découvrir nos membres" to="/members" />
        </div>
    </div>

    );
  }
  
  // Export de la fonction composant
  export default Landing;