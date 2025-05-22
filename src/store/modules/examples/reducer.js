import * as types from "../types";

const initialState = {
  botaoClicado: false,
};

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case types.BOTAO_CLICADO_SUCCESS: {
      console.log("SUCESSO");
      return {
        ...state,
        botaoClicado: !state.botaoClicado,
      };
    }
    case types.BOTAO_CLICADO_REQUEST: {
      console.log("ESTOU FAZENDO A REQUISAO");
      return state;
    }
    case types.BOTAO_CLICADO_FAILURE: {
      console.log("DEU ERRO :/");
      return state;
    }

    default: {
      return state;
    }
  }
}
