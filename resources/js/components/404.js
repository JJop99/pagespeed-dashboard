// mui
import { Box, Button, Container, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// react
import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <>
    <head>
      <title>
        404 | Material Kit
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
            color="textPrimary"
            variant="h1"
          >
            404
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="h3"
          >
            The page you are looking for isn’t here
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle2"
          >
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
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

export default PageNotFound;
