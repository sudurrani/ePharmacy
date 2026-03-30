var _unitFeaturesArray = [];
$(function () {

});
//Function to Load Property Type Dropdown
var inputTypeID = '', typeSelectedValue = 0;
function loadPropertyTypeDropdownList(inputID, selectedValue = 0, defaultText = null, addNewOption = null) {
    inputTypeID = inputID;
    typeSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.PropertyType]') == null) {
        ajaxRequest({
            url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyType]' }, callBack: loadPropertyTypeDropdownListCallBack, defaultText: defaultText, addNewOption: addNewOption
        });
    } else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.PropertyType]')), $('#' + inputTypeID), (defaultText == null ? 'Select Property Type' : defaultText), typeSelectedValue, null, addNewOption);
    }
}
var loadPropertyTypeDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputTypeID), (options.defaultText == null ? 'Select Property Type' : options.defaultText), typeSelectedValue, null, options.addNewOption);
        localStorage.setItem('[Setup.PropertyType]', JSON.stringify(responseJSON.resultJSON));
    }
}

var inputStatusID = '', statusSelectedValue = 0;
//Function to LOad Property Status Dropdown
function loadPropertyStatusDropdownList(inputID, selectedValue = 0, defaultText = null) {
    inputStatusID = inputID;
    statusSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.PropertyStatus]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyStatus]' }, callBack: loadPropertyStatusDropdownListCallBack, defaultText: defaultText });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.PropertyStatus]')), $('#' + inputStatusID), (defaultText == null ? 'Select Status' : defaultText), statusSelectedValue);
    }
}
var loadPropertyStatusDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputStatusID), (options.defaultText == null ? 'Select Status' : options.defaultText), statusSelectedValue);
    localStorage.setItem('[Setup.PropertyStatus]', JSON.stringify(responseJSON.resultJSON));
}


var inputUnitStatusID = '', unitStatusSelectedValue = 0;
//Function to LOad Property Status Dropdown
function loadUnitStatusDropdownList(inputID, selectedValue = 0, defaultText = null) {

    inputUnitStatusID = inputID;
    unitStatusSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.UnitStatus]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitStatus]' }, callBack: loadUnitStatusDropdownListCallBack, defaultText: defaultText });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.UnitStatus]')), $('#' + inputUnitStatusID), (defaultText == null ? 'Select Unit Status' : defaultText), unitStatusSelectedValue);
    }
}
var loadUnitStatusDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitStatusID), (options.defaultText == null ? 'Select Unit Status' : options.defaultText), unitStatusSelectedValue);
    localStorage.setItem('[Setup.UnitStatus]', JSON.stringify(responseJSON.resultJSON));
}


var inputUnitTypeID = '', unitTypeSelectedValue = 0;
function loadUnitTypeDropdownList(inputID, selectedValue = 0) {
    inputUnitTypeID = inputID;
    unitTypeSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.UnitType]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitType]' }, callBack: loadUnitTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.UnitType]')), $('#' + inputUnitTypeID), 'Select Property Type', unitTypeSelectedValue);
    }
}
var loadUnitTypeDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitTypeID), 'Select Unit Type', unitTypeSelectedValue);
    localStorage.setItem('[Setup.UnitType]', JSON.stringify(responseJSON.resultJSON));
}


//Function to LOad Unit Type Dropdown
var inputFeaturesID = '', featuresSelectedValue = 0;
function loadPropertyFeatureDropdownList(inputID, selectedValue = 0, addNewOption = null) {    
    inputFeaturesID = inputID;
    featuresSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.PropertyFeature]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyFeature]' }, callBack: loadPropertyFeatureDropdownListCallBack, addNewOption: addNewOption });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.PropertyFeature]')), $('#' + inputFeaturesID), 'Select Feature', featuresSelectedValue,null, addNewOption);
    }
}
var loadPropertyFeatureDropdownListCallBack = function (responseJSON, options) {
    if (featuresSelectedValue == 0) {
        if ($('#' + inputFeaturesID).val() != '' | $('#' + inputFeaturesID).val() != null) {
            featuresSelectedValue = $('#' + inputFeaturesID).val();
        }
    }    
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputFeaturesID), 'Select Feature', featuresSelectedValue,null, options.addNewOption);
    localStorage.setItem('[Setup.PropertyFeature]', JSON.stringify(responseJSON.resultJSON));
    $('#' + inputFeaturesID).val(featuresSelectedValue);
    $('#' + inputFeaturesID).change();
}


