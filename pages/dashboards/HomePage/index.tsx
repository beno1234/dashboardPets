import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/system';

import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Dashboards/Crypto/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { blog } from '@/api/api';
import { CreateBlog } from '@/api/api';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import 'react-quill/dist/quill.snow.css'; // Importe o CSS

const CardWrapper = styled(Card)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(2)};
  `
);

function DashboardCrypto() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogForm, setBlogForm] = useState({
    title: '',
    url_amigavel: '',
    conteudo: '',
    image: null
  });

  const [editorContent, setEditorContent] = useState('');

  const handlePostClick = (post) => {
    setCurrentPost(post);
    setSelectedImage(post.image);
    setOpenEditDialog(true);
  };

  const handleAddPostClick = () => {
    setOpenAddDialog(true);
  };

  const handleDialogClose = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCurrentPost(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setCurrentPost({ ...currentPost, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setBlogForm({ ...blogForm, [name]: value });
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['image', 'video'] // link and image, video
    ]
  };

  const handleEditFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setCurrentPost({ ...currentPost, image: reader.result });
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await blog();
      setBlogPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await CreateBlog(blogForm);
      console.log(response.data); // Você pode tratar a resposta conforme necessário

      // Limpar o formulário
      setBlogForm({
        title: '',
        url_amigavel: '',
        conteudo: '',
        image: null
      });

      // Fechar o diálogo de adição de nova notícia
      setOpenAddDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setBlogForm({ ...blogForm, conteudo: content });
  };

  useEffect(() => {
    if (currentPost) {
      setEditorContent(currentPost.conteudo);
    }
  }, [currentPost]);

  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {blogPosts.map((post) => (
            <CardWrapper
              key={post.uuid}
              sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}
            >
              <CardMedia
                component="img"
                height="140"
                image={post.image}
                alt={post.title}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Publicado em {post.post_day}
                </Typography>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html:
                      post.conteudo.slice(0, 50) +
                      (post.conteudo.length > 50 ? '...' : '')
                  }}
                />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handlePostClick(post)}>
                  Ler mais
                </Button>
              </CardActions>
            </CardWrapper>
          ))}
        </Box>
        <Box
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPostClick}
          >
            Adicionar notícia
          </Button>
        </Box>
        <Dialog
          open={openAddDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Adicionar nova notícia</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Título"
                variant="outlined"
                name="title"
                value={blogForm.title}
                onChange={handleFormChange}
              />
              <Box
                component="label"
                htmlFor="file-upload"
                sx={{
                  display: 'block',
                  padding: '10px',
                  color: '#fff',
                  backgroundColor: '#3f51b5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: 2
                }}
              >
                Clique para fazer upload da imagem
              </Box>
              <input
                accept="image/*"
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={(event) =>
                  setBlogForm({ ...blogForm, image: event.target.files[0] })
                }
              />
              {blogForm.image && (
                <Box sx={{ marginTop: 2 }}>
                  <img
                    src={URL.createObjectURL(blogForm.image)}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '300px' }}
                  />
                </Box>
              )}
              <TextField
                fullWidth
                margin="normal"
                label="url_amigavel (URL amigável)"
                variant="outlined"
                name="url_amigavel"
                value={blogForm.url_amigavel}
                onChange={handleFormChange}
              />

              <ReactQuill
                theme="snow"
                modules={modules}
                style={{ height: '400px' }}
                value={editorContent}
                onChange={handleEditorChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              color="primary"
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar notícia</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Título"
              variant="outlined"
              defaultValue={currentPost?.title}
            />
            {selectedImage && (
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '300px' }}
                />
              </Box>
            )}
            <Box
              component="label"
              htmlFor="file-upload-edit"
              sx={{
                display: 'block',
                padding: '10px',
                color: '#fff',
                backgroundColor: '#3f51b5',
                textAlign: 'center',
                cursor: 'pointer',
                marginTop: 2
              }}
            >
              Clique para fazer upload da imagem
            </Box>
            <input
              accept="image/*"
              id="file-upload-edit"
              type="file"
              style={{ display: 'none' }}
              onChange={handleEditFileUpload}
            />
            <TextField
              fullWidth
              margin="normal"
              label="url_amigavel (URL amigável)"
              variant="outlined"
              defaultValue={currentPost?.url_amigavel}
            />
            <ReactQuill
              theme="snow"
              modules={modules}
              defaultValue={currentPost?.conteudo}
              style={{ height: '400px' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

DashboardCrypto.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardCrypto;
