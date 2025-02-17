import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import "./ResumeAnalyzer.css";
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const ResumeAnalyzer = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and DOCX files are allowed.');
      return;
    }

    setError('');
    setIsScanning(true);
    extractText(file);
  };

  const extractText = (file) => {
    const fileReader = new FileReader();
    let fileURL = URL.createObjectURL(file); // Generate URL for PDF preview

    if (file.type === 'application/pdf') {
      fileReader.onload = async (event) => {
        const pdfData = new Uint8Array(event.target.result);
        try {
          const pdf = await pdfjsLib.getDocument(pdfData).promise;
          let text = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => item.str).join(' ') + ' ';
          }

          setIsScanning(false);
          navigate("/resume-analyzer-page", { state: { resumeText: text, fileURL } }); // Send extracted text + PDF preview
        } catch (error) {
          setIsScanning(false);
          console.error('Error extracting text from PDF:', error);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileReader.onload = async (event) => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
          setIsScanning(false);
          navigate("/resume-analyzer-page", { state: { resumeText: result.value, fileURL } });
        } catch (err) {
          setIsScanning(false);
          console.error('Error extracting text from DOCX:', err);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileUpload(event.dataTransfer.files[0]);
  };

  return (
    <motion.div className="resume-analyzer">
      <div className='resume-ana-co-top'>
        <h1>Improve Your Resume with AI</h1>
        <span className='fullscreen-ana'>
          <Link to={"/resume-analyzer"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" d="M9 2.5h4.5V7M13.5 2.5 9 7M7 9l-4.5 4.5M7 13.5H2.5V9"/>
            </svg>
          </Link>
        </span>
      </div>

      <p>Upload your resume and get instant AI-powered feedback.</p>

      <motion.div className={`upload-box ${dragging ? 'dragging' : ''}`} 
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input type="file" accept=".pdf,.docx" onChange={(e) => handleFileUpload(e.target.files[0])} hidden ref={fileInputRef} />
        <div className="upload-content">
          <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" d="M12 2v15m0 0 5-5m-5 5-5-5"/>
          </motion.svg>
          <p>Drag & Drop your file here or <span>Click to Upload</span></p>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && <motion.p className="error-message">{error}</motion.p>}
      </AnimatePresence>

      <AnimatePresence>
        {isScanning && <motion.div className="scan-effect">Scanning your resume...</motion.div>}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumeAnalyzer;