var inputUnitFeaturesID = '', unitFeaturesSelectedValue = 0;
function loadUnitFeatureDropdownList(inputID, selectedValue = 0, addNewOption = null) {
    inputUnitFeaturesID = inputID;
    unitFeaturesSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.UnitFeature]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitFeature]' }, callBack: loadUnitFeatureDropdownListCallBack, addNewOption: addNewOption });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.UnitFeature]')), $('#' + inputUnitFeaturesID), 'Select Property Type', unitFeaturesSelectedValue,null, addNewOption);
        _unitFeaturesArray = JSON.parse(localStorage.getItem('[Setup.UnitFeature]'));
    }
}
var loadUnitFeatureDropdownListCallBack = function (responseJSON,options) {
    if (unitFeaturesSelectedValue == 0) {
        if ($('#' + inputUnitFeaturesID).val() != '' | $('#' + inputUnitFeaturesID).val() != null) {
            unitFeaturesSelectedValue = $('#' + inputUnitFeaturesID).val();
        }
    }
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitFeaturesID), 'Select Property Feature', unitFeaturesSelectedValue,null, options.addNewOption);
    localStorage.setItem('[Setup.UnitFeature]', JSON.stringify(responseJSON.resultJSON));
    _unitFeaturesArray = responseJSON.resultJSON;
    $('#' + inputUnitFeaturesID).val(unitFeaturesSelectedValue);
    $('#' + inputUnitFeaturesID).change();
}



//Function to Load Property Owner
var inputLanlordID = '', landLordSelectedValue = 0;
function loadPropertyOwnerDropdownlist(inputID, selectedValue = 0) {
    inputLanlordID = inputID;
    landLordSelectedValue = selectedValue;
    if (localStorage.getItem('[Landlord]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Landlord]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPropertyOwnerDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Landlord]')), $('#' + inputLanlordID), 'Select Owner', landLordSelectedValue);
        //getOwnerDetail(landLordSelectedValue);
    }
}
var loadPropertyOwnerDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputLanlordID), 'Select Property Owner', landLordSelectedValue);
    localStorage.setItem('[Landlord]', JSON.stringify(responseJSON.resultJSON));

    //getOwnerDetail(landLordSelectedValue);
}

