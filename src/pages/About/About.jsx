// Import des styles
import "./About.css"

import Header from "../../components/Header/Header"
import logo from "./logo banniere café des sciences.jpg"
import groupe from "./louise sudour.png"
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
                        <p>Pour le grand public, le Café des Sciences représente avant tout un site web, celui-ci même que vous parcourez actuellement. Il agglomère une diversité de contenus dédiés à la vulgarisation scientifique sous des formats divers et variés. Chaque contributeur et chaque contributrice présente sur ce site voit sa production soumise à une évaluation rigoureuse, garantissant ainsi la fiabilité des informations présentées. Il est toutefois important de noter que les vulgarisateurs et vulgarisatrices, bien que passionné·e·s, sont souvent des amateurs et des amatrices et ne possèdent pas toujours une expertise spécialisée dans les domaines qu'ils et elles  abordent.</p>
                    </div>
                    <img className="about-paragrph-img" src={logo} alt="logo du café des sciences" />
                </div>

                <div className="about-paragraph">
                    <img className="about-paragrph-img" src={groupe} alt="café des science au festival Double Sciences" />
                    <div className="about-paragraph-text">
                    <h2>Une communauté de vulgarisateurs et de vulgarisatrices</h2>
                    <p>En parallèle de sa présence en ligne, le Café des Sciences constitue également une communauté dynamique de vulgarisateurs et de vulgaristrices. Cette communauté s'engage dans des échanges sur l'actualité de la médiation scientifique et coordonne divers projets, tels que des festivals scientifiques, la publication de recueils collectifs, ainsi que la conception de sites web dédiés à des publics spécifiques, à l'instar de <Link to="https://kidiscience.cafe-sciences.org/" target="blank" rel="noopener noreferrer">Kidiscience</Link> destiné aux enfants.</p>
                    </div>
                </div>
                <div className="about-paragraph-asso">
                    <h2>Mais c'est aussi une association !</h2>
                    <p>Le Café des Sciences, initiative lancée il y a plus de 10 ans par Matthieu, Tom Roud et Enro, s'est ancré dans le paysage de la vulgarisation scientifique en ligne. Fondé sur la passion partagée pour la diffusion du savoir scientifique, il s'est structuré en tant qu'association loi 1901, évoluant au fil des années pour devenir une référence. </p>
                    <p>Vous souhaitez rejoindre l'asso ? <Link to="/JoinUs">On vous explique comment ici !</Link> </p>
                    <h3>Composition du bureau pour l’année 2024</h3>
                    <p className="padisparaitre">(En attente de confirmation de vote)</p>
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