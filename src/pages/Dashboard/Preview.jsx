import React from "react";
import CardPrev from "../../components/Card/CardPrev";

const Preview = ({ memberData }) => {
    if (!memberData) {
        return <p>Aucun membre trouvé.</p>;
    }

    return (
        <div className="dashboard-header">
            <h2>Prévisualisation de ta carte</h2>
            <CardPrev member={memberData} />
        </div>
    );
};

export default Preview;
