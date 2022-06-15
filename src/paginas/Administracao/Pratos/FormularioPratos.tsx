import { useEffect, useState } from "react";

import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import { api_V2 } from "../../../api";
import ITag from "../../../interfaces/ITag";

export default function FormularioPrato() {
    const [nomePrato, setNomePrato] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tag, setTag] = useState("");
    const [restaurante, setRestaurante] = useState("");
    const [imagem, setImagem] = useState<File | null>(null);

    const [tags, setTags] = useState<ITag[]>([]);
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    const parametros = useParams();

    function aoSubmeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        const formData = new FormData();

        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', restaurante);
        
        if(imagem){
            formData.append('imagem', imagem);
        }
        

        if (parametros.id) {
            api_V2.put(`pratos/${parametros.id}/`, { nome: nomePrato })
                .then(() => (
                    <Alert severity="success">
                        <AlertTitle>Sucesso</AlertTitle>
                        {`Restaurante ${nomePrato} Editado com Sucesso`}
                    </Alert>
                ))
                .catch(err => console.log(err));
        } else {
            api_V2.request({
                url: 'pratos/',
                method: 'POST',
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })
                .then(() => (
                    <Alert severity="success">
                        <AlertTitle>Sucesso</AlertTitle>
                        {`Prato ${nomePrato} Criado com Sucesso`}
                    </Alert>
                ))
                .catch(err => console.log(err));
        }
    }
    
    function selecionarArquivo(evento: React.ChangeEvent<HTMLInputElement>){
        if(evento.target.files?.length){
            setImagem(evento.target.files[0])
        }else{
            setImagem(null)
        }
    }

    useEffect(() => {
        api_V2.get<{ tags: ITag[] }>('tags/')
            .then(res => setTags(res.data.tags))
            .catch(err => console.log(err));

        api_V2.get<IRestaurante[]>('restaurantes/')
            .then(res => setRestaurantes(res.data))
            .catch(err => console.log(err));
        
    }, [])

    useEffect(() => {
        if (parametros.id) {
            console.log('getpratos')
            console.log(parametros)
            api_V2.get<IRestaurante>(`pratos/${parametros.id}/`)
                .then(res => setNomePrato(res.data.nome));
        }
    }, [parametros])


    return (

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formuario de Prato</Typography>
            <Box component="form" onSubmit={aoSubmeterForm} sx={{ width: "100%" }}>
                <TextField
                    onChange={e => setNomePrato(e.target.value)}
                    value={nomePrato}
                    variant="standard"
                    label="Nome do Prato"
                    margin="dense"
                    fullWidth
                    required
                />

                <TextField
                    onChange={e => setDescricao(e.target.value)}
                    value={descricao}
                    variant="standard"
                    label="Descrição do Prato"
                    margin="dense"
                    fullWidth
                    required
                />

                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={e => setTag(e.target.value)}>
                        {tags.map(tag => (
                            <MenuItem key={tag.id} value={tag.value}>
                                {tag.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-restaurante">Restaurante</InputLabel>
                    <Select labelId="select-restaurante" value={restaurante} onChange={e => setRestaurante(e.target.value)}>
                        {restaurantes.map(restaurante => (
                            <MenuItem key={restaurante.id} value={restaurante.id}>
                                {restaurante.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input type="file" onChange={selecionarArquivo} />
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: 1 }}
                >
                    Enviar
                </Button>
            </Box>
        </Box>

    )
}