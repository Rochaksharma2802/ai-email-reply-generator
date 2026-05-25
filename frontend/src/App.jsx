import { useState } from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import './App.css'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
function App() {

  const[emailContent, setEmailContent] = useState("");
  const[tone,setTone] = useState("");
  const[generatedReply, setGeneratedReply] = useState("");
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState("");

  const handleSubmit = async()=>{
     setLoading(true)
     setError('')
     try{

      const response = await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data ==="string"? response.data: JSON.stringify(response.data))
    }
     catch(error){
      setError("Failed to generate Reply, please Try again")
      console.log(error)
     }
     finally{
      setLoading(false);
     }

  }

  return (
    <>
      <Container maxWidth ="md" sx={{py:4}}>
          <Typography
          variant='h3'
          component='h1'
          gutterBottom
          >
            Email Reply Generator
          </Typography>
      </Container>
      <Box sx={{mx:3,mt:3}}>
      <TextField
      fullWidth
      multiline
      rows={6}
      variant='outlined'
      label='Original Email Content'
      value={emailContent|| ""}
      onChange={(e)=> setEmailContent(e.target.value)}
      />
      <FormControl
      fullWidth
      sx={{mb:2}}
       >
        <InputLabel>
        Tone(Optional)
        </InputLabel>
        <Select 
        value={tone || ""}
        onChange={(e)=> setTone(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="Profesional">Profesional</MenuItem>
          <MenuItem value="Casual">Casual</MenuItem>
          <MenuItem value="Friendly">Friendly</MenuItem>
        </Select>
      </FormControl>
      </Box>
      {error &&  <Typography
          color='error'
         sx={{mb:2}}
          >
            {error}
          </Typography>}
      <Button
      variant='contained'
      onClick={handleSubmit} 
      disabled = {loading || !emailContent}
      fullWidth
      >
        {loading?<CircularProgress size={24}/>: "Generate Reply"}
      </Button>
      {generatedReply && (
        <Box sx={{mt:3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply
          </Typography>
          <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply || ""}
          inputProps={{readOnly: true}}
          />

          <Button
          variant='outlined'
          sx={{mt:2}}
          onClick={()=> navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}

    </>
  )
}

export default App
