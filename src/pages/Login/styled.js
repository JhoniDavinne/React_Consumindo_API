import styled from "styled-components";

export const Title = styled.h1`
  color: ${(props) => (props.isRed ? "red" : "blue")};
  background: green;
  small {
    font-size: 12pt;
    margin-left: 10px;
    color: #999;
  }
`;

export const Paragraph = styled.p`
  font-size: 90px;
`;
