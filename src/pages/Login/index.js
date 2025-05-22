import { useDispatch } from "react-redux";
import { Container } from "../../styles/GlobalStyles";
import { Title, Paragraph } from "./styled";
import * as examplesActions from "../../store/modules/examples/actions";

export default function Login() {
  const dispatch = useDispatch();
  function handleClick(e) {
    e.preventDefault();
    dispatch(examplesActions.clicaBotaoRequest());
  }

  return (
    <Container>
      <Title isRed={false}>
        Login <small>page</small>
      </Title>
      <Paragraph>This is the login page</Paragraph>
      <button type="button" onClick={handleClick}>
        Enviar
      </button>
    </Container>
  );
}
