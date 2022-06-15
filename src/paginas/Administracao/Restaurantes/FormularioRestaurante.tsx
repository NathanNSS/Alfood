import { useEffect, useState } from "react";

import { Alert, AlertTitle, AppBar, Box, Button, Container, Link, Paper, TextField, Toolbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import { api_V2 } from "../../../api";

export default function FormularioRestaurante() {
    const [nomeRestaurante, setNomeRestaurantes] = useState("");

    const parametros = useParams();

    function aoSubmeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (parametros.id) {
            api_V2.put(`restaurantes/${parametros.id}/`, { nome: nomeRestaurante })
                .then(() => (
                    <Alert severity="success">
                        <AlertTitle>Sucesso</AlertTitle>
                        {`Restaurante ${nomeRestaurante} Editado com Sucesso`}
                    </Alert>
                ))
                .catch(err => console.log(err));
        } else {
            api_V2.post("restaurantes/", { nome: nomeRestaurante })
                .then(() => (
                    <Alert severity="success">
                        <AlertTitle>Sucesso</AlertTitle>
                        {`Restaurante ${nomeRestaurante} Criado com Sucesso`}
                    </Alert>
                ))
                .catch(err => console.log(err));
        }
    }

    useEffect(() => {
        if (parametros.id) {
            api_V2.get<IRestaurante>(`restaurantes/${parametros.id}/`)
                .then(res => setNomeRestaurantes(res.data.nome));
        }
    }, [parametros])

    return (

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formuario de Restaurante</Typography>
            <Box component="form" onSubmit={aoSubmeterForm} sx={{ width: "100%" }}>
                <TextField
                    onChange={e => setNomeRestaurantes(e.target.value)}
                    value={nomeRestaurante}
                    variant="standard"
                    label="Nome do Restaurante"
                    fullWidth
                    required
                />
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