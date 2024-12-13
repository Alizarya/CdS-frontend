// Import des styles
import "./About.css"
import "./AboutResponsive.css"

import Header from "../../components/Header/Header"
import logo from "./logo banniere café des sciences.jpg"
import groupe from "./groupe.jpg"
import Footer from "../../components/Footer/Footer"

import DataBureau from "../../data/DataBureau"
import { Link } from "react-router-dom";

function About() {

    return (
        <>
        <Header/>
        <main className="main-about">
            <h1 className="banner">Le café des sciences, c'est quoi ?</h1>
            <div className="about">
                <div className="about-paragraph">
                    <div className="about-paragraph-text">
                        <h2>Une plateforme en ligne de vulgarisation scientifique</h2>
                        <p>Le <Link to="https://fr.wikipedia.org/wiki/Caf%C3%A9_des_sciences" target="blank" rel="noopener noreferrer">Café des Sciences</Link>  est une association qui fédère les acteurs et actrices de la vulgarisation scientifique sur le web. Elle regroupe les créateur·rices de blogs, vidéos, illustrations, podcasts, etc. dont la plupart sont à la fois expert·es de leur domaine scientifique et professionnel·les de la médiation scientifique.</p>
                    </div>
                    <img className="about-paragrph-img" src={logo} alt="logo du café des sciences" />
                </div>

                <div className="about-paragraph">
                    <img className="about-paragrph-img" src={groupe} alt="café des science au festival Double Sciences" />
                    <div className="about-paragraph-text">
                    <h2>Une communauté de vulgarisateurs et de vulgarisatrices</h2>
                    <p>L‘association et ses membres conduisent et participent à des actions collectives de vulgarisation. À ce titre, elle organise ou participe à divers projets, comme des événements de culture scientifique ou des festivals de science, a publié un livre collectif (La science à contrepied, Belin, 2017) et accompagne des projets ou des sites destinés à des publics particuliers comme <Link to="https://kidiscience.cafe-sciences.org/" target="blank" rel="noopener noreferrer">Kidiscience</Link> pour les enfants.</p>
                    </div>
                </div>
                <div className="about-paragraph-asso">
                    <h2>Mais c'est avant tout une association !</h2>
                    <p>Le Café des Sciences, fondé en 2028 par Matthieu, Tom Roud et Enro, s'est ancré dans le paysage de la vulgarisation scientifique en ligne. Fondé sur la passion partagée pour la diffusion du savoir scientifique, il s'est structuré en tant qu'association loi 1901, évoluant au fil des années pour devenir une référence. </p>
                    <p>Vous souhaitez rejoindre l'asso ? <Link to="/JoinUs">On vous explique comment ici !</Link> </p>
                    <h3>Composition du bureau pour l’année 2024</h3>
                    <div className="bureau">
                        {DataBureau.map((person) => (
                            <div key={person.id} className="bureau-person">
                                <img src={person.image} alt={`Avatar de ${person.nom}, ${person.fonction}`} />
                                <p>{`${person.nom}, ${person.fonction}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    )
}

// Export de la fonction composant
export default About;