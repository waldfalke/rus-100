export function transliterateRu(input: string): string {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  const lower = input.toLowerCase();
  let out = "";
  for (const ch of lower) {
    if (map[ch as keyof typeof map] !== undefined) {
      out += map[ch as keyof typeof map];
    } else {
      out += ch;
    }
  }
  return out;
}

export function toSlug(input: string, separator: string = "-"): string {
  const transliterated = transliterateRu(input)
    .replace(/[№]/g, "")
    .replace(/["'«»]/g, "");

  return transliterated
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`${separator}+`, "g"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}