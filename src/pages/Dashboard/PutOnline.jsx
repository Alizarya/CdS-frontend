import React, { useState } from "react";

const PutOnline = ({ memberData, updateMember, fetchMembersData }) => {
    const [isPublished, setIsPublished] = useState(memberData?.softDelete === false);

    const handleTogglePublish = async () => {
        if (!memberData) return;

        const updatedMemberData = { ...memberData, softDelete: isPublished }; 

        try {
            const response = await updateMember(memberData._id, updatedMemberData);  
            if (response && response.member) {
                setIsPublished(!isPublished);
            }

            await fetchMembersData();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la publication du membre", error);
        }
    };

    return (
        <div className="dashboard-publish">
            {isPublished ? (
                <>
                    <p>
                        Actuellement, ta carte de créateur·ice est en ligne. <br />
                        Souhaites-tu la dépublier ?
                    </p>
                    <button className="button-cta seventy" onClick={handleTogglePublish}>
                        Retirer la mise en ligne de ta carte
                    </button>
                </>
            ) : (
                <>
                    <p>
                        Actuellement, ta carte de créateur·ice n'est pas en ligne. <br />
                        Souhaites-tu la publier ?
                    </p>
                    <button className="button-cta seventy" onClick={handleTogglePublish}>
                        Mettre en ligne
                    </button>
                </>
            )}
        </div>
    );
};

export default PutOnline;
