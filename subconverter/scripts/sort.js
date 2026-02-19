function compare(a, b) {
  const countryOrder = [
    "IS", "NO", "CH", "DK", "DE", "SE", "AU", "HK", "NL", "BE", "IE", "FI", "SG", "GB",
    "AE", "CA", "LI", "NZ", "US", "KR", "SI", "AT", "JP", "MT", "LU", "FR", "IL", "ES",
    "CZ", "IT", "SM", "AD", "CY", "GR", "PL", "EE", "SA", "BH", "LT", "PT", "HR", "LV",
    "QA", "SK", "CL", "HU", "AR", "ME", "UY", "OM", "TR", "KW", "AG", "SC", "BG", "RO",
    "GE", "KN", "PA", "BN", "KZ", "CR", "RS", "RU", "BY", "BS", "MY", "MK", "AM", "BB",
    "AL", "TT", "MU", "BA", "IR", "VC", "TH", "CN", "PE", "GD", "AZ", "MX", "CO", "BR",
    "PW", "MD", "UA", "EC", "DO", "GY", "LK", "TO", "MV", "VN", "TM", "DZ", "CU", "DM",
    "PY", "EG", "JO", "LB", "LC", "MN", "TN", "ZA", "UZ", "BO", "GA", "MH", "BW", "FJ",
    "ID", "SR", "BZ", "LY", "JM", "KG", "PH", "MA", "VE", "WS", "NI", "NR", "BT", "SZ",
    "IQ", "TJ", "TV", "BD", "IN", "SV", "GQ", "PS", "CV", "NA", "GT", "CG", "HN", "KI",
    "ST", "TL", "GH", "KE", "NP", "VU", "LA", "AO", "FM", "MM", "KH", "KM", "ZW", "ZM",
    "CM", "SB", "CI", "UG", "RW", "PG", "TG", "SY", "MR", "NG", "TZ", "HT", "LS", "PK",
    "SN", "GM", "CD", "MW", "BJ", "GW", "DJ", "SD", "LR", "ER", "GN", "ET", "AF", "MZ",
    "MG", "YE", "SL", "BF", "BI", "ML", "NE", "TD", "CF", "SO", "SS", "KP", "MC", "TW"
  ];

  const pinnedCountries = ["HK", "TW", "JP", "SG", "US"];

  const cityOrder = {
    AU: ["SYD"],
    US: ["LAX", "SJC", "SEA"],
    RU: ["MOW", "LED"]
  };

  const pinnedCities = {};

  const toRank = (arr, offset = 0) =>
    Object.fromEntries(arr.map((k, i) => [k, i + 1 + offset]));

  const buildCityRank = (base, pinned) => {
    const rank = {};

    for (const [cc, cities] of Object.entries(base)) {
      const top = pinned[cc] || [];
      const topSet = new Set(top);

      const merged = [
        ...top,
        ...cities.filter((c) => !topSet.has(c))
      ];

      merged.forEach((city, i) => {
        rank[`${cc} ${city}`] = i + 1;
      });
    }

    return rank;
  };

  const countryRank = toRank(countryOrder, 1000);
  const pinnedRank = toRank(pinnedCountries);
  const cityRank = buildCityRank(cityOrder, pinnedCities);

  const getCountryRank = (cc) =>
    pinnedRank[cc] ?? countryRank[cc] ?? 99999;

  const parse = (remark) => {
    const parts = (remark || "").trim().split(/\s+/);
    const hasCity = parts.length === 5;

    const cc = parts[1] || "";
    const cityKey = hasCity ? `${cc} ${parts[2]}` : null;
    const typeToken = parts[hasCity ? 4 : 3] || "";
    const idxMatch = typeToken.match(/^[ET](\d+)$/);

    return {
      country: getCountryRank(cc),
      city: cityKey ? cityRank[cityKey] ?? 9999 : 9999,
      type: typeToken.startsWith("E")
        ? 0
        : typeToken.startsWith("T")
        ? 1
        : 2,
      index: idxMatch ? parseInt(idxMatch[1], 10) : 9999,
      raw: remark || ""
    };
  };

  const A = parse(a.Remark);
  const B = parse(b.Remark);

  if (A.country !== B.country) return A.country < B.country;
  if (A.city !== B.city) return A.city < B.city;
  if (A.type !== B.type) return A.type < B.type;
  if (A.index !== B.index) return A.index < B.index;

  return A.raw < B.raw;
}
