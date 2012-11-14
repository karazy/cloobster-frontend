/** @module Cloobster/Languages */

/**
*	@name Cloobster.Languages
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("Cloobster.languages", [], ["$provide", function($provide) {
	var map = [
		{
		"lang" : "Abkhazian",
		"code" : "ab"
		},

		{
		"lang" : "Afar",
		"code" : "aa"
		},

		{
		"lang" : "Afrikaans",
		"code" : "af"
		},

		{
		"lang" : "Akan",
		"code" : "ak"
		},

		{
		"lang" : "Albanian",
		"code" : "sq"
		},

		{
		"lang" : "Amharic",
		"code" : "am"
		},

		{
		"lang" : "Arabic",
		"code" : "ar"
		},

		{
		"lang" : "Aragonese",
		"code" : "an"
		},

		{
		"lang" : "Armenian",
		"code" : "hy"
		},

		{
		"lang" : "Assamese",
		"code" : "as"
		},

		{
		"lang" : "Avaric",
		"code" : "av"
		},

		{
		"lang" : "Avestan",
		"code" : "ae"
		},

		{
		"lang" : "Aymara",
		"code" : "ay"
		},

		{
		"lang" : "Azerbaijani",
		"code" : "az"
		},

		{
		"lang" : "Bambara",
		"code" : "bm"
		},

		{
		"lang" : "Bashkir",
		"code" : "ba"
		},

		{
		"lang" : "Basque",
		"code" : "eu"
		},

		{
		"lang" : "Belarusian",
		"code" : "be"
		},

		{
		"lang" : "Bengali",
		"code" : "bn"
		},

		{
		"lang" : "Bihari languages",
		"code" : "bh"
		},

		{
		"lang" : "Bislama",
		"code" : "bi"
		},

		{
		"lang" : "Bosnian",
		"code" : "bs"
		},

		{
		"lang" : "Breton",
		"code" : "br"
		},

		{
		"lang" : "Bulgarian",
		"code" : "bg"
		},

		{
		"lang" : "Burmese",
		"code" : "my"
		},

		{
		"lang" : "Catalan",
		"code" : "ca"
		},

		{
		"lang" : "Central Khmer",
		"code" : "km"
		},

		{
		"lang" : "Chamorro",
		"code" : "ch"
		},

		{
		"lang" : "Chechen",
		"code" : "ce"
		},

		{
		"lang" : "Chichewa",
		"code" : "ny"
		},

		{
		"lang" : "Chinese",
		"code" : "zh"
		},

		{
		"lang" : "Church Slavic",
		"code" : "cu"
		},

		{
		"lang" : "Chuvash",
		"code" : "cv"
		},

		{
		"lang" : "Cornish",
		"code" : "kw"
		},

		{
		"lang" : "Corsican",
		"code" : "co"
		},

		{
		"lang" : "Cree",
		"code" : "cr"
		},

		{
		"lang" : "Croatian",
		"code" : "hr"
		},

		{
		"lang" : "Czech",
		"code" : "cs"
		},

		{
		"lang" : "Danish",
		"code" : "da"
		},

		{
		"lang" : "Divehi",
		"code" : "dv"
		},

		{
		"lang" : "Dutch; Flemish",
		"code" : "nl"
		},

		{
		"lang" : "Dzongkha",
		"code" : "dz"
		},

		{
		"lang" : "English",
		"code" : "en"
		},

		{
		"lang" : "Esperanto",
		"code" : "eo"
		},

		{
		"lang" : "Estonian",
		"code" : "et"
		},

		{
		"lang" : "Ewe",
		"code" : "ee"
		},

		{
		"lang" : "Faroese",
		"code" : "fo"
		},

		{
		"lang" : "Fijian",
		"code" : "fj"
		},

		{
		"lang" : "Finnish",
		"code" : "fi"
		},

		{
		"lang" : "French",
		"code" : "fr"
		},

		{
		"lang" : "Fulah",
		"code" : "ff"
		},

		{
		"lang" : "Galician",
		"code" : "gl"
		},

		{
		"lang" : "Ganda",
		"code" : "lg"
		},

		{
		"lang" : "Georgian",
		"code" : "ka"
		},

		{
		"lang" : "German",
		"code" : "de"
		},

		{
		"lang" : "Greek",
		"code" : "el"
		},

		{
		"lang" : "Guarani",
		"code" : "gn"
		},

		{
		"lang" : "Gujarati",
		"code" : "gu"
		},

		{
		"lang" : "Haitian Creole",
		"code" : "ht"
		},

		{
		"lang" : "Hausa",
		"code" : "ha"
		},

		{
		"lang" : "Hebrew",
		"code" : "he"
		},

		{
		"lang" : "Herero",
		"code" : "hz"
		},

		{
		"lang" : "Hindi",
		"code" : "hi"
		},

		{
		"lang" : "Hiri Motu",
		"code" : "ho"
		},

		{
		"lang" : "Hungarian",
		"code" : "hu"
		},

		{
		"lang" : "Icelandic",
		"code" : "is"
		},

		{
		"lang" : "Ido",
		"code" : "io"
		},

		{
		"lang" : "Igbo",
		"code" : "ig"
		},

		{
		"lang" : "Indonesian",
		"code" : "id"
		},

		{
		"lang" : "Interlingua (International Auxiliary Language Association)",
		"code" : "ia"
		},

		{
		"lang" : "Interlingue",
		"code" : "ie"
		},

		{
		"lang" : "Inuktitut",
		"code" : "iu"
		},

		{
		"lang" : "Inupiaq",
		"code" : "ik"
		},

		{
		"lang" : "Irish",
		"code" : "ga"
		},

		{
		"lang" : "Italian",
		"code" : "it"
		},

		{
		"lang" : "Japanese",
		"code" : "ja"
		},

		{
		"lang" : "Javanese",
		"code" : "jv"
		},

		{
		"lang" : "Kalaallisut",
		"code" : "kl"
		},

		{
		"lang" : "Kannada",
		"code" : "kn"
		},

		{
		"lang" : "Kanuri",
		"code" : "kr"
		},

		{
		"lang" : "Kashmiri",
		"code" : "ks"
		},

		{
		"lang" : "Kazakh",
		"code" : "kk"
		},

		{
		"lang" : "Kikuyu; Gikuyu",
		"code" : "ki"
		},

		{
		"lang" : "Kinyarwanda",
		"code" : "rw"
		},

		{
		"lang" : "Kirghiz",
		"code" : "ky"
		},

		{
		"lang" : "Komi",
		"code" : "kv"
		},

		{
		"lang" : "Kongo",
		"code" : "kg"
		},

		{
		"lang" : "Korean",
		"code" : "ko"
		},

		{
		"lang" : "Kuanyama; Kwanyama",
		"code" : "kj"
		},

		{
		"lang" : "Kurdish",
		"code" : "ku"
		},

		{
		"lang" : "Lao",
		"code" : "lo"
		},

		{
		"lang" : "Latin",
		"code" : "la"
		},

		{
		"lang" : "Latvian",
		"code" : "lv"
		},

		{
		"lang" : "Limburgish",
		"code" : "li"
		},

		{
		"lang" : "Lingala",
		"code" : "ln"
		},

		{
		"lang" : "Lithuanian",
		"code" : "lt"
		},

		{
		"lang" : "Luba-Katanga",
		"code" : "lu"
		},

		{
		"lang" : "Luxembourgish",
		"code" : "lb"
		},

		{
		"lang" : "Macedonian",
		"code" : "mk"
		},

		{
		"lang" : "Malagasy",
		"code" : "mg"
		},

		{
		"lang" : "Malay",
		"code" : "ms"
		},

		{
		"lang" : "Malayalam",
		"code" : "ml"
		},

		{
		"lang" : "Maltese",
		"code" : "mt"
		},

		{
		"lang" : "Manx",
		"code" : "gv"
		},

		{
		"lang" : "Maori",
		"code" : "mi"
		},

		{
		"lang" : "Marathi",
		"code" : "mr"
		},

		{
		"lang" : "Marshallese",
		"code" : "mh"
		},

		{
		"lang" : "Moldavian; Moldovan",
		"code" : "mo"
		},

		{
		"lang" : "Mongolian",
		"code" : "mn"
		},

		{
		"lang" : "Nauru",
		"code" : "na"
		},

		{
		"lang" : "Navajo; Navaho",
		"code" : "nv"
		},

		{
		"lang" : "Ndonga",
		"code" : "ng"
		},

		{
		"lang" : "Nepali",
		"code" : "ne"
		},

		{
		"lang" : "North Ndebele",
		"code" : "nd"
		},

		{
		"lang" : "Northern Sami",
		"code" : "se"
		},

		{
		"lang" : "Norwegian",
		"code" : "no"
		},

		{
		"lang" : "Norwegian Bokmål",
		"code" : "nb"
		},

		{
		"lang" : "Norwegian Nynorsk",
		"code" : "nn"
		},

		{
		"lang" : "Occitan",
		"code" : "oc"
		},

		{
		"lang" : "Ojibwa",
		"code" : "oj"
		},

		{
		"lang" : "Oriya",
		"code" : "or"
		},

		{
		"lang" : "Oromo",
		"code" : "om"
		},

		{
		"lang" : "Ossetian; Ossetic",
		"code" : "os"
		},

		{
		"lang" : "Pali",
		"code" : "pi"
		},

		{
		"lang" : "Panjabi; Punjabi",
		"code" : "pa"
		},

		{
		"lang" : "Persian",
		"code" : "fa"
		},

		{
		"lang" : "Polish",
		"code" : "pl"
		},

		{
		"lang" : "Portuguese",
		"code" : "pt"
		},

		{
		"lang" : "Pushto; Pashto",
		"code" : "ps"
		},

		{
		"lang" : "Quechua",
		"code" : "qu"
		},

		{
		"lang" : "Romanian",
		"code" : "ro"
		},

		{
		"lang" : "Romansh",
		"code" : "rm"
		},

		{
		"lang" : "Rundi",
		"code" : "rn"
		},

		{
		"lang" : "Russian",
		"code" : "ru"
		},

		{
		"lang" : "Rusyn",
		"code" : "ry"
		},

		{
		"lang" : "Samoan",
		"code" : "sm"
		},

		{
		"lang" : "Sango",
		"code" : "sg"
		},

		{
		"lang" : "Sanskrit",
		"code" : "sa"
		},

		{
		"lang" : "Sardinian",
		"code" : "sc"
		},

		{
		"lang" : "Scottish Gaelic",
		"code" : "gd"
		},

		{
		"lang" : "Serbian",
		"code" : "sr"
		},

		{
		"lang" : "Serbo-Croatian",
		"code" : "sh"
		},

		{
		"lang" : "Shona",
		"code" : "sn"
		},

		{
		"lang" : "Sichuan Yi",
		"code" : "ii"
		},

		{
		"lang" : "Sindhi",
		"code" : "sd"
		},

		{
		"lang" : "Sinhalese",
		"code" : "si"
		},

		{
		"lang" : "Slovak",
		"code" : "sk"
		},

		{
		"lang" : "Slovenian",
		"code" : "sl"
		},

		{
		"lang" : "Somali",
		"code" : "so"
		},

		{
		"lang" : "Sotho, Southern",
		"code" : "st"
		},

		{
		"lang" : "South Ndebele",
		"code" : "nr"
		},

		{
		"lang" : "Spanish; Castilian",
		"code" : "es"
		},

		{
		"lang" : "Sundanese",
		"code" : "su"
		},

		{
		"lang" : "Swahili",
		"code" : "sw"
		},

		{
		"lang" : "Swati",
		"code" : "ss"
		},

		{
		"lang" : "Swedish",
		"code" : "sv"
		},

		{
		"lang" : "Tagalog",
		"code" : "tl"
		},

		{
		"lang" : "Tahitian",
		"code" : "ty"
		},

		{
		"lang" : "Tajik",
		"code" : "tg"
		},

		{
		"lang" : "Tamil",
		"code" : "ta"
		},

		{
		"lang" : "Tatar",
		"code" : "tt"
		},

		{
		"lang" : "Telugu",
		"code" : "te"
		},

		{
		"lang" : "Thai",
		"code" : "th"
		},

		{
		"lang" : "Tibetan",
		"code" : "bo"
		},

		{
		"lang" : "Tigrinya",
		"code" : "ti"
		},

		{
		"lang" : "Tonga",
		"code" : "to"
		},

		{
		"lang" : "Tsonga",
		"code" : "ts"
		},

		{
		"lang" : "Tswana",
		"code" : "tn"
		},

		{
		"lang" : "Turkish",
		"code" : "tr"
		},

		{
		"lang" : "Turkmen",
		"code" : "tk"
		},

		{
		"lang" : "Twi",
		"code" : "tw"
		},

		{
		"lang" : "Uighur",
		"code" : "ug"
		},

		{
		"lang" : "Ukrainian",
		"code" : "uk"
		},

		{
		"lang" : "Urdu",
		"code" : "ur"
		},

		{
		"lang" : "Uzbek",
		"code" : "uz"
		},

		{
		"lang" : "Venda",
		"code" : "ve"
		},

		{
		"lang" : "Vietnamese",
		"code" : "vi"
		},

		{
		"lang" : "Volapük",
		"code" : "vo"
		},

		{
		"lang" : "Walloon",
		"code" : "wa"
		},

		{
		"lang" : "Welsh",
		"code" : "cy"
		},

		{
		"lang" : "Western Frisian",
		"code" : "fy"
		},

		{
		"lang" : "Wolof",
		"code" : "wo"
		},

		{
		"lang" : "Xhosa",
		"code" : "xh"
		},

		{
		"lang" : "Yiddish",
		"code" : "yi"
		},

		{
		"lang" : "Yoruba",
		"code" : "yo"
		},

		{
		"lang" : "Zhuang; Chuang",
		"code" : "za"
		},

		{"Zulu" : "zu"}
	]

	$provide.value("langcodes", map);
}]);