/* Moved Nationality, Country, State and City to the functionality.js/common-dropdowns.js

//Function to Load Country Dropdowns
var inputCountryID = '', countrySelectedValue = 0, stateSelectedValue = 0; _unitSelectedValue = 0;
function loadCountryDropdownlist(inputID, selectedValue = 0, stateSeletedVal, unitSelectedValue = 0) {
    inputCountryID = inputID;
    countrySelectedValue = selectedValue;
    stateSelectedValue = stateSeletedVal;
    _unitSelectedValue = unitSelectedValue;
    if (localStorage.getItem('[Countries]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Countries]', Columns: 'ID Value, Name Text' }, callBack: loadCountryDropdownlistCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Countries]')), $('#' + inputCountryID), 'Select Country', countrySelectedValue);
        loadStateDropdownlist('StateID', $('#' + inputCountryID).val(), stateSelectedValue, unitSelectedValue);
    }
}
var loadCountryDropdownlistCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputCountryID), 'Select Country', countrySelectedValue);
    loadStateDropdownlist('StateID', $('#' + inputCountryID).val(), stateSelectedValue, _unitSelectedValue);
    localStorage.setItem('[Countries]', JSON.stringify(responseJSON.resultJSON));
}


//Function to Load State Dropdowns
var inputStateID = '';
function loadStateDropdownlist(inputID, countryID = 0, selectedValue = 0, unitSelectedValue = 0) {
    inputStateID = inputID;
    stateSelectedValue = selectedValue;
    if (localStorage.getItem('Regions]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Regions]', Columns: 'ID Value, Name Text', Condition: 'WHERE CountryID = ' + countryID + '' }, callBack: loadStateDropdownlistCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Regions]')), $('#' + inputStateID), 'Select State', stateSelectedValue);

    }
    if (selectedValue > 0) {
        loadCityDropdownlist(selectedValue, unitSelectedValue);
    }
}
var loadStateDropdownlistCallBack = function (responseJSON) {

    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputStateID), 'Select State', stateSelectedValue);
    localStorage.setItem('[Regions]', JSON.stringify(responseJSON.resultJSON));

}

//Function to Load City Dropdown

function loadCityDropdownlist(regionID = 0, selectedValue = 0) {
    if (localStorage.getItem('Cities]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Cities]', Columns: 'ID Value, Name Text', Condition: 'WHERE RegionId = ' + regionID + '' }, callBack: loadCityDropdownlistCallBack, id: selectedValue });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Cities]')), $('#CityID'), 'Select City', selectedValue);
    }
}
var loadCityDropdownlistCallBack = function (responseJSON, options) {

    bindJQueryDropdownList(responseJSON.resultJSON, $('#CityID'), 'Select City', options.id);
    localStorage.setItem('[Cities]', JSON.stringify(responseJSON.resultJSON));

}
*/
var inputPropertyID = '', propertySelectedValue = 0;
function loadPropertyDropdownList(inputID, selectedValue, typeID = null) {

    inputPropertyID = inputID;
    propertySelectedValue = selectedValue;
    if (typeID == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Property]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPropertyDropdownListCallBack });
    }
    else {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Property]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0 AND TypeID = ' + typeID + '' }, callBack: loadPropertyDropdownListCallBack });
    }

}
var loadPropertyDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputPropertyID), 'Select Property', propertySelectedValue);

}
function loadPropertyHTMLDropdownList(inputID, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Property]',
            Columns: "ID Value, CONCAT(Name,'|',PropertyID) Text",
            Condition: 'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            var options = [];
            defaultText = defaultText == null ? "Select Property" : defaultText;

            var defaultOption = {
                id: 0,
                text: defaultText,
                html: `<div>${defaultText}</div><div class="text-right" style="font-weight:600;font-size:0.9rem;"></div>`,
                title: defaultText
            };
            if (selectedValue == 0 || selectedValue == null) {
                defaultOption.selected = true;
            }
            options.push(defaultOption);

            $.each(responseJSON.resultJSON, function (index, item) {
                var textSplit = item.Text.split('|');
                var option = {
                    id: item.Value,
                    text: textSplit[0], // keep plain text here
                    html: `<div>${textSplit[0]}</div><div class="text-right" style="font-weight:600;font-size:0.9rem;">${textSplit[1]}</div>`,
                    title: textSplit[0]
                };
                if (item.Value == selectedValue) {
                    option.selected = true;
                }
                options.push(option);
            });

            $("#" + inputID).select2({
                data: options,
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (data) {
                    if (data.loading) {
                        return data.text; // fallback for loading state
                    }
                    return data.html || data.text;
                },
                templateSelection: function (data) {
                    return data.text; // plain text only here to avoid HTML rendering issues
                }
            });
        }
    });
}

