import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PdfView from "../Components/PdfView";


function Home() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.currentUser;

  const accesstoken = user?.token;
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [allPdfs, setAllPdfs] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error("Please select a PDF file");
      setFile("");
    }
   
  };
  const getPdf = async () => {
    try {
      const result = await axios.get("/pdf/getPdf", {
        headers: {
          "Content-Type": "application/json",
          token: accesstoken,
        },
      });

      setAllPdfs(result.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    
    getPdf();
  }, []);


  const handleCloseModal = () => {
    setSelectedPdf(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !title) {
      toast.warning("Please select a file and provide a title");
   
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const response = await axios.post("/pdf/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: accesstoken,
      },
    });
    setFile("");
    setTitle("");
    getPdf();

    toast.success(response.data);
    
  };
  
  const showPdf = (pdf) => {
    const pdfUrl = `https://pdf-project.onrender.com/api/files/${pdf}`; 
    setSelectedPdf(pdfUrl);
  };
 
  
 
  return (
    <>
      <CssBaseline />

      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "auto",
          marginTop: "5vh",
        }}
      >
        <Box sx={{ border: 2, width: "90%", marginTop: 5, padding: "10px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 2 }}>File Upload </h4>
            <TextField
              style={{ marginBottom: "20px", width: "50%" }}
              id="standard-basic"
              label="Name "
              variant="standard"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="file"
              onChange={handleChange}
           
              required
              style={{ marginBottom: "20px", width: "50%" }}
            />
            <button type="submit" style={{ width: "50%" }}>
              Upload
            </button>
          </form>
        </Box>
      </Container>
      <ToastContainer />
      <Container
        maxWidth="sm"
        style={{ display: "flex", justifyContent: "center", }}
      >
        <Box
          sx={{
            border: 2,
            overflowY: "auto",
            
            width: "90%",
            marginTop: 5,
            padding: "20px",
          }}
        >
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {allPdfs?.map((item) => (
              <ListItem
                key={item._id}
                disableGutters
                secondaryAction={
                  <Button
                
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ m: 1 }}
                    onClick={() => showPdf(item.pdf)}
                  >
                    {`Open`}
                  </Button>
                }
              >
                <ListItemText primary={` ${item.title} `} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>

      {selectedPdf && (
        <PdfView
          selectedPdf={selectedPdf}
          handleCloseModal={handleCloseModal}
          getPdf={getPdf}
        />
      )}
    </>
  );
}

export default Home;
