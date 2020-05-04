(function() {
  const inputFile = document.getElementById("inputFile");
  /*
   * Adding "change" action listen to file input element
   * Callback function will be called whenever user chooses new image
   */
  inputFile.addEventListener("change", function(e) {
    uploadFile(e);
  });

  /*
   * Here's where the magic happens!!!
   * Graphql file upload using vanilla GraphQL.js API.
    - https://stackoverflow.com/questions/59043021/how-do-i-upload-files-to-a-graphql-backend-implemented-using-graphql-upload-usin
    - https://github.com/jaydenseric/graphql-multipart-request-spec
   */
  function uploadFile(e) {
    // Creating the FormData Instance
    const formData = new FormData();

    const query = `
      mutation UploadFile($file: Upload!) {
        uploadFile(file: $file)
      }
    `;

    /*
     * The value of this field will be a JSON string containing the GraphQL query and variables.
       You must set all file field in the variables object to null e.g:
    */
    const operations = JSON.stringify({ query, variables: { file: null } });
    formData.append("operations", operations);

    /*
     * As its name implies, the value of this field will be a JSON string of an object whose
      keys are the names of the field in the FormData instance containing the files.
      The value of each field will be an array containing a string indicating to which field in the
      variables object the file, corresponding to value's key, will be bound to e.g:
    */
    const map = {
      "0": ["variables.file"]
    };
    formData.append("map", JSON.stringify(map));

    /*
     * The files to upload You then should add the files to the FormData instance as per the map. In this case;
     * Using the file at index zero if multiple files are uploaded
     */
    formData.append("0", e.target.files[0]);

    /*
    * And that is it.
      You are now ready to make the request to your backend using
      axios and the FormData instance:
    */
    axios({
      url: "/graphql",
      method: "post",
      data: formData
    })
      .then(({ data: { data: uploadFile } }) => {
        uploadFile
          ? alert("File uploaded! Yayyy! Check you server root folder")
          : alert("Something went wrong");
      })
      .catch(err => alert("Something went wrong"));
  }
})();
