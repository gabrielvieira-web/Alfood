import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioPrato = () => {
  const parametros = useParams();

  const [pratos, setPratos] = useState<IPrato[]>([])

  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");

  const [tags, setTags] = useState<ITag[]>([])
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

  const [tag, setTag] = useState('')
  const [restaurante, setRestaurante] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
      .then(resposta => {
        setTags(resposta.data.tags)
      })
    
    http.get<IRestaurante[]>('restaurantes/')
      .then(resposta => {
        setRestaurantes(resposta.data)
      })

    http.get<IPrato[]>('pratos/')
      .then(resposta => {
        setPratos(resposta.data)
      })
  }, [])

  useEffect(() => {
    const temPratoId = pratos.find(prato => prato.id === Number(parametros.id))

    if(temPratoId) {
      http
        .get<IPrato>(`pratos/${parametros.id}/`)
        .then((resposta) => {
          setNomePrato(resposta.data.nome) 
          setDescricao(resposta.data.descricao)
          setTag(resposta.data.tag)
        });
    }

  }, [parametros,pratos]);

  const selecionaArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if(evento.target.files?.length) {
      setImagem(evento.target.files[0])
    } else {
      setImagem(null)
    }
  }

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const formData = new FormData();

    
    formData.append('nome', nomePrato)
    formData.append('descricao', descricao)
    formData.append('tag', tag)
    formData.append('restaurante', restaurante)
    if(imagem) {
      formData.append('imagem', imagem)
    }

    if(parametros.id) {
      http.request({
        url: `pratos/${parametros.id}/`,
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then(() => {
        alert('Prato atualizado com sucesso!')
      })
    } else {
      http.request({
        url: 'pratos/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
        .then(() => {
          setNomePrato('')
          setDescricao('')
          setTag('')
          setRestaurante('')
          setImagem(null)
          alert('Prato cadastrado com sucesso!')
        })
        .catch(erro => console.log(erro))
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Typography component="h1" variant="h6">
        Formulário de pratos
      </Typography>
      <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
        <TextField
          value={nomePrato}
          onChange={(evento) => setNomePrato(evento.target.value)}
          label="Nome do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          label="Descrição do Prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag">Tags</InputLabel>
          <Select
            labelId="select-tag"
            value={tag}
            onChange={evento => setTag(evento.target.value)}
          >
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.value}>{tag.value}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurantes</InputLabel>
          <Select
            labelId="select-restaurante"
            value={restaurante}
            onChange={evento => setRestaurante(evento.target.value)}
          >
            {restaurantes.map(restaurante => (
              <MenuItem key={restaurante.id} value={restaurante.id}>{restaurante.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type="file" onChange={selecionaArquivo}/>

        <Button
          sx={{ marginTop: 1 }}
          type="submit"
          fullWidth
          variant="outlined"
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioPrato;
