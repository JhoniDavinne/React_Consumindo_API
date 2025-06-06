import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../../styles/GlobalStyles";
import { Form } from "./styled";
import Loading from "../../components/Loading";
import * as actions from "../../store/modules/auth/actions";
export default function Register() {
  const dispatch = useDispatch();
  const {
    id,
    nome: nomeStored,
    email: emailStored,
    isLoading,
  } = useSelector((state) => state.auth.user);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!id) return;

    setNome(nomeStored);
    setEmail(emailStored);
  }, [emailStored, id, nomeStored]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error("Nome deve ter entre 3 e 255 caracteres");
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("E-mail inválido");
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error("Senha deve ter entre 6 e 50 caracteres");
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ id, nome, email, password }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1> {id ? "Editar dados" : "Crie sua conta"} </h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </label>
        <label htmlFor="password">
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        <button type="submit"> {id ? "Salvar" : "Criar minha conta"} </button>
      </Form>
    </Container>
  );
}
