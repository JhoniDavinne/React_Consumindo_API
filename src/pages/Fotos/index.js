import { useState, useEffect } from "react";
import { get } from "lodash";
import { toast } from "react-toastify";
import { Container } from "../../styles/GlobalStyles";
import Loading from "../../components/Loading";
import { Title, Form } from "./styled";
import axios from "../../services/axios";
import history from "../../services/history";
import PropTypes from "prop-types";
import * as actions from "../../store/modules/auth/actions";
import { useDispatch } from "react-redux";
export default function Fotos({ match }) {
  const dispatch = useDispatch();
  const id = get(match, "params.id", "");

  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, "Fotos[0].url", ""));
        setIsLoading(false);
      } catch {
        toast.error("Erro ao buscar imagem");
        setIsLoading(false);
        history.push("/");
      }
    };

    getData();
  }, [id]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fotoURL = URL.createObjectURL(file);
    setFoto(fotoURL);

    const formData = new FormData();
    formData.append("aluno_id", id);
    formData.append("foto", file);
    try {
      setIsLoading(true);
      await axios.post("/photos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Foto enviada com sucesso");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const { status } = get(err, "response", []);
      if (status === 401) {
        toast.error(" Vocé precisa fazer login");
        dispatch(actions.loginFailure());
      }
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title> Fotos </Title>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : "Selecionar Foto"}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
