import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

import Link from 'src/components/Link';
import LoginForm from 'src/components/auth/LoginForm';
import RegisterForm from 'src/components/auth/RegisterForm';
import ForgotPasswordForm from 'src/components/auth/ForgotPasswordForm';

const FormContainer = styled(Box)(
  () => `
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
`
);

export default function Hero() {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'login' | 'register' | 'forgotPassword'>(
    'login'
  );
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    // Fazer chamada para autenticação com o servidor
    setLoading(false);
    router.push('/dashboards/HomePage');
  };

  const handleRegister = async () => {
    setLoading(true);
    // Fazer chamada para registro com o servidor
    setLoading(false);
    router.push('/');
  };

  const handleResetPassword = async () => {
    setLoading(true);
    // Fazer chamada para redefinição de senha com o servidor
    setLoading(false);
    setAction('login');
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ height: 'calc(100vh - 64px)' }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pb: 8
        }}
      >
        <Typography variant="h1" align="center" gutterBottom>
          Pets<span style={{ color: 'rgb(245, 133, 37)' }}>Mellon</span>
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          {action === 'login' && (
            <>
              Não tem uma conta ainda?{' '}
              <Link href="#" onClick={() => setAction('register')}>
                Registrar-se
              </Link>
            </>
          )}
          {action === 'register' && (
            <>
              Já tem uma conta?{' '}
              <Link href="#" onClick={() => setAction('login')}>
                Logar
              </Link>
            </>
          )}
          {action === 'forgotPassword' && (
            <>
              Remembered your password?{' '}
              <Link href="#" onClick={() => setAction('login')}>
                Log in
              </Link>
            </>
          )}
        </Typography>
        <FormContainer>
          {action === 'login' && (
            <LoginForm onLogin={handleLogin} loading={loading} />
          )}
          {action === 'register' && (
            <RegisterForm onRegister={handleRegister} loading={loading} />
          )}
          {action === 'forgotPassword' && (
            <ForgotPasswordForm
              onResetPassword={handleResetPassword}
              loading={loading}
            />
          )}
        </FormContainer>
      </Grid>
    </Grid>
  );
}
