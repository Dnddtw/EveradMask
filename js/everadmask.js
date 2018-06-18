$(window).load(function() {


    // It removes spaces and everything except numbers
    String.prototype.removeSpaces = function() {
        return this.replace(/[^\d/]+/g, '');
    }

    String.prototype.numericOnly = function() {
        return this.replace(/[^\d/"+"\s]+/g, '');
    }

    $.fn.EveradMask = function(format, statement) {
        // this is $input

        if (statement) {
            return;
        }

        var phone = this.val().removeSpaces(),
            formatedPhone = formatedPhoneFunction(format, phone);

        var caretPositionBeforeVal = this.caret().end;

        this.val(formatedPhone);
        var val = this.val();

        selectHere = val[caretPositionBeforeVal - 1] === ' ' ? caretPositionBeforeVal + 1 : caretPositionBeforeVal;
        this.caret(selectHere, selectHere);
    };

    function formatedPhoneFunction(format, phone) {
        var formatedPhone = '';
        for (var i = 0, j = 0; i < phone.length; i++, j++) {
            if (format[j] === ' ') {
                i--;
                formatedPhone += ' ';
            } else {
                formatedPhone += phone[i];
            }
        }
        return formatedPhone
    }

    var phoneField = $('.everad-mask'), //
        inputPattern = '<input type="hidden" name="phone">', // Hidden input for <form> submit.
        country = window.country_code.toUpperCase(), // Country Code from Server
        codeForFormatFunction = 0, // Country code
        onlyCountriesArray = [], // The array of working countries
        internationalFormattingPattern, placeholderFormattingPattern,
        cloud = {
            // The phone formatting patterns
            cloud12: ' *** *** ** ** **',
            cloud11: ' *** ** ** ** **',
            cloud10: ' *** *** ** **',
            cloud9: ' *** *** ***',
            cloud8: ' *** *** **',
            cloud7: ' *** ** **',
            cloudNaN: ' *** *** ** ** **',
            Ukraine12: ' ** *** ** ** ***',
            Ukraine11: ' ** *** ** ** **',
            Ukraine10: ' ** *** ** ***',
            Ukraine9: ' ** *** ** **',
            Ukraine8: ' ** *** ***',
            Ukraine7: ' ** *** **',
            UkraineNaN: ' ** *** ** ** ***'
        },
        isDeleted = false, // If deleted key worked
        countries = {
            'UA': {
                code: "380",
                operator: [ '063', '093', '067', '096', '097', '098', '039', '050', '066', '095', '099', '068', '073', '63', '93', '67', '96', '97', '98', '39', '50', '66', '95', '99', '68', '73' ]
            },
            'BG': {
                code: '359',
                operator: [ '88', '89' ]
            },
            'CR': {
                code: '385',
                operator: [ '91']
            },
            'TH': {
                code: '66',
                operator: [ ]
            },
            'KG': {
                code: '996',
                operator: [ ]
            },
            'CY': {
                code: '357',
                operator: [  ]
            },
            'AM': {
                code: '374',
                operator: [ ]
            },
            'HU': {
                code: '36',
                operator: [ '70', '20' ]
            },
            'BE': {
                code: '32',
                operator: ['486' ]
            },
            'NL': {
                code: '31',
                operator: [ '642', '641', '643', '634' ]
            },
            'GE': {
                code: '995',
                operator: [ '77', '55' ]
            },
            'FR': {
                code: '33',
                operator: [ '13', '57', '60', '80', '81', '82', '607', '660' ]
            },
            'DE': {
                code: '49',
                operator: [ '177', '178', '163', '157', '172', '173', '174', '162', '152' ]
            },
            'LU': {
                code: '352',
                operator: [ '21', '091' ]
            },
            'GR': {
                code: '30',
                operator: [ '693' ]
            },
            'BY': {
                code: '375',
                operator: [ '29', '33', '25' ]
            },
            'IT': {
                code: '39',
                operator: [ '363', '330', '333', '334', '335', '336', '337', '338', '339', '360', '368', '391', '392', '393', '320', '323', '327', '328', '329', '388', '389', '343', '346', '347', '348', '349', '340' ]
            },
            'ES': {
                code: '34',
                operator: [ '609', '618', '619', '630', '636', '638', '639', '646', '648', '649', '650', '659', '669', '676', '679', '690' ]
            },
            'KZ': {
                code: '7',
                operator: [ '705', '777', '701', '702' ]
            },
            'LV': {
                code: '371',
                operator: [ '200', '201', '202', '203', '204', '220', '224', '24', '261', '262', '263', '264', '265', '266', '283', '286', '287', '291', '292', '293', '294', '556', '557', '558', '559', '61', '62', '64', '65', '83', '849', '86', '92' ]
            },
            'LT': {
                code: '370',
                operator: [ '682', '687', '688', '698', '610', '611', '612', '613', '615', '621', '622', '623', '625', '627' ]
            },
            'PL': {
                code: '48',
                operator: [ '501', '502', '503', '504', '505', '506', '507', '508', '509', '600', '602', '668', '692', '696', '880', '888', '886', '889' ]
            },
            'PT': {
                code: '351',
                operator: [ ]
            },
            'EE': {
                code: '372',
                operator: [ '565' ]
            },
            'RO': {
                code: '40',
                operator: [ '72', '74', '75' ]
            },
            'RU': {
                code: '7',
                operator: [ '902', '904', '908', '950', '495', '812', '843', '861', '951', '912', '862', '877', '910', '915', '916', '917', '919', '985', '978', '987', '988', '843', '842', '909', '085', '353', '835', '903', '905', '906', '960', '961', '962', '963', '964', '965', '499', '920', '921', '922', '923', '924', '926', '925', '927', '928', '929' ]
            },
            'SI': {
                code: '386',
                operator: [ '31', '41', '51', '40', '303' ]
            },
            'SK': {
                code: '421',
                operator: [ ]
            },
            'CZ': {
                code: '420',
                operator: [ '603', '605' ]
            },
            'AT': {
                code: '43',
                operator: [ '664', '699' ]
            },
            'MD': {
                code: '373',
                operator: [ '69', '79', '94' ]
            }
        },
        italian = {
            // Italian code operators.
            'Telecom Italia Mobile': [ 363, 330, 333, 334, 335, 336, 337, 338, 339, 360, 368 ],
            'Hutchison 3G': [ 391, 392, 393 ],
            'Wind': [ 320, 323, 327, 328, 329, 380, 388, 389 ],
            'Vodafone': [ 343, 346, 347, 348, 349, 340 ]
        },
        nativeCountry = false, // Turn off auto code define, if an user has used a dropdown menu or the countri is native
        noSpacesInputValue = '',
        setCountryDefined = false,
        once = false,
        previousPhone = '0979028542',
        countryPriority = true, // It is turned off, if worked once
        countryChange, // True, if a country was changed
        caretText = 0; // Caret selection length

    phoneField.removeAttr('placeholder');

    $('select').first().children('option').each(function() {
        onlyCountriesArray.push($(this).val().toUpperCase());
    });

    if (onlyCountriesArray.length < 2) {
        onlyCountriesArray = ['DE', 'US', 'GB', 'UA', 'RU', 'HU', 'BU', 'GE', 'IT', 'PT', 'FR', 'KZ', 'RO', 'PL', 'ES', 'CZ', 'SK', 'SI', 'BG', 'HR', 'GR'];
    }

    var saCountries = {};
    var forPrint = [];

    for (var i = 0; i < onlyCountriesArray.length; i++) {
        if (countries.hasOwnProperty(onlyCountriesArray[i])) {
            saCountries[onlyCountriesArray[i]] = countries[onlyCountriesArray[i]];
            forPrint.push(onlyCountriesArray[i]);
        } else {
            saCountries[onlyCountriesArray[i]] = {
                code: '',
                operator: []
            };
        }
    }

    phoneField.intlTelInput({
        initialCountry: 'auto',
        autoPlaceholder: true,
        separateDialCode: true,
        onlyCountries: onlyCountriesArray,
        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            // The function makes formatting code pattern from placeholder.
            var tempPhoneNumber = selectedCountryPlaceholder.split(' '); // Country placeholder


            if (tempPhoneNumber[0].length == 1 || tempPhoneNumber[0].length == 4 || selectedCountryData.iso2 == 'ua') {
                tempPhoneNumber[0] = tempPhoneNumber[0].slice(1); // if is 'ua', skip the first number "097" -> "97"
            } else {
                tempPhoneNumber[tempPhoneNumber.length - 1] = tempPhoneNumber[tempPhoneNumber.length - 1].slice(0, tempPhoneNumber[tempPhoneNumber.length - 1] - 1);
            }

            tempPhoneNumber = tempPhoneNumber.join(' ').trim();
            placeholderFormattingPattern = formatType(selectedCountryPlaceholder); // Country placeholder pattern
            // internationalFormattingPattern = formatType(selectedCountryData.dialCode + ' ' + tempPhoneNumber); // Country code + country placeholder pattern


            // return '+' + selectedCountryData.dialCode + ' ' + formatType(tempPhoneNumber, '');
            return formatType(selectedCountryPlaceholder, "mark", true);
        },
        geoIpLookup: function(callback) {
          callback(country);
        },
        utilsScript: window.cdn_path + "js/utils.js"
    });

    phoneField.on('countrychange', function() {
        // The function changes codeForFormatFunction (Selected Country Code)
        var $this = $(this);
        codeForFormatFunction = $this.intlTelInput("getSelectedCountryData").dialCode;
        // console.log('countrychange');

        if (codeForFormatFunction && once) {
            $this.val('');
            // console.log('Country was changed by it');
            nativeCountry = true;
            once = false;
        }

        if (codeForFormatFunction) {
            // countryChange = true;
            var inputValue = $this.val(),
                codeRegExp =  new RegExp('\\+' + codeForFormatFunction);

                // countryChange = false;

                if (codeRegExp.test(inputValue)) {
                    $this.val('');
                    return;
                }
        } else {
            once = true;
        }
    });

    $('li.country').on('click', function() {
        nativeCountry = true;
        $('input[name="phone"]').val('');
    });

    // print('Внутрішні коди ідентифіковані для таких країн: <strong>' + forPrint + '</strong>');
    // print('Поточна країна: <strong>' + country + '</strong>');

    phoneField.each(function() {
        $(this).after(inputPattern).removeAttr('name');
    });

    $('form').on('submit', function(event) {
        var $thisForm = $(this),
            $submitPhone = $thisForm.find('input[name="phone"]'),
            $testPhone = $thisForm.find('.everad-mask');

        if (!$testPhone.intlTelInput("isValidNumber") && !isDefined) {
        	// event.preventDefault();
        	// console.log($testPhone.intlTelInput('getValidationError'));
            $submitPhone.val('');
        }
    });

    //if (/android|webos|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()) === false) {
            phoneField.on('keydown', function(event) {
                // The function removes numbers with spaces
                if (event.keyCode == 32) { // if spacebar
                    event.preventDefault();
                    return;
                }

                if (event.keyCode == 8) { // if backspace
                    var $input = $(this),
                        localPhone = $input.val().removeSpaces();

                        // print('Форматування номеру відключене для видалення символа.');

                        isDeleted = true;
                        previousPhone = localPhone;
                        //phoneChange($input, localPhone);
                }
            });

            phoneField.on('input', sa_countryCode);

            function phoneFill(input, phone) {

                if (isDefined) {
                    input.closest('form').find('input[name="phone"]').val('+' + phone);
                    // print('Номер для відправки на сервер: <strong>+' + phone + '</strong>.');
                } else {
                    input.closest('form').find('input[name="phone"]').val('+' + codeForFormatFunction + '' + phone);
                    // print('Номер для відправки на сервер: <strong>+' + codeForFormatFunction + '' + phone + '</strong>.');
                }
            }

            function countryCodeFormat(phone, input) {

                // The function transforms "sticky" phone number to correct format
                // var whichFormat;
                phoneFill(input, phone);
                previousPhone = phone;

                var codelength = codeForFormatFunction ? phone.substr(0, codeForFormatFunction.length).length : phone.substr(0, 3).length;
                var formattingPattern = codeForFormatFunction ? placeholderFormattingPattern : '+****************';

                input.EveradMask(formattingPattern, isDefined);
            }

            function sa_countryCode(event) {

                var $input = $(this),
                    phone = $input.val();


                isDefined = /\+/.test(phone);

                if (isDeleted) {
                    isDeleted = false;
                    phoneFill($input, phone)
                    return;
                }

                phone = phone.removeSpaces();

                if (!nativeCountry && !isDefined) {
                    operatorCode($input, phone);
                } else {
                    // console.log('Native country is already detected or it is "+".');
                    UkraineFormat($input, phone)
                }

                countryCodeFormat(phone, $input);
            }
       //}

        function phoneChange(phone) {
            // The function shows a previous phone
            var temp = '';

            for (var i = 0; i < phone.length; i++) {
                if (previousPhone[i] !== phone[i]) {
                    previousPhone = phone;
                    break;
                } else {
                    temp += phone[i];
                }
            }

            return temp
        }

        function operatorCode($input, phone) {
            if (nativeSearchFirst($input, phone) && saCountries[country].code == codeForFormatFunction && phone != codeForFormatFunction ) {
                return;
            }

            if (countryPriority) {
                for (var key in saCountries) {
                    if (saCountries[key].code && saCountries[key].code === phone /*&& saCountries[key].code !== codeForFormatFunction*/) {
                        countryPriority = false;
                        nativeCountry = true;
                        if (key == country) {
                            // console.log('Native Country is "' + key + '"');
                        } else if (key == 'RU' && country == 'KZ') {
                            key = 'KZ';
                            $input.intlTelInput("setCountry", key.toLowerCase());
                            $input.trigger('countrychange');
                            return;
                        }
                        // isDefined = true;

                        // $input.intlTelInput("setCountry", key.toLowerCase()).val('+' + phone);
                        $input.intlTelInput("setCountry", key.toLowerCase()).val('');
                        $input.trigger('countrychange');
                        console.log('Country is ' + key + '. Code is ' + phone);
                        return;
                    }
                }
            }

            var setCountry = flaga(phone.substr(0, 3));

            if (!setCountryDefined && setCountry) {
                var forItalianOperatorCode = phone;
                // setCountryDefined = true;

                $input.intlTelInput("setCountry", setCountry);
                $input.trigger('countrychange');

                // print('Оператор визначений для країни <strong>"' + setCountry + '"</strong>. Прапор та міжнародний код країни змінений.');

                if (setCountry == country) {
                    // console.log('Native Country is "' + key + '"');
                }

                if (setCountry == 'ua') {
                	UkraineFormat($input, phone);
	            } else if (setCountry == 'it') {
	                for (var key in italian) {
	                    var italianOperatorArray = italian[key];
	                    for (var i = 0; i < italianOperatorArray.length; i++) {
	                        if (italianOperatorArray[i] == forItalianOperatorCode) {
	                            // print('Італійський оператор: <b>"' + key + '"</b>');
	                            break;
	                        }
	                    }
	                }
	            }
            }
        }

        function UkraineFormat($input, phone) {
        	if (phone[0] === '0' && codeForFormatFunction === '380' && phone.length > 2) {
                phone = phone.substr(1);
                $input.val(phone);
        	}
        }

        function flaga(phone) {
            // The function defines an entered phone number to input, and returns if it has found an operator code from operators' code list.

            for (var key in saCountries) {
                for (var i = 0; i < saCountries[key].operator.length; i++) {
                    if (phone == saCountries[key].operator[i]) {
                        if (codeForFormatFunction !== '380' && saCountries[key].operator[i].length == 2) {
                            return false;
                        }
                        return key.toLowerCase();
                    }
                }
            }

            return false;
        }

        function print(text) {
            $('.root').prepend('<p>' + text + '</p>');
        }

        function nativeSearchFirst($input, phone) {
            var comparedArray = saCountries[country].operator.slice();
            comparedArray.push(saCountries[country].code);
            return comparedArray.some(function(element, index, array) {
                if (phone == element) {
                    if (phone != '380' && phone[0] === '0') {
                        phone = phone.substr(1);
                		$input.val(phone);
                    }
                    // console.log('Native country is changed, because ' + phone + ' == ' + element);
                    nativeCountry = true;
                }
                return element.indexOf(phone) === 0;
            });

        }



    function formatType(placeholder, mark, statement) {
        // The function makes a placeholder pattern by changing the numbers for the "*"
        var type = '';
        mark = mark || '*';

        for (var i = 0; i < placeholder.length; i++) {
            if (/\s|-/.test(placeholder[i])) {
                type += ' ';
            } else if (/[0-9]/.test(placeholder[i])) {
                if (statement) {
                    type += placeholder[i];
                } else {
                   type += mark;
                }
            }
        }

        return type;
    }
});