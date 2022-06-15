import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api_V2 } from "../../../api";
import IPrato from "../../../interfaces/IPrato";

export default function AdministracaoPratos() {
    const [pratos, setPratos] = useState<IPrato[]>([])

    function excluirPrato(pratoSelect: IPrato) {
        api_V2.delete(`pratos/${pratoSelect.id}/`)
            .then(() => {
                const novaLista = pratos.filter(prato => prato.id !== pratoSelect.id)
                setPratos([...novaLista]);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        api_V2.get<IPrato[]>("pratos/")
            .then(res => setPratos(res.data))
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
                            Tag
                        </TableCell>
                        <TableCell>
                            Imagem
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
                        pratos.map(prato => (
                            <TableRow key={prato.id}>
                                <TableCell >
                                    {prato.nome}
                                </TableCell>
                                <TableCell >
                                    {prato.tag}
                                </TableCell>
                                <TableCell >
                                    [<a href={prato.imagem} target="_blank" rel="noreferrer">Ver Imagem</a>]
                                </TableCell>
                                <TableCell>
                                    [ <Link to={`/admin/pratos/${prato.id}`}>Editar</Link>]
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => excluirPrato(prato)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}