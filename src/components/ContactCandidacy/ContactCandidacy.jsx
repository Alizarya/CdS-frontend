// Import des styles
import "./ContactCandidacy.css"

import React, { useState } from 'react';

const ContactCandidacy = () => {
    const [reponse1, setReponse1] = useState('');
    const [reponse2, setReponse2] = useState('');
    const [reponse3, setReponse3] = useState('');
    const [reponse4, setReponse4] = useState('');
    const [nom, setNom] = useState('');
    const [genre, setGenre] = useState('');
    const [adresseMail, setAdresseMail] = useState('');
    const [nomContenu, setNomContenu] = useState('');
    const [lien, setLien] = useState('');
    const [liensRS, setLiensRS] = useState('');
    const [motivations, setMotivations] = useState('');
  
    const handleReponse1Change = (e) => {
      setReponse1(e.target.value);
    };
  
    const handleReponse2Change = (e) => {
      setReponse2(e.target.value);
    };
  
    const handleReponse3Change = (e) => {
      setReponse3(e.target.value);
    };
  
    const handleReponse4Change = (e) => {
      setReponse4(e.target.value);
    };
  
    const handleNomChange = (e) => {
      setNom(e.target.value);
    };
  
    const handleGenreChange = (e) => {
      setGenre(e.target.value);
    };
  
    const handleAdresseMailChange = (e) => {
      setAdresseMail(e.target.value);
    };
  
    const handleNomContenuChange = (e) => {
      setNomContenu(e.target.value);
    };
  
    const handleLienChange = (e) => {
      setLien(e.target.value);
    };
  
    const handleLiensRSChange = (e) => {
      setLiensRS(e.target.value);
    };
  
    const handleMotivationsChange = (e) => {
      setMotivations(e.target.value);
    };

  return (
    <div>
      <div className="joinus-form-question question1">
        <label>Vous êtes créateurs ou créatrice de contenus et vous souhaitez que le café des sciences partage votre travail  </label>
        <div className="joinus-form-radiobtn">
            <label>
            Oui
            <input
                type="radio"
                value="oui"
                checked={reponse1 === 'oui'}
                onChange={handleReponse1Change}
            />
            </label>
            <label>
            Non
            <input
                type="radio"
                value="non"
                checked={reponse1 === 'non'}
                onChange={handleReponse1Change}
            />
            </label>
        </div>
      </div>

      {reponse1 === 'non' && (
        <p className="negative">Nous vous invitons à proposer votre aide via une demande de recommandation, voire ci-dessous.</p>
      )}

      {reponse1 === 'oui' && (
        <div className="joinus-form-question question2">
          <label>Vous créez du contenu depuis plus de six mois ? </label>
          <div className="joinus-form-radiobtn">
            <label>
                Oui
                <input
                type="radio"
                value="oui"
                checked={reponse2 === 'oui'}
                onChange={handleReponse2Change}
                />
            </label>
            <label>
                Non
                <input
                type="radio"
                value="non"
                checked={reponse2 === 'non'}
                onChange={handleReponse2Change}
                />
            </label>
            </div>
        </div>
      )}

      {reponse2 === 'non' && (
        <p className="negative">Malheureusement vous ne créez pas de contenus depuis assez de temps pour pouvoir candidater. Revenez vers nous dans quelques mois.</p>
      )}

      {reponse2 === 'oui' && (
        <div className="joinus-form-question question3">
            <label>Quel type de contenus partagez vous ?</label>
            <div className="joinus-form-radiobtn">
                <label>
                    Vidéo
                    <input
                    type="radio"
                    value="Vidéo"
                    checked={reponse3 === 'Vidéo'}
                    onChange={handleReponse3Change}
                    />
                </label>
                <label>
                    Blog
                    <input
                    type="radio"
                    value="Blog"
                    checked={reponse3 === 'Blog'}
                    onChange={handleReponse3Change}
                    />
                </label>
                <label>
                    Podcast
                    <input
                    type="radio"
                    value="Podcast"
                    checked={reponse3 === 'Podcast'}
                    onChange={handleReponse3Change}
                    />
                </label>
                <label>
                    Autre
                    <input
                    type="radio"
                    value="Autre"
                    checked={reponse3 === 'Autre'}
                    onChange={handleReponse3Change}
                    />
                </label>
            </div>
        </div>
      )}

      {reponse3 === 'Vidéo' || reponse3 === 'Blog' || reponse3 === 'Podcast' || reponse3 === 'Autre' ? (
        <div className="joinus-form-question question4">
          <label>Combien de contenus avez-vous à votre actif </label>
          <input
            type="number"
            value={reponse4}
            onChange={handleReponse4Change}
          />
          {reponse4 >= 6 ? (
            <div className="joinus-form-info">
                <label>Nom, Prénom, Pseudo*: </label>
                <input type="text" value={nom} onChange={handleNomChange} />
                
                <label>Genre: </label>
                <label>
                Femme
                <input
                    type="radio"
                    value="femme"
                    checked={genre === 'femme'}
                    onChange={handleGenreChange}
                />
                </label>
                <label>
                Homme
                <input
                    type="radio"
                    value="homme"
                    checked={genre === 'homme'}
                    onChange={handleGenreChange}
                />
                </label>
                <label>
                Non-binaire
                <input
                    type="radio"
                    value="non-binaire"
                    checked={genre === 'non-binaire'}
                    onChange={handleGenreChange}
                />
                </label>
                <label>
                Autre
                <input
                    type="radio"
                    value="autre"
                    checked={genre === 'autre'}
                    onChange={handleGenreChange}
                />
                </label>
            
                <label>Adresse mail: </label>
                <input type="email" value={adresseMail} onChange={handleAdresseMailChange} />
            
                <label>Nom du contenu*: </label>
                <input type="text" value={nomContenu} onChange={handleNomContenuChange} />
            
                <label>Lien*: </label>
                <input type="url" value={lien} onChange={handleLienChange} />
            
                <label>Liens RS*: </label>
                <input type="text" value={liensRS} onChange={handleLiensRSChange} />
            
                <label>Motivations*: </label>
                <textarea value={motivations} onChange={handleMotivationsChange} />
          </div>
          
          ) : (
            reponse4 !== '' && <p className="negative">Malheureusement votre nombre de contenus est insuffisant.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ContactCandidacy;
