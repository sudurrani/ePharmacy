var tenantID = 0, controllerAndActionArray = '', formData = {};

$(document).ready(function () {
    //App.formElements();
    controllerAndActionArray = window.location.pathname.split('/');

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        getAndDecryptID(urlParams.get('ID'));
    }

    //$('#TenantTypeID').on('select2:select', function (e) {
    //    loadPartialView($('#TenantTypeID :selected').text());

    //});

});

function loadPartialView(tenantType) {
    var partialViewUrl = '';
    if (tenantType == 'Individual') {
        $('.card-title').text('Individual Tenant');
        partialViewUrl = "/RealEstate/Tenant/GetIndividualDetailPartialView";
    }
    else if (tenantType == 'Corporate') {
        $('.card-title').text('Corporate');
        partialViewUrl = "/RealEstate/Tenant/GetCorporateDetailPartialView";
    }
    ajaxRequest({ url: partialViewUrl, type: 'Get', data: {}, callBack: loadPartialViewCallBack }, 'html');
}
var loadPartialViewCallBack = function (response) {
    $.when($("#tenantContainer").html("").append(response)).done(function () {
        if ($('#TenantType').val() == 'Individual') {
            getTenantHousematesData();
            //loadTenantProfessionDropdownList('ProfessionID', formData.ProfessionID);
            getIndividualTenantUploadedFilesByFKey(formData.RefCustomerID);
        }
        else {
            //loadTenantBusinessActivityDropdownList('BusinessActivityID', formData.BusinessActivityID);
            getCorporateTenantUploadedFilesByFKey(formData.RefCustomerID);
        }
        setResponseToFormInputs(formData);
        $('.card-title').text('' + $('#TenantType').val() + ' Tenant (' + formData.Title + '. ' + formData.FirstName + ' ' + formData.LastName + ')');
        //loadCountryDropdownlist('CountryID', formData.CountryID, formData.StateID);
        //loadTableData();
    });
}

var getAndDecryptIDCallBack = function (responseJSON) {
    $('#ID').val(responseJSON);
    tenantID = responseJSON;
    if ($('#TenantType').val() == 'Individual') {
        getTenantHousematesData();
    }
    if (parseInt(responseJSON) > 0) {

        ajaxRequest({ url: '/RealEstate/Tenant/GetDetailById', type: 'POST', data: { ID: responseJSON }, callBack: getDetailByIdCallBack });
        //ajaxRequest({ url: '/RealEstate/File/Get', type: 'POST', data: { fkey: tenantID, entity: 'IndividualTenant' }, callBack: documentAttachmentsCallBack });

    }
}
var getDetailByIdCallBack = function (responseJSON) {    
    $.when(loadPartialView(responseJSON.resultJSON.TenantType)).done(function () {
        formData = responseJSON.resultJSON;
        setResponseToFormInputs(responseJSON.resultJSON);
        //set data to lblTenantName here
    });
}

function isUsernameExist() {
    if ($('#Username').val() != null) {
        ajaxRequest({ url: '/RealEstate/Tenant/GetByUsername', type: 'POST', data: { Username: $('#Username').val() }, callBack: isUsernameExistCallBack });
    }
    else {
        saveRecord();
    }
}
var isUsernameExistCallBack = function (responseJSON) {
    if (responseJSON.resultJSON == null) {
        saveRecord();
    }
    else {
        infoToastr('Username (' + $('#Username').val() + ') already exist please try another one', 'info');
    }
}
function loadTableData() {
    ajaxRequest({ url: "/RealEstate/Tenant/GetLeaseAgreements", type: 'POST', data: { TenantID: $('#ID').val() }, callBack: loadTableDataCallBack });
}
var loadTableDataCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'TenantHistoryTable', '/RealEstate/LeaseAgreement/Preview?isOnlyPreview=true&id=', 'AgreementNo', '_blank', false);
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}
function inputKeyUpEvent(event) {

    $('.card-title').text('Individual Tenant (' + $("#Title").val() + '. ' + $("#FirstName").val() + ' ' + $("#LastName").val() + ')');
}
var getTenantHousematesData = function () {
    ajaxRequest({ url: '/RealEstate/TenantHousemates/GetByTenant', type: 'POST', data: { TenantID: tenantID }, callBack: getTenantHousematesDataCallBack });

}
var getTenantHousematesDataCallBack = function (responseJSON) {
    $('#TenantHousematesTable tbody').html('');
    var addedTenantHousemates = [];
    $.each(responseJSON.resultJSON, function (index, rowItem) {
        tableRow =
            `<tr id="total-row" style="font-size:13px;">
                    <td class="tdID" hidden>`+ rowItem.ID + `</td>
                    <td class="tdName pl-1 pr-1">`+ rowItem.Name + `</td>
                    <td class="tdRelation pl-1 pr-1">`+ rowItem.Relation + `</td>
                </tr>
            `
        $('#TenantHousematesTable tbody').append(tableRow);
        addedTenantHousemates.push(rowItem.ID);
    });
}