function compare(a, b) {
  var countryOrder = [
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

  var countryPriority = ["HK", "TW", "JP", "SG", "US"];

  var cityPriority = {
    AU: ["SYD"],
    US: ["LAX", "SJC", "SEA"],
    RU: ["MOW", "LED"]
  };

  var providerPriority = ["NX", "KU", "MS"];

  var qualityPriority = ["IEPL"];

  function buildRank(arr, offset) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
      map[arr[i]] = i + (offset || 0);
    }
    return map;
  }

  function getRank(map, key, fallback) {
    return map[key] !== undefined ? map[key] : fallback;
  }

  function getCityRank(iso, city) {
    var arr = cityPriority[iso];
    if (!arr) return 9999;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === city) return i;
    }
    return 9999;
  }

  function parse(remark) {
    var parts = (remark || "").trim().split(/\s+/);

    var isoCity = parts[1] || "";
    var providerQuality = parts[2] || "";
    var indexStr = parts[3] || "";

    var iso = "";
    var city = "";
    var provider = "";
    var quality = "";

    var regionParts = isoCity.split("-");
    iso = regionParts[0] || "";
    city = regionParts[1] || "";

    var pqParts = providerQuality.split("-");
    provider = pqParts[0] || "";
    quality = pqParts[1] || "";

    var index = parseInt(indexStr, 10);
    if (isNaN(index)) index = 9999;

    return {
      iso: iso,
      city: city,
      provider: provider,
      quality: quality,
      index: index,
      raw: remark || ""
    };
  }

  var countryRank = buildRank(countryOrder, 1000);
  var pinnedRank = buildRank(countryPriority, 0);
  var providerRank = buildRank(providerPriority, 0);
  var qualityRank = buildRank(qualityPriority, 0);

  var A = parse(a.Remark);
  var B = parse(b.Remark);

  var A_country = pinnedRank[A.iso] !== undefined
    ? pinnedRank[A.iso]
    : getRank(countryRank, A.iso, 99999);

  var B_country = pinnedRank[B.iso] !== undefined
    ? pinnedRank[B.iso]
    : getRank(countryRank, B.iso, 99999);

  if (A_country !== B_country) return A_country < B_country;

  var A_city = getCityRank(A.iso, A.city);
  var B_city = getCityRank(B.iso, B.city);
  if (A_city !== B_city) return A_city < B_city;

  var A_provider = getRank(providerRank, A.provider, 9999);
  var B_provider = getRank(providerRank, B.provider, 9999);
  if (A_provider !== B_provider) return A_provider < B_provider;

  var A_quality = getRank(qualityRank, A.quality, 9999);
  var B_quality = getRank(qualityRank, B.quality, 9999);
  if (A_quality !== B_quality) return A_quality < B_quality;

  if (A.index !== B.index) return A.index < B.index;

  return A.raw < B.raw;
}
