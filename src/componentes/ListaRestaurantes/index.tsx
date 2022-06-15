import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Box, Button, InputLabel, MenuItem, Select, TextField, } from '@mui/material';
//import SearchIcon from '@mui/icons-material/Search';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

interface IParametrosBusca {
    ordering?: string
    search?: string
}

const ListaRestaurantes = () => {

    const [restaurantes, setRestaurante] = useState<IRestaurante[]>([])
    const [proximaPagina, setProximaPagina] = useState<string>("")
    const [paginaAnterior, setPaginaAnterior] = useState<string>("")

    const [busca, setBusca] = useState<string>("")
    const [ordenacao, setOrdenacao] = useState<string>("")

    function carregarDados(url: string, opcoes: AxiosRequestConfig = {}) {
        axios.get<IPaginacao<IRestaurante>>(url, opcoes)
            .then(res => {
                console.log(res);
                setRestaurante(res.data.results);
                setProximaPagina(res.data.next);
                setPaginaAnterior(res.data.previous);
            })
            .catch(err => {
                console.log(err);
            })
    }

    function buscar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        const opcoes = {
            params: {

            } as IParametrosBusca
        }

        if (busca) {
            opcoes.params.search = busca;
        }
        if (ordenacao) {
            opcoes.params.ordering = ordenacao;
        }
        carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
    }

    useEffect(() => {
        carregarDados("http://localhost:8000/api/v1/restaurantes/")
    }, [])

    return (
        <section className={style.ListaRestaurantes}>
            <h1>Os restaurantes mais <em>bacanas</em>!</h1>
            <Box component="form" onSubmit={buscar} sx={{ display: 'flex', flexDirection: 'row', m: 1, minWidth: 120 }}>
                <TextField
                    variant="standard"
                    label="Pesquisar"
                    sx={{ marginRight: 10 }}
                    onChange={e => setBusca(e.target.value)}
                    value={busca}
                />
                <Box component="div" >
                    <InputLabel id="order">Ordenação</InputLabel>
                    <Select
                        labelId="order"
                        id="order"
                        value={ordenacao}
                        label="Ordenação"
                        onChange={e => setOrdenacao(e.target.value)}
                        sx={{ width: 200, marginRight: 5 }}
                    >
                        <MenuItem value="">Padrão</MenuItem>
                        <MenuItem value="id">Por ID</MenuItem>
                        <MenuItem value="nome">Por Nome</MenuItem>
                    </Select>

                </Box>
                <Button type='submit'>Buscar</Button>
            </Box>
            {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
            {/* {proximaPagina && <button onClick={()=> verMais()}>Ver Mais</button>} */}

            {<button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
                Página Anterior
            </button>}

            {<button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
                Próxima página
            </button>}

        </section>)
}

// function verMais() {
//     axios.get<IPaginacao<IRestaurante>>(proximaPagina)
//         .then(res => {
//             console.log(res);
//             setRestaurante([...restaurantes, ...res.data.results]);
//             setProximaPagina(res.data.next);
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

export default ListaRestaurantes