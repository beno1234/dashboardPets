import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export const blog = async (values) => {
  return await api.get('/blog', values);
};

export const CreateBlog = async (values) => {
  const form = new FormData();
  form.append('title', values.title);
  form.append('url_amigavel', values.url_amigavel);
  form.append('conteudo', values.conteudo);

  form.append('image', values.image);

  return await api.post('/blog', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
