var landlordID = 0;
$(document).ready(function () {
    $('#UnitStatusID').on('select2:select', function (e) {
        var selectedValue = $(this).find('option:selected').text();
        if (selectedValue === 'Not Available Until Date') {
            $('.AvailableAfterDate').css('display', 'none');
            $('.ReserveUntilDate').css('display', 'none');
            $('.reservation').css('display', 'none');
            $('.NotAvailableUntilDate').css('display', 'block');
            $('#ReservationID').val('0');
            $("#ReserveUntilDate").val('');
        }
        else if (selectedValue === 'Available After Date') {
            $('.NotAvailableUntilDate').css('display', 'none');
            $('.ReserveUntilDate').css('display', 'none');
            $('.reservation').css('display', 'none');
            $('.AvailableAfterDate').css('display', 'block');
            $('#ReservationID').val('0');
            $("#ReserveUntilDate").val('');
        }
        else if (selectedValue === 'Reserve') {
            $('.NotAvailableUntilDate').css('display', 'none');
            $('.AvailableAfterDate').css('display', 'none');
            $('.reservation').css('display', 'block');
            $("#ReserveUntilDate").val('');
            $("#ReservationID").prop('required', true);
        }
        else {
            $('.NotAvailableUntilDate').css('display', 'none');
            $('.AvailableAfterDate').css('display', 'none');
            $('.ReserveUntilDate').css('display', 'none');
            $('.reservation').css('display', 'none');
            $('#ReservationID').val('0');
            $("#ReserveUntilDate").val('');
            $("#ReservationID").prop('required', false);
        }
    });
    $('#ReservationID').on('select2:select', function (e) {
        var selectedValue = $(this).find('option:selected').text();
        if (selectedValue === 'Reserve Until Date') {
            $('.ReserveUntilDate').css('display', 'block');
            $("#ReserveUntilDate").val('');
            $("#ReserveUntilDate").prop('required', true);
        } else {
            $('.ReserveUntilDate').css('display', 'none');
            $("#ReserveUntilDate").prop('required', false);
            $("#ReserveUntilDate").val('');

        }

    });
});

function getPropertyById(propertyID = 0) {
    ajaxRequest({ url: '/RealEstate/Unit/GetPropertyDetailByID', type: 'POST', data: { ID: propertyID }, callBack: getPropertyByIdCallBack}, null, false);
}
var getPropertyByIdCallBack = function (responseJSON) {    
    setResponseToFormInputs(responseJSON.resultJSON);
    loadTypeWithChildDropdownList(0, responseJSON.resultJSON.PropertyID);
}

function loadRentTypeDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.RentType]' }, callBack: loadRentTypeDropdownListCallBack });
}
var loadRentTypeDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#RentType'), 'Select Rent Type');
}

var loadPropertyTypeDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#PropertyType'), 'Select Property Type');

}

//function loadUnitStatusDropdownList() {
//    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitStatus]' }, callBack: loadUnitStatusDropdownListCallBack });
//}

//var loadUnitStatusDropdownListCallBack = function (responseJSON) {
//    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitStatusID'), 'Select Unit Status');

//}

function loadUnitTypeDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitType]' }, callBack: loadUnitTypeDropdownListCallBack });
}

var loadUnitTypeDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitType'), 'Select Unit Type');

}


//function loadCountryDropdownlist() {
//    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Countries]', Columns: 'ID Value, Name Text' }, callBack: loadCountryDropdownlistCallBack });
//}
//var loadCountryDropdownlistCallBack = function (responseJSON) {
//    bindJQueryDropdownList(responseJSON.resultJSON, $('#Country'), 'Select Country');
//}
//var getPropertyUnitByIdCallBack = function (responseJSON) {
//    setResponseToFormInputs(responseJSON.resultJSON);

//    if (responseJSON.resultJSON.AddedOn != null) {

//        $('#AddedOn').datepicker();
//        $('#AddedOn').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.AddedOn));
//    }
//    if (responseJSON.resultJSON.AvailableFrom != null) {

//        $('#AvailableFrom').datepicker();
//        $('#AvailableFrom').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.AvailableFrom));
//    }
//    loadPropertyDropdownList('PropertyID', responseJSON.resultJSON.PropertyID);
//    loadPropertyOwnerDropdownlist('UnitOwnerID', responseJSON.resultJSON.UnitOwnerID);
//    loadUnitStatusDropdownList('UnitStatusID', responseJSON.resultJSON.UnitStatusID);
//    //loadUnitFeatureDropdownList('UnitFeaturesFeatures', 0);
//    getPropertyById(responseJSON.resultJSON.PropertyID);
//    getPostingAccounts(responseJSON.resultJSON);
//    //alert(responseJSON.resultJSON.UnitStatusID);
//    var selectedValue = responseJSON.resultJSON.UnitStatus; //$('#UnitStatusID').find('option:selected').text();
//    if (selectedValue === 'Not Available Until Date') {
//        $('.AvailableAfterDate').css('display', 'none');
//        $('.ReserveUntilDate').css('display', 'none');
//        $('.reservation').css('display', 'none');
//        $('.NotAvailableUntilDate').css('display', 'block');
//        $('#ReservationID').val('0');
//        $("#ReserveUntilDate").val('');
//    }
//    else if (selectedValue === 'Available After Date') {
//        $('.NotAvailableUntilDate').css('display', 'none');
//        $('.ReserveUntilDate').css('display', 'none');
//        $('.reservation').css('display', 'none');
//        $('.AvailableAfterDate').css('display', 'block');
//        $('#ReservationID').val('0');
//        $("#ReserveUntilDate").val('');
//    }
//    else if (selectedValue === 'Reserve') {
//        $('.NotAvailableUntilDate').css('display', 'none');
//        $('.AvailableAfterDate').css('display', 'none');
//        $('.reservation').css('display', 'block');
//    }
//    else {
//        $('.NotAvailableUntilDate').css('display', 'none');
//        $('.AvailableAfterDate').css('display', 'none');
//        $('.ReserveUntilDate').css('display', 'none');
//        $('.reservation').css('display', 'none');
//        $('#ReservationID').val('0');
//        $("#ReserveUntilDate").val('');
//    }
//    if ($('#ReservationID option:selected').text() === 'Reserve Until Date') {
//        $('.ReserveUntilDate').css('display', 'block');
//    } else {
//        $('.ReserveUntilDate').css('display', 'none');
//        $("#ReserveUntilDate").val('');

//    }

//    getUnitFeaturesPropertyStructureID(responseJSON.resultJSON.ID);
//    initMap(responseJSON.resultJSON.Latitude, responseJSON.resultJSON.Longitude);
//}
//Date are commented due to error on 7 July 2025
datePickerDDMMYYYYFormat('AddedOn', true);
datePickerDDMMYYYYFormat('AvailableFrom');
datePickerDDMMYYYYFormat('NotAvailableUntilDate');
datePickerDDMMYYYYFormat('AvailableAfterDate');
datePickerDDMMYYYYFormat('ReserveUntilDate');