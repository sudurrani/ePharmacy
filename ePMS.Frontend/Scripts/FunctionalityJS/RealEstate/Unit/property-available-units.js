$(document).ready(function () {
    $('#btnShowPropertyAvailableUnitsModal').click(function (event) {
        var propertyID = $('#PropertyID').val();
        if (propertyID > 0) {
            getPropertyAvailableUnits();
            $('#modalPropertyAvailableUnits').modal('show');
          
        }
        else {
            infoToastr("First select property", "info");
        }
    });
});
function getPropertyAvailableUnits() {
    ajaxRequest({ url: '/RealEstate/Unit/GetPropertyAvailableUnits', type: 'POST', data: { PropertyID: $('#PropertyID').val() }, callBack: getPropertyAvailableUnitsCallBack });
}
var getPropertyAvailableUnitsCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {        
        generateHTMLTableWithRowsClickFromJSON(responseJSON.resultJSON, 'tablePropertyAvailableUnits');
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function tableRowSelectEvent(dataRow) {   
    $('#modalPropertyAvailableUnits').modal('hide');
    //$('#ID').val(dataRow.ID);
    //getUnitDetail(dataRow.ID); // Commented on 05Nov2024
    ajaxRequest({ url: '/RealEstate/Unit/GetByID', type: 'POST', data: { ID: dataRow.ID }, callBack: GetUnitByIdCallBack });
}
var GetUnitByIdCallBack = function (responseJSON) {
    let unit = responseJSON.resultJSON.Unit;
    let property = responseJSON.resultJSON.Property;
    let features = responseJSON.resultJSON.Features;
    let rents = responseJSON.resultJSON.Rents;
    let parkings = responseJSON.resultJSON.Parkings;    

    let utilityConnections = responseJSON.resultJSON.UtilityConnections;

    setResponseToFormInputs(unit, ['ID']);

    if (responseJSON.resultJSON.AddedOn != null) {

        $('#AddedOn').datepicker();
        $('#AddedOn').datepicker("setDate", getFormattedDate(unit.AddedOn));
    }
    if (responseJSON.resultJSON.AvailableFrom != null) {

        $('#AvailableFrom').datepicker();
        $('#AvailableFrom').datepicker("setDate", getFormattedDate(unit.AvailableFrom));
    }

    loadPropertyDropdownList('PropertyID', unit.PropertyID);
    loadPropertyOwnerDropdownlist('UnitOwnerID', unit.UnitOwnerID);
    loadUnitStatusDropdownList('UnitStatusID', 0);
    setResponseToFormInputs(property, ['Latitude', 'Longitude','ID']);

    setUnitFeaturesByUnitID(features, unit.ID, unit.PropertyID);
    loadUnitFeatureDropdownList('UnitFeaturesFeatures', JSON.parse(features[0].FeatureID));
    let rentObject = {
        IsSuccess: true,
        resultJSON: rents
    };

    //| Rent Detal - I need to populate them here in main view
    $.when(loadLeaseTermDropdownList()).done(function () {
        $.when(getRentDetailPaymentFrequency()).done(function () {
            $.when(getRentDetailPaymentTerm()).done(function () {
                $.when(getRentDetailSecurityDepositEquivalent()).done(function () {
                    $.when(getRentDetailCurrency()).done(function () {
                        getUnitRentDetailCallBack(rentObject);
                    });
                });
            });
        });
    });

    //| Rent Detail Ends

    //# Pictures & Files
    //fKeyIdentifierVal = new Date().getYYYYMMDDHHMMSSMS();
    fKeyIdentifierVal = getYYYYMMDDHHMMSSMS();
    $('#UnitUniqueFKeyIdenfier').val(fKeyIdentifierVal);   
    ajaxRequest({ url: '/RealEstate/Unit/UploadFileCloneGet', type: 'POST', data: { unitID: unit.ID, FKeyIdentifier: fKeyIdentifierVal }, callBack: uploadFileCloneGetCallBack });
    //# Pictures & Files Ends    


    ajaxRequest({
        url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack: function (responseJSON) {
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#AdvanceAgainstLeasesAccountID'), 'Select Account', (unit == null ? 0 : unit.AdvanceAgainstLeasesAccountID));
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#LeaseIncomeAccountID'), 'Select Account', (unit == null ? 0 : unit.LeaseIncomeAccountID));
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#TenantAdvancesAccountID'), 'Select Account', (unit == null ? 0 : unit.TenantAdvancesAccountID));
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#LeaseExpenseAccountID'), 'Select Account', (unit == null ? 0 : unit.LeaseExpenseAccountID));
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#AccountReceivablesID'), 'Select Account', (unit == null ? 0 : unit.AccountReceivablesID));
            bindJQueryDropdownList(JSON.parse(responseJSON), $('#MaintenanceReceivablesID'), 'Select Account', (unit == null ? 0 : unit.MaintenanceReceivablesID));

        }
    }, null, false, true);




    var selectedValue = unit.UnitStatus; //$('#UnitStatusID').find('option:selected').text();
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
    }
    else {
        $('.NotAvailableUntilDate').css('display', 'none');
        $('.AvailableAfterDate').css('display', 'none');
        $('.ReserveUntilDate').css('display', 'none');
        $('.reservation').css('display', 'none');
        $('#ReservationID').val('0');
        $("#ReserveUntilDate").val('');
    }
    if ($('#ReservationID option:selected').text() === 'Reserve Until Date') {
        $('.ReserveUntilDate').css('display', 'block');
    } else {
        $('.ReserveUntilDate').css('display', 'none');
        $("#ReserveUntilDate").val('');

    }

    //getUnitFeaturesPropertyStructureID(responseJSON.resultJSON.ID);
    initMap(unit.Latitude, unit.Longitude);    

}
function getUnitDetail(unitID) {
    ajaxRequest({ url: '/RealEstate/Unit/GetPropertyUnitById', type: 'POST', data: { ID: unitID }, callBack: getPropertyUnitByIdPropertyAvailableCallBack });
    //ajaxRequest({ url: '/RealEstate/UtilityConnection/GetAll', type: 'POST', data: { unitID: unitID }, callBack: getUtilityConnectionsByUnitIdCallBack });
    
    
    ajaxRequest({ url: '/RealEstate/Unit/GetUnitRentDetailById', type: 'POST', data: { unitID: unitID }, callBack: getUnitRentDetailCallBack });

    fKeyIdentifierVal = new Date().getYYYYMMDDHHMMSSMS();    
    $('#UnitUniqueFKeyIdenfier').val(fKeyIdentifierVal);    
    ajaxRequest({ url: '/RealEstate/Unit/UploadFileCloneGet', type: 'POST', data: { unitID: unitID, FKeyIdentifier: fKeyIdentifierVal }, callBack: uploadFileCloneGetCallBack });
}
var getPropertyUnitByIdPropertyAvailableCallBack = function (responseJSON) {    
    setResponseToFormInputs(responseJSON.resultJSON, ['UnitNo', 'Floor', 'ID', 'UnitStatusID']);
    getUnitFeaturesByUnitID(responseJSON.resultJSON.ID, responseJSON.resultJSON.PropertyID);
    if (responseJSON.resultJSON.AddedOn != null) {

        $('#AddedOn').datepicker();
        $('#AddedOn').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.AddedOn));
    }
    if (responseJSON.resultJSON.AvailableFrom != null) {

        $('#AvailableFrom').datepicker();
        $('#AvailableFrom').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.AvailableFrom));
    }
    //loadPropertyDropdownList('PropertyID', responseJSON.resultJSON.PropertyID);
    getPropertyById(responseJSON.resultJSON.PropertyID);
    getPostingAccounts(responseJSON.resultJSON);

    var selectedValue = responseJSON.resultJSON.UnitStatus;// $(this).find('option:selected').text();
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
    if ($('#ReservationID option:selected').text() === 'Reserve Until Date') {
        $('.ReserveUntilDate').css('display', 'block');
        $("#ReserveUntilDate").prop('required', true);
    } else {
        $('.ReserveUntilDate').css('display', 'none');
        $("#ReserveUntilDate").prop('required', false);
        $("#ReserveUntilDate").val('');
    }
}

var uploadFileCloneGetCallBack = function (responseJSON) {   
    setUnitUploadPicturesFilesArrayToHTMLTable(responseJSON.resultJSON.UnitUploadPictures);
    setUnitCoverPicturesFilesArrayToHTMLTable(responseJSON.resultJSON.UnitCoverPictures);
    setUnitVideoFilesArrayToHTMLTable(responseJSON.resultJSON.UnitVideo);
    setUnitFloorPlanPicturesFilesArrayToHTMLTable(responseJSON.resultJSON.UnitFloorPlanPictures);
    setUnitFloorPlanVideosFilesArrayToHTMLTable(responseJSON.resultJSON.UnitFloorPlanVideos);
}
datePickerDDMMYYYYFormat('AddedOn');
datePickerDDMMYYYYFormat('AvailableFrom');
datePickerDDMMYYYYFormat('NotAvailableUntilDate');
datePickerDDMMYYYYFormat('AvailableAfterDate');
datePickerDDMMYYYYFormat('ReserveUntilDate');