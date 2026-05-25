import { Image, Text, View, StyleSheet } from "@react-pdf/renderer";
export interface UniversityHeaderProps {
  logoSrc: string;
  name: string;
  decree?: string;
  address: string;
  addressLine2?: string;
  phone: string;
  nif: string;
  primaryColor?: string;
}
export const defaultCashClosingHeader: UniversityHeaderProps = {
  logoSrc: "/logo_uma.png",
  name: "UNIVERSIDADE METODISTA DE ANGOLA",
  decree: "(Aprovado pelo Decreto nº 30/07 de 07/05)",
  address: "Rua Nossa Senhora da Muxima",
  addressLine2: "Nº10, C.P.-6739-Luanda",
  phone: "947716113",
  nif: "5401150865",
  primaryColor: "#0D1B48",
};
const S = StyleSheet.create({
  topBlock: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 52,
    marginBottom: 4,
  },
  orgName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  decree: {
    fontSize: 8,
    marginTop: 2,
    color: "#6B7280",
    textAlign: "right",
  },
  dividerLine: {
    borderBottomWidth: 2,
    borderBottomColor: "#0D1B48",
    marginBottom: 18,
  },
});

export function UniversityHeader({
  header,
}: {
  header: UniversityHeaderProps;
}) {
  return (
    <>
      <View style={S.topBlock}>
        <Image style={S.logo} src={header.logoSrc} />
        <Text style={S.orgName}>{header.name}</Text>
        {header.decree && <Text style={S.decree}>{header.decree}</Text>}
      </View>

      <View style={S.dividerLine} />
    </>
  );
}
