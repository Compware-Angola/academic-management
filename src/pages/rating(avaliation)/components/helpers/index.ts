import { DocenteSelected } from "../DocenteVigilantePicker";

const buildVigilantesPayloads = (dt: DocenteSelected[]) => {
  return dt.map((t) => {
    return {
      codigoUtilizador: Number(t.id),
      desc: t?.nome ?? "",
    };
  });
};

export { buildVigilantesPayloads };
