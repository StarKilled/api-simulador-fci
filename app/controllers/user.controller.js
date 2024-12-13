exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.docenteBoard = (req, res) => {
    res.status(200).send("Docente Content.");
  };

  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.certificadorBoard = (req, res) => {
    res.status(200).send("Certificador Content.");
  };

 