import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Filter from "./components/Filter";
import AddForm from "./components/AddForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();

    //Check if added name is already in DB.
    const nameExists = persons.some(
      (person) => newName.toLowerCase() === person.name.toLowerCase()
    );
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    //Add person to DB.
    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    personsService.create(newPersonObject).then((response) => {
      //Update persons state.
      const personsCopy = [...persons, response.data];
      setPersons(personsCopy);

      //Reset states.
      setNewName("");
      setNewNumber("");
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter)
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter} />

      <h2>add a new</h2>
      <AddForm
        handleAddPerson={handleAddPerson}
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
