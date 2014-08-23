'use strict';
/** @module Cloobster/Languages */

/**
*	@name Cloobster.Languages
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module('Cloobster.languages', [], ['$provide', function($provide) {
	var map = [
		{
		'lang' : 'Abkhazian',
		'code' : 'ab',
		'active' : false
		},

		{
		'lang' : 'Afar',
		'code' : 'aa',
		'active' : false
		},

		{
		'lang' : 'Afrikaans',
		'code' : 'af',
		'active' : false
		},

		{
		'lang' : 'Akan',
		'code' : 'ak',
		'active' : false
		},

		{
		'lang' : 'Albanian',
		'code' : 'sq',
		'active' : false
		},

		{
		'lang' : 'Amharic',
		'code' : 'am',
		'active' : false
		},

		{
		'lang' : 'Arabic',
		'code' : 'ar',
		'active' : false
		},

		{
		'lang' : 'Aragonese',
		'code' : 'an',
		'active' : false
		},

		{
		'lang' : 'Armenian',
		'code' : 'hy',
		'active' : false
		},

		{
		'lang' : 'Assamese',
		'code' : 'as',
		'active' : false
		},

		{
		'lang' : 'Avaric',
		'code' : 'av',
		'active' : false
		},

		{
		'lang' : 'Avestan',
		'code' : 'ae',
		'active' : false
		},

		{
		'lang' : 'Aymara',
		'code' : 'ay',
		'active' : false
		},

		{
		'lang' : 'Azerbaijani',
		'code' : 'az',
		'active' : false
		},

		{
		'lang' : 'Bambara',
		'code' : 'bm',
		'active' : false
		},

		{
		'lang' : 'Bashkir',
		'code' : 'ba',
		'active' : false
		},

		{
		'lang' : 'Basque',
		'code' : 'eu',
		'active' : false
		},

		{
		'lang' : 'Belarusian',
		'code' : 'be',
		'active' : false
		},

		{
		'lang' : 'Bengali',
		'code' : 'bn',
		'active' : false
		},

		{
		'lang' : 'Bihari languages',
		'code' : 'bh',
		'active' : false
		},

		{
		'lang' : 'Bislama',
		'code' : 'bi',
		'active' : false
		},

		{
		'lang' : 'Bosnian',
		'code' : 'bs',
		'active' : false
		},

		{
		'lang' : 'Breton',
		'code' : 'br',
		'active' : false
		},

		{
		'lang' : 'Bulgarian',
		'code' : 'bg',
		'active' : false
		},

		{
		'lang' : 'Burmese',
		'code' : 'my',
		'active' : false
		},

		{
		'lang' : 'Catalan',
		'code' : 'ca',
		'active' : false
		},

		{
		'lang' : 'Central Khmer',
		'code' : 'km',
		'active' : false
		},

		{
		'lang' : 'Chamorro',
		'code' : 'ch',
		'active' : false
		},

		{
		'lang' : 'Chechen',
		'code' : 'ce',
		'active' : false
		},

		{
		'lang' : 'Chichewa',
		'code' : 'ny',
		'active' : false
		},

		{
		'lang' : 'Chinese',
		'code' : 'zh',
		'active' : false
		},

		{
		'lang' : 'Church Slavic',
		'code' : 'cu',
		'active' : false
		},

		{
		'lang' : 'Chuvash',
		'code' : 'cv',
		'active' : false
		},

		{
		'lang' : 'Cornish',
		'code' : 'kw',
		'active' : false
		},

		{
		'lang' : 'Corsican',
		'code' : 'co',
		'active' : false
		},

		{
		'lang' : 'Cree',
		'code' : 'cr',
		'active' : false
		},

		{
		'lang' : 'Croatian',
		'code' : 'hr',
		'active' : false
		},

		{
		'lang' : 'Czech',
		'code' : 'cs',
		'active' : true
		},

		{
		'lang' : 'Danish',
		'code' : 'da',
		'active' : true
		},

		{
		'lang' : 'Divehi',
		'code' : 'dv',
		'active' : false
		},

		{
		'lang' : 'Dutch; Flemish',
		'code' : 'nl',
		'active' : true
		},

		{
		'lang' : 'Dzongkha',
		'code' : 'dz',
		'active' : false
		},

		{
		'lang' : 'English',
		'code' : 'en',
		'active' : true
		},

		{
		'lang' : 'Esperanto',
		'code' : 'eo',
		'active' : false
		},

		{
		'lang' : 'Estonian',
		'code' : 'et',
		'active' : false
		},

		{
		'lang' : 'Ewe',
		'code' : 'ee',
		'active' : false
		},

		{
		'lang' : 'Faroese',
		'code' : 'fo',
		'active' : false
		},

		{
		'lang' : 'Fijian',
		'code' : 'fj',
		'active' : false
		},

		{
		'lang' : 'Finnish',
		'code' : 'fi',
		'active' : true
		},

		{
		'lang' : 'French',
		'code' : 'fr',
		'active' : true
		},

		{
		'lang' : 'Fulah',
		'code' : 'ff',
		'active' : false
		},

		{
		'lang' : 'Galician',
		'code' : 'gl',
		'active' : false
		},

		{
		'lang' : 'Ganda',
		'code' : 'lg',
		'active' : false
		},

		{
		'lang' : 'Georgian',
		'code' : 'ka',
		'active' : false
		},

		{
		'lang' : 'German',
		'code' : 'de',
		'active' : true
		},

		{
		'lang' : 'Greek',
		'code' : 'el',
		'active' : false
		},

		{
		'lang' : 'Guarani',
		'code' : 'gn',
		'active' : false
		},

		{
		'lang' : 'Gujarati',
		'code' : 'gu',
		'active' : false
		},

		{
		'lang' : 'Haitian Creole',
		'code' : 'ht',
		'active' : false
		},

		{
		'lang' : 'Hausa',
		'code' : 'ha',
		'active' : false
		},

		{
		'lang' : 'Hebrew',
		'code' : 'he',
		'active' : false
		},

		{
		'lang' : 'Herero',
		'code' : 'hz',
		'active' : false
		},

		{
		'lang' : 'Hindi',
		'code' : 'hi',
		'active' : false
		},

		{
		'lang' : 'Hiri Motu',
		'code' : 'ho',
		'active' : false
		},

		{
		'lang' : 'Hungarian',
		'code' : 'hu',
		'active' : false
		},

		{
		'lang' : 'Icelandic',
		'code' : 'is',
		'active' : false
		},

		{
		'lang' : 'Ido',
		'code' : 'io',
		'active' : false
		},

		{
		'lang' : 'Igbo',
		'code' : 'ig',
		'active' : false
		},

		{
		'lang' : 'Indonesian',
		'code' : 'id',
		'active' : false
		},

		{
		'lang' : 'Interlingua (International Auxiliary Language Association)',
		'code' : 'ia',
		'active' : false
		},

		{
		'lang' : 'Interlingue',
		'code' : 'ie',
		'active' : false
		},

		{
		'lang' : 'Inuktitut',
		'code' : 'iu',
		'active' : false
		},

		{
		'lang' : 'Inupiaq',
		'code' : 'ik',
		'active' : false
		},

		{
		'lang' : 'Irish',
		'code' : 'ga',
		'active' : true
		},

		{
		'lang' : 'Italian',
		'code' : 'it',
		'active' : true
		},

		{
		'lang' : 'Japanese',
		'code' : 'ja',
		'active' : true
		},

		{
		'lang' : 'Javanese',
		'code' : 'jv',
		'active' : false
		},

		{
		'lang' : 'Kalaallisut',
		'code' : 'kl',
		'active' : false
		},

		{
		'lang' : 'Kannada',
		'code' : 'kn',
		'active' : false
		},

		{
		'lang' : 'Kanuri',
		'code' : 'kr',
		'active' : false
		},

		{
		'lang' : 'Kashmiri',
		'code' : 'ks',
		'active' : false
		},

		{
		'lang' : 'Kazakh',
		'code' : 'kk',
		'active' : false
		},

		{
		'lang' : 'Kikuyu; Gikuyu',
		'code' : 'ki',
		'active' : false
		},

		{
		'lang' : 'Kinyarwanda',
		'code' : 'rw',
		'active' : false
		},

		{
		'lang' : 'Kirghiz',
		'code' : 'ky',
		'active' : false
		},

		{
		'lang' : 'Komi',
		'code' : 'kv',
		'active' : false
		},

		{
		'lang' : 'Kongo',
		'code' : 'kg',
		'active' : false
		},

		{
		'lang' : 'Korean',
		'code' : 'ko',
		'active' : false
		},

		{
		'lang' : 'Kuanyama; Kwanyama',
		'code' : 'kj',
		'active' : false
		},

		{
		'lang' : 'Kurdish',
		'code' : 'ku',
		'active' : false
		},

		{
		'lang' : 'Lao',
		'code' : 'lo',
		'active' : false
		},

		{
		'lang' : 'Latin',
		'code' : 'la',
		'active' : false
		},

		{
		'lang' : 'Latvian',
		'code' : 'lv',
		'active' : false
		},

		{
		'lang' : 'Limburgish',
		'code' : 'li',
		'active' : false
		},

		{
		'lang' : 'Lingala',
		'code' : 'ln',
		'active' : false
		},

		{
		'lang' : 'Lithuanian',
		'code' : 'lt',
		'active' : false
		},

		{
		'lang' : 'Luba-Katanga',
		'code' : 'lu',
		'active' : false
		},

		{
		'lang' : 'Luxembourgish',
		'code' : 'lb',
		'active' : false
		},

		{
		'lang' : 'Macedonian',
		'code' : 'mk',
		'active' : false
		},

		{
		'lang' : 'Malagasy',
		'code' : 'mg',
		'active' : false
		},

		{
		'lang' : 'Malay',
		'code' : 'ms',
		'active' : false
		},

		{
		'lang' : 'Malayalam',
		'code' : 'ml',
		'active' : false
		},

		{
		'lang' : 'Maltese',
		'code' : 'mt',
		'active' : false
		},

		{
		'lang' : 'Manx',
		'code' : 'gv',
		'active' : false
		},

		{
		'lang' : 'Maori',
		'code' : 'mi',
		'active' : false
		},

		{
		'lang' : 'Marathi',
		'code' : 'mr',
		'active' : false
		},

		{
		'lang' : 'Marshallese',
		'code' : 'mh',
		'active' : false
		},

		{
		'lang' : 'Moldavian; Moldovan',
		'code' : 'mo',
		'active' : false
		},

		{
		'lang' : 'Mongolian',
		'code' : 'mn',
		'active' : false
		},

		{
		'lang' : 'Nauru',
		'code' : 'na',
		'active' : false
		},

		{
		'lang' : 'Navajo; Navaho',
		'code' : 'nv',
		'active' : false
		},

		{
		'lang' : 'Ndonga',
		'code' : 'ng',
		'active' : false
		},

		{
		'lang' : 'Nepali',
		'code' : 'ne',
		'active' : false
		},

		{
		'lang' : 'North Ndebele',
		'code' : 'nd',
		'active' : false
		},

		{
		'lang' : 'Northern Sami',
		'code' : 'se',
		'active' : false
		},

		{
		'lang' : 'Norwegian',
		'code' : 'no',
		'active' : true
		},

		{
		'lang' : 'Norwegian Bokmål',
		'code' : 'nb',
		'active' : false
		},

		{
		'lang' : 'Norwegian Nynorsk',
		'code' : 'nn',
		'active' : false
		},

		{
		'lang' : 'Occitan',
		'code' : 'oc',
		'active' : false
		},

		{
		'lang' : 'Ojibwa',
		'code' : 'oj',
		'active' : false
		},

		{
		'lang' : 'Oriya',
		'code' : 'or',
		'active' : false
		},

		{
		'lang' : 'Oromo',
		'code' : 'om',
		'active' : false
		},

		{
		'lang' : 'Ossetian; Ossetic',
		'code' : 'os',
		'active' : false
		},

		{
		'lang' : 'Pali',
		'code' : 'pi',
		'active' : false
		},

		{
		'lang' : 'Panjabi; Punjabi',
		'code' : 'pa',
		'active' : false
		},

		{
		'lang' : 'Persian',
		'code' : 'fa',
		'active' : false
		},

		{
		'lang' : 'Polish',
		'code' : 'pl',
		'active' : true
		},

		{
		'lang' : 'Portuguese',
		'code' : 'pt',
		'active' : true
		},

		{
		'lang' : 'Pushto; Pashto',
		'code' : 'ps',
		'active' : false
		},

		{
		'lang' : 'Quechua',
		'code' : 'qu',
		'active' : false
		},

		{
		'lang' : 'Romanian',
		'code' : 'ro',
		'active' : true
		},

		{
		'lang' : 'Romansh',
		'code' : 'rm',
		'active' : false
		},

		{
		'lang' : 'Rundi',
		'code' : 'rn',
		'active' : false
		},

		{
		'lang' : 'Russian',
		'code' : 'ru',
		'active' : true
		},

		{
		'lang' : 'Rusyn',
		'code' : 'ry',
		'active' : false
		},

		{
		'lang' : 'Samoan',
		'code' : 'sm',
		'active' : false
		},

		{
		'lang' : 'Sango',
		'code' : 'sg',
		'active' : false
		},

		{
		'lang' : 'Sanskrit',
		'code' : 'sa',
		'active' : false
		},

		{
		'lang' : 'Sardinian',
		'code' : 'sc',
		'active' : false
		},

		{
		'lang' : 'Scottish Gaelic',
		'code' : 'gd',
		'active' : false
		},

		{
		'lang' : 'Serbian',
		'code' : 'sr',
		'active' : false
		},

		{
		'lang' : 'Serbo-Croatian',
		'code' : 'sh',
		'active' : false
		},

		{
		'lang' : 'Shona',
		'code' : 'sn',
		'active' : false
		},

		{
		'lang' : 'Sichuan Yi',
		'code' : 'ii',
		'active' : false
		},

		{
		'lang' : 'Sindhi',
		'code' : 'sd',
		'active' : false
		},

		{
		'lang' : 'Sinhalese',
		'code' : 'si',
		'active' : false
		},

		{
		'lang' : 'Slovak',
		'code' : 'sk',
		'active' : false
		},

		{
		'lang' : 'Slovenian',
		'code' : 'sl',
		'active' : false
		},

		{
		'lang' : 'Somali',
		'code' : 'so',
		'active' : false
		},

		{
		'lang' : 'Sotho, Southern',
		'code' : 'st',
		'active' : false
		},

		{
		'lang' : 'South Ndebele',
		'code' : 'nr',
		'active' : false
		},

		{
		'lang' : 'Spanish; Castilian',
		'code' : 'es',
		'active' : true
		},

		{
		'lang' : 'Sundanese',
		'code' : 'su',
		'active' : false
		},

		{
		'lang' : 'Swahili',
		'code' : 'sw',
		'active' : false
		},

		{
		'lang' : 'Swati',
		'code' : 'ss',
		'active' : false
		},

		{
		'lang' : 'Swedish',
		'code' : 'sv',
		'active' : true
		},

		{
		'lang' : 'Tagalog',
		'code' : 'tl',
		'active' : false
		},

		{
		'lang' : 'Tahitian',
		'code' : 'ty',
		'active' : false
		},

		{
		'lang' : 'Tajik',
		'code' : 'tg',
		'active' : false
		},

		{
		'lang' : 'Tamil',
		'code' : 'ta',
		'active' : false
		},

		{
		'lang' : 'Tatar',
		'code' : 'tt',
		'active' : false
		},

		{
		'lang' : 'Telugu',
		'code' : 'te',
		'active' : false
		},

		{
		'lang' : 'Thai',
		'code' : 'th',
		'active' : false
		},

		{
		'lang' : 'Tibetan',
		'code' : 'bo',
		'active' : false
		},

		{
		'lang' : 'Tigrinya',
		'code' : 'ti',
		'active' : false
		},

		{
		'lang' : 'Tonga',
		'code' : 'to',
		'active' : false
		},

		{
		'lang' : 'Tsonga',
		'code' : 'ts',
		'active' : false
		},

		{
		'lang' : 'Tswana',
		'code' : 'tn',
		'active' : false
		},

		{
		'lang' : 'Turkish',
		'code' : 'tr',
		'active' : true
		},

		{
		'lang' : 'Turkmen',
		'code' : 'tk',
		'active' : false
		},

		{
		'lang' : 'Twi',
		'code' : 'tw',
		'active' : false
		},

		{
		'lang' : 'Uighur',
		'code' : 'ug',
		'active' : false
		},

		{
		'lang' : 'Ukrainian',
		'code' : 'uk',
		'active' : false
		},

		{
		'lang' : 'Urdu',
		'code' : 'ur',
		'active' : false
		},

		{
		'lang' : 'Uzbek',
		'code' : 'uz',
		'active' : false
		},

		{
		'lang' : 'Venda',
		'code' : 've',
		'active' : false
		},

		{
		'lang' : 'Vietnamese',
		'code' : 'vi',
		'active' : false
		},

		{
		'lang' : 'Volapük',
		'code' : 'vo',
		'active' : false
		},

		{
		'lang' : 'Walloon',
		'code' : 'wa',
		'active' : false
		},

		{
		'lang' : 'Welsh',
		'code' : 'cy',
		'active' : false
		},

		{
		'lang' : 'Western Frisian',
		'code' : 'fy',
		'active' : false
		},

		{
		'lang' : 'Wolof',
		'code' : 'wo',
		'active' : false
		},

		{
		'lang' : 'Xhosa',
		'code' : 'xh',
		'active' : false
		},

		{
		'lang' : 'Yiddish',
		'code' : 'yi',
		'active' : false
		},

		{
		'lang' : 'Yoruba',
		'code' : 'yo',
		'active' : false
		},

		{
		'lang' : 'Zhuang; Chuang',
		'code' : 'za',
		'active' : false
		},

		{
			'lang' : 'Zulu', 
			'code' :  'zu'
		}
	];
	
	$provide.factory('langcodesMap', function() {
		var codeMap = {};
		angular.forEach(map, function(value) {
			codeMap[value.code] = value;
		});

		return codeMap;
	});

	$provide.value('langcodes', map);
}]);
