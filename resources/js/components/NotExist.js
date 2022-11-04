//import Head from 'next/head';
//import NextLink from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const NotExist = () => (
  <>
    <head>
      <title>
        NotExist
      </title>
    </head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            color="textError"
            variant="h1"
          >
            Error
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="h3"
          >
            The page you are looking for doesn't exist, it might be deleted.
          </Typography>
          
          
          <Link
            to='/'
          >
            <Button
              component="a"
              startIcon={(<ArrowBackIcon fontSize="small" />)}
              sx={{ mt: 3 }}
              variant="contained"
            >
              Go back to home page
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  </>
);

export default NotExist;
