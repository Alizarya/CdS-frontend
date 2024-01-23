// Import des styles
import "./Regulations.css"

import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

import Statuts from "./Statuts-Cafe-des-Sciences.pdf"
import Reglement from "./Reglement-interieur-du-Cafe-des-Sciences.pdf"
import Charte from "./Charte-Cafe-des-Sciences.pdf"

function Regulations() {

    return (
        <>
        <Header/>
        <main className="main-regulations">
            <h1 className="banner">Statuts et règlement intérieur du café</h1>
            <div className="regulations">
                <p>Vous trouverez ici les statuts de l'association, le règlement intérieur du café, ainsi que la charte de bonne conduite. Tous trois sont disponibles en téléchargement au format PDF. Ces documents sont fondamentaux pour comprendre notre fonctionnement, nos valeurs et notre engagement envers la vulgarisation scientifique. N'hésitez pas à explorer et à télécharger ces fichiers si vous souhaitez en savoir plus sur notre organisation.</p>

                <div className="regulations-pdf">
                    <a href={Statuts} target="_blank" rel="noopener noreferrer" className="regulations-pdf">
                        <i className="fa-solid fa-file-pdf"></i> Les statuts de l’association
                    </a>
                    <a href={Reglement} target="_blank" rel="noopener noreferrer" className="regulations-pdf">
                        <i className="fa-solid fa-file-pdf"></i> Le règlement intérieur de l’association
                    </a>
                    <a href={Charte} target="_blank" rel="noopener noreferrer" className="regulations-pdf">
                        <i className="fa-solid fa-file-pdf"></i> La charte de bonne conduite de l’association
                    </a>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    )
}

// Export de la fonction composant
export default Regulations;