function loadPropertyHTMLDropdownList_Old(inputID, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Property]', Columns: "ID Value, CONCAT(Name,'|',PropertyID) Text", Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            var options = [];
            defaultText = defaultText == null ? "Select Property" : defaultText;
            var defaultOption =
            {
                id: 0,
                text: `<div>${defaultText}</div>`,
                html: `<div>${defaultText}</div><div class="text-right" style="font-weight:600;font-size:0.9rem;"></div>`,
                title: defaultText
            };
            if (selectedValue == 0 || selectedValue == null) {
                defaultOption.selected = true;
            }
            options.push(defaultOption);
            $.each(responseJSON.resultJSON, function (index, item) {                
                var textSplit = item.Text.split('|');
                var option =
                {
                    id: item.Value,
                    text: `<div>${textSplit[0]}</div>`,
                    html: `<div>${textSplit[0]}</div><div class="text-right" style="font-weight:600;font-size:0.9rem;">${textSplit[1]}</div>`,
                    title: textSplit[0]
                };
                if (item.Value == selectedValue) {
                    option.selected = true;
                }
                options.push(option);
            });
            $("#" + inputID).select2({
                data: options,
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (data) {
                    return data.html;
                },
                templateSelection: function (data) {
                    return data.text;
                }
            })
        }
    });

}

var inputUnitByPropertyID = '', unitByPropertyIDSelectedValue = 0;
function loadUnitByPropertyIDDropdownList(inputID, selectedValue, propertyID = 0) {
    inputUnitByPropertyID = inputID;
    unitByPropertyIDSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND PropertyID = ' + propertyID + '' }, callBack: loadUnitByPropertyIDDropdownListCallBack });


}
var loadUnitByPropertyIDDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitByPropertyID), 'Select Unit', unitByPropertyIDSelectedValue);

}

var inputLeasableUnitByPropertyID = '', leasableUnitByPropertyIDSelectedValue = 0;
function loadLeasableUnitByPropertyIDDropdownList(inputID, selectedValue, propertyID = 0) {
    inputLeasableUnitByPropertyID = inputID;
    leasableUnitByPropertyIDSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND UnitTypes = \'Leasable\' AND PropertyID = ' + propertyID + '' }, callBack: loadLeasableUnitByPropertyIDDropdownListCallBack });


}
var loadLeasableUnitByPropertyIDDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputLeasableUnitByPropertyID), 'Select Unit', leasableUnitByPropertyIDSelectedValue);

}


//var loadCustomerDropdownListCallBack = function (responseJSON) {
//    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputCustomerID), 'Select Customer', customerIDSelectedValue);
//    localStorage.setItem('Customer', JSON.stringify(responseJSON.resultJSON));
//}


var inputTenantTypeID = '', tenantTypeIDSelectedValue = 0, _defaultText = null;
function loadTenantTypeDropdownList(inputID, selectedValue, defaultText = null) {
    inputTenantTypeID = inputID;
    tenantTypeIDSelectedValue = selectedValue;
    _defaultText = defaultText;
    if (localStorage.getItem('[Setup.TenantType]') == null || localStorage.getItem('[Setup.TenantType]') == 'null') {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.TenantType]', Condition: 'WHERE IsDeleted = 0' }, callBack: loadTenantTypeDropdownListCallBack });
    }
    else {
        var response = JSON.parse(localStorage.getItem('[Setup.TenantType]'));
        if (tenantTypeIDSelectedValue == 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].Text == "Individual") {
                    //$('#TenantTypeID').val(response[i].Value);
                    tenantTypeIDSelectedValue = response[i].Value;
                    break;
                }
            }
        }
        bindJQueryDropdownList(response, $('#TenantTypeID'), _defaultText, tenantTypeIDSelectedValue);



    }
}
var loadTenantTypeDropdownListCallBack = function (responseJSON) {

    if (responseJSON.IsSuccess) {


        if (tenantTypeIDSelectedValue == 0) {
            for (var i = 0; i < responseJSON.resultJSON.length; i++) {

                if (responseJSON.resultJSON[i].Text == "Individual") {
                    //$('#TenantTypeID').val(responseJSON.resultJSON[i].Value);
                    tenantTypeIDSelectedValue = responseJSON.resultJSON[i].Value;
                    break;
                }
            }
        }
        bindJQueryDropdownList(responseJSON.resultJSON, $('#TenantTypeID'), _defaultText, tenantTypeIDSelectedValue);
        localStorage.setItem('[Setup.TenantType]', JSON.stringify(responseJSON.resultJSON));
    }
}


