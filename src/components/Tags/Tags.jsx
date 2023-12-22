// Import des styles
import "./Tags.css"

// Import des données 
import DataMembers from "../../data/DataMembers"

function Tags({ memberId }) {
    let tagsToDisplay = [];

    if (memberId) {
        const member = DataMembers.find(member => member.id === memberId);
        tagsToDisplay = member ? member.tags : [];
    } else {
        let allTags = [];
        DataMembers.forEach(member => {
            allTags = allTags.concat(member.tags);
        });
        tagsToDisplay = [...new Set(allTags)];
    }

    return (
        <div className="tags-container">
            <ul className="tags-list">
                {tagsToDisplay.map((tag, index) => (
                    <li key={index} className="tag-item">
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tags;