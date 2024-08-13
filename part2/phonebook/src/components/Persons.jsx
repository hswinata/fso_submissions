import Person from "./Person";

const Persons = ({ filteredPersons, handleDeletePerson }) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDeletePerson={handleDeletePerson}
        />
      ))}
    </ul>
  );
};

export default Persons;
