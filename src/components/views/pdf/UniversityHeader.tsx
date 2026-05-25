import { Image, Text, View, StyleSheet } from "@react-pdf/renderer";
export interface EntityHeader {
  logoSrc: string;
  name: string;
  details: string[];
  primaryColor?: string;
}

export const defaultHeader: EntityHeader = {
  logoSrc: "/logo_uma.png",
  name: "Universidade Metodista de Angola",
  details: [
    "Luanda - Angola",
    "Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi",
    "NIF: 5401150865",
    "Tel: +244 912 131 138 | +244 947 716 133",
    "Email: geral@uma.co.ao",
  ],
  primaryColor: "#0D1B48",
};
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
const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    paddingBottom: 8,
    marginBottom: 14,
  },
  logo: { width: 100, height: 50 },
  entityInfo: { textAlign: "right" },
  entityName: { fontSize: 13, fontWeight: "bold" },
  entityDetail: { fontSize: 8, color: "#444", marginTop: 1 },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 8,
    textTransform: "uppercase" as const,
  },
});

export function UniversityHeader() {
  const color = "#0D1B48";
  return (
    <>
      <View style={[baseStyles.header, { borderColor: color }]}>
        <Image style={baseStyles.logo} src={defaultHeader.logoSrc} />
        <View style={baseStyles.entityInfo}>
          <Text style={[baseStyles.entityName, { color }]}>
            {defaultHeader.name}
          </Text>
          {defaultHeader.details.map((line, i) => (
            <Text key={i} style={baseStyles.entityDetail}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </>
  );
}