var inputTenantID = '', tenantTypeIDSelectedValue = 0, _defaultText = null;
function loadTenantDropdownList(inputID, selectedValue, defaultText = null) {
    inputTenantID = inputID;
    tenantTypeIDSelectedValue = selectedValue;
    _defaultText = defaultText;
    //localStorage.removeItem('dbo.Tenant');
    //if (localStorage.getItem('dbo.Tenant') == null || localStorage.getItem('dbo.Tenant') == 'null') {
    //    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'dbo.Tenant', Columns: "ID Value, CONCAT(FirstName,' ',LastName) Text", Condition: 'WHERE IsDeleted = 0' }, callBack: loadTenantDropdownListCallBack });
    //}
    /*
        
    else {
        var response = JSON.parse(localStorage.getItem('dbo.Tenant'));
        if (tenantTypeIDSelectedValue == 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].Text == "Individual") {
                    //$('#TenantID').val(response[i].Value);
                    tenantTypeIDSelectedValue = response[i].Value;
                    break;
                }
            }
        }

        bindJQueryDropdownList(response, (inputID == 'TenantID' ? $('#TenantID') : $('#'+inputID)), _defaultText, tenantTypeIDSelectedValue);



    }
    
    */
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.RefCustomer', Columns: "ID Value, Name Text", Condition: 'WHERE IsActive = 1' }, callBack: loadTenantDropdownListCallBack });

}
var loadTenantDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        if (tenantTypeIDSelectedValue == 0) {
            for (var i = 0; i < responseJSON.resultJSON.length; i++) {

                if (responseJSON.resultJSON[i].Text == "Individual") {
                    //$('#TenantID').val(responseJSON.resultJSON[i].Value);
                    tenantTypeIDSelectedValue = responseJSON.resultJSON[i].Value;
                    break;
                }
            }
        }
        bindJQueryDropdownList(responseJSON.resultJSON, (inputTenantID == 'TenantID' ? $('#TenantID') : $('#' + inputTenantID)), _defaultText, tenantTypeIDSelectedValue);
        //localStorage.setItem('dbo.Tenant', JSON.stringify(responseJSON.resultJSON));
    }
}


//| m Temp Template
var inputLeaseTermTemplateID = '', leaseTermTemplateIDSelectedValue = 0;
function loadLeaseTermTemplateDropdownList(inputID, selectedValue) {
    inputLeaseTermTemplateID = inputID;
    leaseTermTemplateIDSelectedValue = selectedValue;
    //if (localStorage.getItem('dbo.LeaseTermTemplate') == null || localStorage.getItem('dbo.LeaseTermTemplate') == 'null') {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[LeaseTermTemplate]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadLeaseTermTemplateDropdownListCallBack });
    //}
    //else {
    //    bindJQueryDropdownList(JSON.parse(localStorage.getItem('dbo.LeaseTermTemplate')), $('#' + inputCustomerID), 'Select Lease Template', customerIDSelectedValue);
    //}

}
var loadLeaseTermTemplateDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputLeaseTermTemplateID), 'Select Template', leaseTermTemplateIDSelectedValue);
    localStorage.setItem('dbo.LeaseTermTemplate', JSON.stringify(responseJSON.resultJSON));
}
function loadLeaseTermTemplateAgreementDropdownList(inputID, selectedValue) {
    ajaxRequest({
        url: '/RealEstate/LeaseTemplate/GetLeaseAgreementDDL', type: 'POST', data: {}, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Template', selectedValue);
        }
    });

}
//| Lease Temp Template

//| Tenant
var inputBusinessActivityID = '', businessActivityIDSelectedValue = 0;
function loadTenantBusinessActivityDropdownList(inputID, selectedValue) {
    inputBusinessActivityID = inputID;
    businessActivityIDSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.TenantBusinessActivity]', Condition: 'WHERE IsDeleted = 0' }, callBack: loadTenantBusinessActivityDropdownListCallBack });
}
var loadTenantBusinessActivityDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputBusinessActivityID), 'Select Business Activity', businessActivityIDSelectedValue);
    }
}

