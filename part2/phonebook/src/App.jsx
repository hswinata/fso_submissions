import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Filter from "./components/Filter";
import AddForm from "./components/AddForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notification, setNotification] = useState(null);

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
      const confirmUpdateNumber = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one ?`
      );
      if (confirmUpdateNumber) {
        const personObject = persons.find((person) => person.name === newName);

        personsService
          .updateNumber(personObject.id, { ...personObject, number: newNumber })
          .then((response) => {
            //Update persons state.
            const personsCopy = persons.map((person) =>
              person.id === response.data.id ? response.data : person
            );
            setPersons(personsCopy);

            //Reset states
            setNewName("");
            setNewNumber("");

            //Notification.
            setNotification(
              `Updated ${response.data.name} with ${response.data.number}`
            );
            setTimeout(() => {
              setNotification(null);
            }, 4000);
          });
      }
      return;
    }

    //Add person to DB.
    const idGenerator = () => {
      return persons.length === 0
        ? "1"
        : (Number(persons[persons.length - 1]["id"]) + 1).toString();
    };

    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: idGenerator(),
    };

    personsService.create(newPersonObject).then((response) => {
      //Update persons state.
      const personsCopy = [...persons, response.data];
      setPersons(personsCopy);

      //Reset states.
      setNewName("");
      setNewNumber("");

      //Notification.
      setNotification(`Added ${response.data.name}`);
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    });
  };

  const handleDeletePerson = (personObject) => {
    //Delete persons from DB.
    const confirmDelete = window.confirm(`Delete ${personObject.name} ?`);
    confirmDelete &&
      personsService.deletePerson(personObject.id).then(() => {
        //Update persons state.
        const personsCopy = persons.filter(
          (person) => person.id !== personObject.id
        );
        setPersons(personsCopy);
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
      <Notification notification={notification} />
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
      <Persons
        filteredPersons={filteredPersons}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
