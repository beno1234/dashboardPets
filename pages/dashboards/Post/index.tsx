import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
  postUrl: string;
}

interface EditPostProps {
  post: Post;
}

const mockPost: Post = {
  id: '1',
  title: 'Título do mock',
  createdAt: '16 de maio de 2023',
  summary: 'Resumo do mock',
  postUrl: 'https://blog.com/post/1'
};

const EditPost: React.FC<EditPostProps> = ({ post = mockPost }) => {
  const [editedPost, setEditedPost] = useState(post);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost({
      ...editedPost,
      [event.target.name]: event.target.value
    });
  };

  const handleSaveClick = () => {
    // Adicione o código para salvar as alterações aqui
    console.log('Salvar:', editedPost);
  };

  return (
    <Container maxWidth="sm">
      <Dialog open>
        <DialogTitle>Editar postagem</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            variant="outlined"
            name="title"
            value={editedPost.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Resumo"
            variant="outlined"
            name="summary"
            value={editedPost.summary}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL da postagem completa"
            variant="outlined"
            name="postUrl"
            value={editedPost.postUrl}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditPost;
