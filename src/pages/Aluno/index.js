import { useState, useEffect } from "react";
import { Container } from "../../styles/GlobalStyles";
import { get } from "lodash";
import PropTypes from "prop-types";
import { Form, ProfilePicture, Title } from "./styled";
import { toast } from "react-toastify";
import { isEmail, isInt, isFloat } from "validator";
import { useDispatch } from "react-redux";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import Loadind from "../../components/Loading";
import axios from "../../services/axios";
import history from "../../services/history";
import * as actions from "../../store/modules/auth/actions";
import { Link } from "react-router-dom";
export default function Aluno({ match }) {
  const dispatch = useDispatch();
  const id = get(match, "params.id", "");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [foto, setFoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, "Fotos[0].url", "");
        setNome(get(data, "nome", ""));
        setSobrenome(get(data, "sobrenome", ""));
        setEmail(get(data, "email", ""));
        setIdade(get(data, "idade", ""));
        setPeso(get(data, "peso", ""));
        setAltura(get(data, "altura", ""));
        setFoto(Foto);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, "response.status", []);
        const errors = get(err, "response.data.errors", []);
        if (status === 400) {
          errors.map((error) => toast.error(error));
          history.push("/");
        }
      }
    }

    getData();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error("Nome deve ter entre 3 e 255 caracteres");
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error("Sobrenome deve ter entre 3 e 255 caracteres");
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("E-mail inválido");
    }

    if (!isInt(String(idade)) || idade < 0 || idade > 150) {
      formErrors = true;
      toast.error("Idade deve ser entre 0 e 150");
    }

    if (!isFloat(String(peso)) || peso < 0 || peso > 500) {
      formErrors = true;
      toast.error("Peso deve ser entre 0 e 500");
    }

    if (!isFloat(String(altura)) || altura < 0 || altura > 3) {
      formErrors = true;
      toast.error("Altura deve ser entre 0 e 3");
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno(a) editado(a) com sucesso");
        history.push("/");
      } else {
        await axios.post("/alunos/", {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno(a) cadastrado(a) com sucesso");
        history.push("/");
      }
      setIsLoading(false);
    } catch (err) {
      const status = get(err, "response.status", []);
      const data = get(err, "response.data", []);
      const errors = get(data, "errors", []);
      if (errors > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error("Erro desconhecido");
      }

      if (status === 401) {
        dispatch(actions.loginFailure());
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loadind isLoading={isLoading} />
      <Title> {id ? "Editar aluno" : "Novo aluno"} </Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
        <input
          type="number"
          placeholder="Peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
        <input
          type="number"
          placeholder="Altura"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />
        <button type="submit"> {id ? "Salvar" : "Criar"} </button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