var tenantProfessionID = '', tenantProfessionSelectedValue = 0;
function loadTenantProfessionDropdownList(inputID, selectedValue = 0, defaultText = null, addNewOption = null) {
    tenantProfessionID = inputID;
    tenantProfessionSelectedValue = selectedValue;
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.TenantProfession]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + tenantProfessionID), (defaultText == null ? 'Select Tenant Profession' : defaultText), tenantProfessionSelectedValue, null, addNewOption);
            }
        }
    });
}
//var loadTenantProfessionDropdownListCallBack = function (responseJSON) {
//    if (responseJSON.IsSuccess) {
//        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + tenantProfessionID), 'Select Tenant Profession', tenantProfessionSelectedValue);
//    }
//}

//| Tenant Ends

//Lease Agreement
var leaseAgreementSelectedValue = 0;
function loadLeaseAgreementDropdownList(selectedValue = 0) {
    leaseAgreementSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[LeaseAgreement]', Columns: 'ID Value, AgreementNo Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadLeaseAgreementDropdownListCallBack });
}
var loadLeaseAgreementDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseAgreementID'), 'Select Lease Agreement', leaseAgreementSelectedValue);
    }
}
var leaseAgreementSelectedValue = 0;
function loadUnitLeaseAgreementDropdownList(unitID, selectedValue = 0) {
    leaseAgreementSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'dbo.LeaseAgreement LA, dbo.UnitLeaseAgreementAssociation ULA', Columns: 'LA.ID Value, LA.AgreementNo Text', Condition: 'WHERE LA.IsDeleted = 0 AND ULA.IsDeleted = 0 AND LA.ID = ULA.LeaseAgreementID AND ULA.UnitID = ' + unitID + '' }, callBack: loadUnitLeaseAgreementDropdownListCallBack });
}
var loadUnitLeaseAgreementDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseAgreementID'), 'Select Lease Agreement', leaseAgreementSelectedValue);
    }
}
var leaseAgreementSelectedValue = 0;
function loadUnitLeaseAgreementExceptLatestDropdownList(unitID, latestLeaseAgreementID, selectedValue = 0) {
    leaseAgreementSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'dbo.LeaseAgreement LA, dbo.UnitLeaseAgreementAssociation ULA', Columns: 'LA.ID Value, LA.AgreementNo Text', Condition: 'WHERE LA.IsDeleted = 0 AND ULA.IsDeleted = 0 AND LA.ID = ULA.LeaseAgreementID AND ULA.UnitID = ' + unitID }, callBack: loadUnitLeaseAgreementDropdownListCallBack }); //+ ' AND LA.ID = ' + latestLeaseAgreementID + '' (after unitID)
}
var loadUnitLeaseAgreementDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseAgreementID'), 'Select Lease Agreement', leaseAgreementSelectedValue);
    }
}

function loadTenantLeaseAgreementDropdownList(tenantID, selectedValue = 0) {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'dbo.LeaseAgreement LA', Columns: 'LA.ID Value, LA.AgreementNo Text', Condition: "WHERE LA.IsDeleted = 0 AND LA.Status = 'Executed'  AND LA.TenantID = " + tenantID }, callBack: loadTenantLeaseAgreementDropdownListCallBack, id: selectedValue });
}
var loadTenantLeaseAgreementDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseAgreementID'), 'Select Lease Agreement', options.id);
    }
}
//Lease Agreement Ends

function loadQuotationStatusDropdownList(selectedValue = 0, selectedText = null) {
    quotationStatusIDSelectedValue = selectedValue;
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.QuotationStatus]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON, options) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#StatusID'), 'Select Status', selectedValue, selectedText);
            }
        }
    });
}


