import { Typography, Grid } from '@mui/material';

function PageHeader() {
  const user = {
    name: 'Beno Lopes Dias'
  };

  return (
    <Grid container alignItems="center">
      <Grid item></Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Bem - Vindo, {user.name}!
        </Typography>
        <Typography variant="subtitle2">Blog</Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
