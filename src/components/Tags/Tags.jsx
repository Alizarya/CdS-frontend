// Import des styles
import "./Tags.css";

function Tags({ tags, searchTerm, onTagClick, allMembers }) {
    let tagsToDisplay = tags;

    // Si `allMembers` est fourni, on affiche tous les tags
    if (allMembers) {
        let allTags = [];
        allMembers.forEach((member) => {
            allTags = allTags.concat(member.tags);
        });
        tagsToDisplay = [...new Set(allTags)]; // Supprime les doublons
    }

    const handleTagClick = (tag) => {
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    return (
        <div className="tags-container">
            <ul className="tags-list">
                {tagsToDisplay.map((tag, index) => (
                    <li
                        key={index}
                        className={`tag-item ${searchTerm && tag ? searchTerm.toLowerCase().includes(tag.toLowerCase()) ? 'active' : '' : ''}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tags;
