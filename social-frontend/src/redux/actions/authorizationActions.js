import { TEST_DISPATCH } from "./types";

export const registerUser = (userData, other) => {
    const name = 'nombre-alterado';
    return {
        type: TEST_DISPATCH,
        payload:{name, userData},
        other
    }
}