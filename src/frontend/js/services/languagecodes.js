/** @module Cloobster/Languages */

/**
*	@name Cloobster.Languages
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("Cloobster.languages", [], ["$provide", function($provide) {
	var map = {
		"Abkhazian" : "ab",

		"Afar" : "aa",

		"Afrikaans" : "af",

		"Akan" : "ak",

		"Albanian" : "sq",

		"Amharic" : "am",

		"Arabic" : "ar",

		"Aragonese" : "an",

		"Armenian" : "hy",

		"Assamese" : "as",

		"Avaric" : "av",

		"Avestan" : "ae",

		"Aymara" : "ay",

		"Azerbaijani" : "az",

		"Bambara" : "bm",

		"Bashkir" : "ba",

		"Basque" : "eu",

		"Belarusian" : "be",

		"Bengali" : "bn",

		"Bihari languages" : "bh",

		"Bislama" : "bi",

		"Bosnian" : "bs",

		"Breton" : "br",

		"Bulgarian" : "bg",

		"Burmese" : "my",

		"Catalan" : "ca",

		"Central Khmer" : "km",

		"Chamorro" : "ch",

		"Chechen" : "ce",

		"Chichewa" : "ny",

		"Chinese" : "zh",

		"Church Slavic" : "cu",

		"Chuvash" : "cv",

		"Cornish" : "kw",

		"Corsican" : "co",

		"Cree" : "cr",

		"Croatian" : "hr",

		"Czech" : "cs",

		"Danish" : "da",

		"Divehi" : "dv",

		"Dutch; Flemish" : "nl",

		"Dzongkha" : "dz",

		"English" : "en",

		"Esperanto" : "eo",

		"Estonian" : "et",

		"Ewe" : "ee",

		"Faroese" : "fo",

		"Fijian" : "fj",

		"Finnish" : "fi",

		"French" : "fr",

		"Fulah" : "ff",

		"Galician" : "gl",

		"Ganda" : "lg",

		"Georgian" : "ka",

		"German" : "de",

		"Greek" : "el",

		"Guarani" : "gn",

		"Gujarati" : "gu",

		"Haitian Creole" : "ht",

		"Hausa" : "ha",

		"Hebrew" : "he",

		"Herero" : "hz",

		"Hindi" : "hi",

		"Hiri Motu" : "ho",

		"Hungarian" : "hu",

		"Icelandic" : "is",

		"Ido" : "io",

		"Igbo" : "ig",

		"Indonesian" : "id",

		"Interlingua (International Auxiliary Language Association)" : "ia",

		"Interlingue" : "ie",

		"Inuktitut" : "iu",

		"Inupiaq" : "ik",

		"Irish" : "ga",

		"Italian" : "it",

		"Japanese" : "ja",

		"Javanese" : "jv",

		"Kalaallisut" : "kl",

		"Kannada" : "kn",

		"Kanuri" : "kr",

		"Kashmiri" : "ks",

		"Kazakh" : "kk",

		"Kikuyu; Gikuyu" : "ki",

		"Kinyarwanda" : "rw",

		"Kirghiz" : "ky",

		"Komi" : "kv",

		"Kongo" : "kg",

		"Korean" : "ko",

		"Kuanyama; Kwanyama" : "kj",

		"Kurdish" : "ku",

		"Lao" : "lo",

		"Latin" : "la",

		"Latvian" : "lv",

		"Limburgish" : "li",

		"Lingala" : "ln",

		"Lithuanian" : "lt",

		"Luba-Katanga" : "lu",

		"Luxembourgish" : "lb",

		"Macedonian" : "mk",

		"Malagasy" : "mg",

		"Malay" : "ms",

		"Malayalam" : "ml",

		"Maltese" : "mt",

		"Manx" : "gv",

		"Maori" : "mi",

		"Marathi" : "mr",

		"Marshallese" : "mh",

		"Moldavian; Moldovan" : "mo",

		"Mongolian" : "mn",

		"Nauru" : "na",

		"Navajo; Navaho" : "nv",

		"Ndonga" : "ng",

		"Nepali" : "ne",

		"North Ndebele" : "nd",

		"Northern Sami" : "se",

		"Norwegian" : "no",

		"Norwegian Bokmål" : "nb",

		"Norwegian Nynorsk" : "nn",

		"Occitan" : "oc",

		"Ojibwa" : "oj",

		"Oriya" : "or",

		"Oromo" : "om",

		"Ossetian; Ossetic" : "os",

		"Pali" : "pi",

		"Panjabi; Punjabi" : "pa",

		"Persian" : "fa",

		"Polish" : "pl",

		"Portuguese" : "pt",

		"Pushto; Pashto" : "ps",

		"Quechua" : "qu",

		"Romanian" : "ro",

		"Romansh" : "rm",

		"Rundi" : "rn",

		"Russian" : "ru",

		"Rusyn" : "ry",

		"Samoan" : "sm",

		"Sango" : "sg",

		"Sanskrit" : "sa",

		"Sardinian" : "sc",

		"Scottish Gaelic" : "gd",

		"Serbian" : "sr",

		"Serbo-Croatian" : "sh",

		"Shona" : "sn",

		"Sichuan Yi" : "ii",

		"Sindhi" : "sd",

		"Sinhalese" : "si",

		"Slovak" : "sk",

		"Slovenian" : "sl",

		"Somali" : "so",

		"Sotho, Southern" : "st",

		"South Ndebele" : "nr",

		"Spanish; Castilian" : "es",

		"Sundanese" : "su",

		"Swahili" : "sw",

		"Swati" : "ss",

		"Swedish" : "sv",

		"Tagalog" : "tl",

		"Tahitian" : "ty",

		"Tajik" : "tg",

		"Tamil" : "ta",

		"Tatar" : "tt",

		"Telugu" : "te",

		"Thai" : "th",

		"Tibetan" : "bo",

		"Tigrinya" : "ti",

		"Tonga" : "to",

		"Tsonga" : "ts",

		"Tswana" : "tn",

		"Turkish" : "tr",

		"Turkmen" : "tk",

		"Twi" : "tw",

		"Uighur" : "ug",

		"Ukrainian" : "uk",

		"Urdu" : "ur",

		"Uzbek" : "uz",

		"Venda" : "ve",

		"Vietnamese" : "vi",

		"Volapük" : "vo",

		"Walloon" : "wa",

		"Welsh" : "cy",

		"Western Frisian" : "fy",

		"Wolof" : "wo",

		"Xhosa" : "xh",

		"Yiddish" : "yi",

		"Yoruba" : "yo",

		"Zhuang; Chuang" : "za",

		"Zulu" : "zu"
	}

	$provide.value("langcodes", map);
}