function loadPDCsHeaderDropdownList(selectedValue = 0) {
    if (localStorage.getItem('[Setup.PDCsHeader]') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PDCsHeader]', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPDCsHeaderDropdownListCallBack, id: selectedValue });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.PDCsHeader]')), $('#PDCsHeaderID'), 'Select Header', selectedValue);
        _unitFeaturesArray = JSON.parse(localStorage.getItem('[Setup.PDCsHeader]'));
    }
}
var loadPDCsHeaderDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#PDCsHeaderID'), 'Select Header', options.id);
    localStorage.setItem('[Setup.PDCsHeader]', JSON.stringify(responseJSON.resultJSON));
}
function loadTenantTaxesAccountsDropdownList(inputId, selectedValue = 0) {
    ajaxRequest({ url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack: loadTenantTaxesAccountsDropdownListCallBack, id: selectedValue, inputIdAttr: inputId }, null, false);
}
var loadTenantTaxesAccountsDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#' + options.inputIdAttr), 'Select Account', options.id);
}

//Additional Charges Dropdown List

function loadAdditionalChargesDropdownlist(selectedValue = 0) {
    localStorage.removeItem('AdditionalCharges');
    if (localStorage.getItem('AdditionalCharges') == null) {
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[AdditionalCharges]', Columns: 'ID Value, Name Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadAdditionalChargesDropdownlistCallback, id: selectedValue });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('AdditionalCharges')), $('#AdditionalChargesID'), 'Select Charges', selectedValue);
    }
}

var loadAdditionalChargesDropdownlistCallback = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#AdditionalChargesID'), 'Select Charges', options.id);
    localStorage.setItem('AdditionalCharges', JSON.stringify(responseJSON.resultJSON));
}
//segment Drop Down
var inputUnitSegmentID = '', unitSegmentIDSelectedValue = 0;
function loadSegmentDropdownList(inputID, selectedValue) {
    inputUnitSegmentID = inputID;
    unitSegmentIDSelectedValue = selectedValue;

    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitSegment]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadSegmentDropdownListCallBack });


}
var loadSegmentDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitSegmentID), 'Select Segment', unitSegmentIDSelectedValue);
    localStorage.setItem('dbo.LeaseTermTemplate', JSON.stringify(responseJSON.resultJSON));
}
function loadPropertyParkingByStructureIDDropdownlist(inputID, selectedValue = 0, propertyID) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyParkingNumbers]', Columns: 'ID Value, Number Text', Condition: 'WHERE  PropertyID = ' + propertyID + '' }, callBack: function (responseJSON) {

            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Parking', selectedValue);
        }
    });
}
function loadPropertyParkingByStructureIDDropdownlist(inputID, selectedValue = 0, propertyID) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyParkingNumbers]', Columns: 'ID Value, Number Text', Condition: 'WHERE  PropertyID = ' + propertyID + '' }, callBack: function (responseJSON) {

            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Parking', selectedValue);
        }
    });
}
var floorTypeSelectedValue = 0;
function loadFloorTypeDropdownList(selectedValue = 0, propertyID = 0) {
    floorTypeSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/PropertyStructure/GetFloorWithChild', type: 'POST', data: { propertyID: propertyID }, callBack: loadFloorTypeDropdownListCallBack }, null, false);
}
var loadFloorTypeDropdownListCallBack = function (responseJSON) {
    bindJQueryHierarchicalDropdownList(responseJSON.resultJSON, $('#FloorTypeID'), 'Select Floor Type', floorTypeSelectedValue);
}
function loadTenantIdentificationDocumentTypeDropdownList(inputID, selectedValue = 0) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.IdentificationDocumentType]', Columns: 'ID Value, Description Text', Condition: 'WHERE  IsDeleted = 0' }, callBack: function (responseJSON) {

            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Document Type', selectedValue);
        }
    });
}
function loadBankDropdownList(inputID, selectedValue = 0, companyID = 0) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[BHAERPCoreSuite].[dbo].[RefBank]', Columns: 'ID Value, Description Text', Condition: 'WHERE  IsActive = 1' }, callBack: function (responseJSON) {

            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Bank Name', selectedValue);
        }
    });
}
