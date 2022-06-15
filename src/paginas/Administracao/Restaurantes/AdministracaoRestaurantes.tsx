import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api_V2 } from "../../../api";
import IRestaurante from "../../../interfaces/IRestaurante";

export default function AdministracaoRestaurantes() {
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

    function excluirRestaurante(restauranteSelect: IRestaurante) {
        api_V2.delete(`restaurantes/${restauranteSelect.id}/`)
            .then(() => {
                const novaLista = restaurantes.filter(restaurante => restaurante.id !== restauranteSelect.id)
                setRestaurantes([...novaLista]);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        api_V2.get<IRestaurante[]>("restaurantes/")
            .then(res => setRestaurantes(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Nome
                        </TableCell>
                        <TableCell>
                            Editar
                        </TableCell>
                        <TableCell>
                            Excluir
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        restaurantes.map(restaurante => (
                            <TableRow key={restaurante.id}>
                                <TableCell >
                                    {restaurante.nome}
                                </TableCell>
                                <TableCell>
                                    [ <Link to={`/admin/restaurantes/${restaurante.id}`}>Editar</Link>]
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => excluirRestaurante(restaurante)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}