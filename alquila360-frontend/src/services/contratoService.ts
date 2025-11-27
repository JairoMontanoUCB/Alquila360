import axios from "../app/utils/axios.util";

export const contratoService = {
  /**
   * Obtiene el contrato actual del inquilino
   */
  async getContratoActual(userId: number) {
    try {
      const res = await axios.get(`/contrato/actual/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error obteniendo contrato actual:", error);
      throw error;
    }
  },

  /**
   * Si quieres obtener contrato por inquilino (otra forma)
   */
  async getContratoDeInquilino(inquilinoId: number) {
    try {
      const res = await axios.get(`/contrato/inquilino/${inquilinoId}`);
      return res.data;
    } catch (error) {
      console.error("Error obteniendo contrato del inquilino:", error);
      throw error;
    }
  }
};
