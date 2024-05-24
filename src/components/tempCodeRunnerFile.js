  const handleCheckboxChange = (MatriculeEtd, checked) => {
    if (checked) {
      axios
        .post("http://localhost:3001/postEtds", { matricule: MatriculeEtd })
        .then(() =>
          console.log(`Added ${MatriculeEtd} to the collection presence`)
        )
        .catch((err) => console.log(err));
    }
  };