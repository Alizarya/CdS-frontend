const DataContactFields = [
  {
    className: "contactEntry contactFixed",
    title: "Prénom / Nom / Pseudo",
    type: "text",
    id: "name",
    name: "name",
    value: "",
  },
  {
    className: "contactEntry contactFixed",
    title: "Genre",
    type: "radio",
    id: "gender",
    name: "gender",
    options: [
      { label: "Femme", value: "female" },
      { label: "Homme", value: "male" },
      { label: "Non binaire", value: "nonBinary" },
      { label: "Autre", value: "other" },
    ],
    value: "",
  },

  {
    className: "contactEntry contactFixed",
    title: "Adresse e-mail",
    type: "email",
    id: "email",
    name: "email",
    value: "",
  },
  {
    className: "contactEntry contactFixed",
    title: "Objet du message",
    type: "text",
    id: "subject",
    name: "subject",
    value: "",
  },
  {
    className: "contactEntry contactMessage",
    title: "Message",
    type: "textarea",
    id: "message",
    name: "message",
    value: "",
  },
];

export default DataContactFields;
