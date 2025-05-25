import { useEffect, useState } from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from "react-icons/fa";
import { Container } from "../../styles/GlobalStyles";
import { AlunoContainer, ProfilePicture, NovoAluno } from "./styled";
import { toast } from "react-toastify";
import axios from "../../services/axios";
import Loading from "../../components/Loading";
export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/alunos");
      setAlunos(response.data);
      setIsLoading(false);
    }
    getData();
  }, []);

  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute("display", "block");
    e.currentTarget.remove();
  };

  const handleDelete = async (e, alunoId, index) => {
    e.persist();
    try {
      setIsLoading(true);
      await axios.delete(`/alunos/${alunoId}`);
      const newAlunos = [...alunos];
      newAlunos.splice(index, 1);
      setAlunos(newAlunos);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      const status = get(err, "response.status", []);
      if (status === 401) {
        toast.error("Você precisar fazer login");
      } else {
        toast.error("Erro ao deletar aluno");
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1> Alunos </h1>

      <NovoAluno to="/aluno/">Novo aluno</NovoAluno>

      <AlunoContainer>
        {alunos.map((aluno, index) => (
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, "Fotos[0].url", false) ? (
                <img src={aluno.Fotos[0].url} alt={aluno.nome} />
              ) : (
                <FaUserCircle size={36} color={"#999"} />
              )}
            </ProfilePicture>
            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>

            <Link to={`/aluno/${aluno.id}/edit`}>
              <FaEdit size={16} />
            </Link>
            <Link onClick={handleDeleteAsk} to={`/aluno/${aluno.id}/delete`}>
              <FaWindowClose size={16} />
            </Link>
            <FaExclamation
              size={16}
              display={"none"}
              cursor={"pointer"}
              onClick={(e) => handleDelete(e, aluno.id, index)}
            />
          </div>
        ))}
      </AlunoContainer>
    </Container>
  );
}
