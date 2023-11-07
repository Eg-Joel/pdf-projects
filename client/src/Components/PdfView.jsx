import React, { useState } from "react";
import { Modal, Container, Box, Button } from "@mui/material";
import { Document, Page,pdfjs  } from "react-pdf"
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import TextField from "@mui/material/TextField";
import jsPDF from "jspdf";
import axios from '../utils/axios'
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfView({ selectedPdf, handleCloseModal, getPdf  }) {
  const [open, setOpen] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] =useState(1)
  const [selectedPages, setSelectedPages] = useState({ [pageNumber]: false });
  const [title, setTitle] = useState("");

  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.currentUser;

  const accesstoken = user?.token;

  const handleClose = () => {
    setOpen(false);
    handleCloseModal();
  }
  function onDocumentSuccess({numPages}){
    setNumPages(numPages)
  }
  const prevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
  }
   
  const nextPage = ()=>{
     setPageNumber(pageNumber + 1 >= numPages ? pageNumber : pageNumber + 1)
  }

  const toggleSelectedPage = (page) => {
    setSelectedPages((prevSelectedPages) => ({
      ...prevSelectedPages,
      [page]: !prevSelectedPages[page],
    }));
  };

  const createPdf = async () => {
    
    const images = [];
    const doc = new jsPDF();
    try {
    
      const loadingTask = pdfjs.getDocument(selectedPdf);
      const pdf = await loadingTask.promise;
      
   
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const pageNum = parseInt(pageNumber);
       
          const page = await pdf.getPage(pageNum);
         

          const canvas = document.createElement("canvas");
          const scaleFactor = 2
          const viewport = page.getViewport({ scale: scaleFactor });
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          const image = canvas.toDataURL("image/jpeg");
          images.push(image);
       
      }
      for (let i = 0; i < images.length; i++) {
        doc.addImage(images[i], "JPEG", 10, 10, 200, 200); 
        if (i !== images.length - 1) {
          doc.addPage();
        }
      }
  
      const pdfData = doc.output("blob");

   
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", pdfData, "newPdf.pdf");

  const response = await axios.post("/pdf/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      token: accesstoken,
    },
  });
 
  setTitle("");
  toast.success(response.data);
  getPdf()
  handleCloseModal();

  } catch (error) {
    console.error("Error loading PDF:", error);
  }
  };
  return (
    <>
       <ToastContainer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{  overflowY: "auto",}} 
      >
        <Container
          maxWidth="sm"
          style={{
            width: "90vw",
          
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ border: 2, p: 2, backgroundColor: "white", }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <div>
            <Button size="small" onClick={prevPage}>
                prev
              </Button>
              <Button size="small" onClick={nextPage}>
                next
              </Button>
            </div>
            
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <div style={{ minHeight: '50vh' }}>
            <Document
              file={selectedPdf}
              onLoadSuccess={onDocumentSuccess}
            >
              
                <Page
                    pageNumber={pageNumber}
                    
                    renderTextLayer={false}
                    renderInteractiveForms={false} 
                    renderAnnotationLayer={false} 
                  />
            </Document>
            <label>
                <input
                  type="checkbox"
                  checked={selectedPages[pageNumber]}
                  onChange={() => toggleSelectedPage(pageNumber)}
                />
                Page {pageNumber}
              </label>
            </div>
            <TextField
              style={{ marginBottom: "20px", width: "50%" }}
              id="standard-basic"
              label="Name "
              variant="standard"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant="contained" onClick={createPdf}>
              Create New PDF
            </Button>
          </Box>
        </Container>
      </Modal>
      
      
    </>
  );
}

export default PdfView;
