var tenantID = 0, controllerAndActionArray = '', formData = {}, _uploadedFileIdsJSONArray = [];
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",

        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    controllerAndActionArray = window.location.pathname.split('/');
    if (controllerAndActionArray[(controllerAndActionArray.length - 1)] == 'Add') {
        $.when(loadTenantTypeDropdownList('TenantTypeID', 0)).done(function () {
            //loadTenantTypeDropdownList('TenantTypeID', 0);
            loadPartialView('Individual');//$('#TenantTypeID :selected').text()
        });
    }
    else if (controllerAndActionArray[(controllerAndActionArray.length - 1)] == 'Update') {
        //loadNationalityDropdownList();
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('ID')) {
            getAndDecryptID(urlParams.get('ID'));
        }
    }
    $('#TenantTypeID').on('select2:select', function (e) {
        loadPartialView($('#TenantTypeID :selected').text());
    });

    $('#btnSave').click(function (event) {
        event.preventDefault();
        if ($('#TenantTypeID').val() == 0 || $('#TenantTypeID').val() == null) {

            $('#TenantTypeID').addClass('invalid');
            $('#TenantTypeID').attr('title', 'This field is required');
            $('#TenantTypeID').removeClass("invalid");
            $('#TenantTypeID').next("span").next("span").remove();
            $('#TenantTypeID').next('span').after("<span style='color:red;'>" + 'This field is required' + "</span>");
            return false;

        }
        else {
            $('#TenantTypeID').removeClass("invalid");
            $('#TenantTypeID').next("span").next("span").remove();
        }
        if (customValidateForm('SaveTenantPersonalForm')) {
            isUsernameExist(); //saveRecord() is called in isUsernameExist() function if Username not exist
        }
        /*
        successToastr('Record saved successfully', 'Success');
        infoToastr('Show on failed validation', 'Info');
        warningToastr('Warning', 'Warning');
        errorToastr('Error tastr', 'Error');
        */
    });
    //$.when(loadAccompaniesDropdownList()).done(function () {


    //});
});
function saveRecord(isCloseAndSaveAsDraft = false) {
    if ($('#TenantTypeID').val() == 0 || $('#TenantTypeID').val() == null) {
        $('#TenantTypeID').addClass('invalid');
        $('#TenantTypeID').attr('title', 'This field is required');
        $('#TenantTypeID').removeClass("invalid");
        $('#TenantTypeID').next("span").next("span").remove();
        $('#TenantTypeID').next('span').after("<span style='color:red;'>" + 'This field is required' + "</span>");
        return false;
    }
    else {
        $('#TenantTypeID').removeClass("invalid");
        $('#TenantTypeID').next("span").next("span").remove();
    }
    if (customValidateForm('SaveTenantPersonalForm')) {
        var inputJSON = getFormDataAsJSONObject('SaveTenantPersonalForm', inputJSON);
        inputJSON['FKeyIdentifier'] = fKeyIdentifierVal;
        inputJSON['TenantTypeId'] = $('#TenantTypeID').val();
        var tenantHousemates = [];
        if ($('#TenantTypeID :selected').text() == 'Individual') {
            tenantHousemates = getHousematesData();
            if (tenantHousemates === null) {
                return false;
            }
        }
        inputJSON['TenantHousemates'] = tenantHousemates;
        ajaxRequest({ url: "/RealEstate/Tenant/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });
    }
    else {
        infoToastr('Required field(s) missing in Personal Detail', 'Info');
    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        $("#ID").val(responseJSON.resultJSON);
        successToastr('Record saved successfully', 'Success');
        //swal.fire("", responseJSON.Message, 'success');
        // Commented by Aman 3/20/2024
        //localStorage.removeItem('dbo.Tenant');
        //setTimeout(function () {
        //    window.location.href = '/RealEstate/Tenant/List?FID=4/0CaivPrmAWHbcMqcscdg==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        //}, 2000);
        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/RealEstate/Tenant/List?userid=60172&projectid=60197';
            }, 2000);
        }
        if ($('#TenantTypeID :selected').text() == 'Individual') {

            //uploadFiles({ url: '/RealEstate/File/Upload', inputID: 'IndividualIdCardFiles', entity: 'IndividualTenantIDCard', fKey: responseJSON.resultJSON, callBack: individualTenantIDCardCallBack });
        }
        else {
            // uploadFiles({ url: '/RealEstate/File/Upload', inputID: 'CorporatTenantUploadFiles', entity: 'CorporateTenantTradeLicence', fKey: $("#ID").val(), callBack: saveRecordAndUploadFileCallBack });
        }



    }
    else {
        //swal.fire("", responseJSON.Message, responseJSON.Type);
        errorToastr(responseJSON.Message, 'Error');
    }
}
function loadPartialView(tenantType) {
    var partialViewUrl = '';
    if (tenantType == 'Individual') {
        partialViewUrl = "/RealEstate/Tenant/GetIndividualPartialView";
    }
    else if (tenantType == 'Corporate') {
        partialViewUrl = "/RealEstate/Tenant/GetCorporatePartialView";
    }
    $('.card-title').text('' + tenantType + ' Tenant');
    ajaxRequest({ url: partialViewUrl, type: 'Get', data: {}, callBack: loadPartialViewCallBack, tenantType: tenantType }, 'html');
}
var loadPartialViewCallBack = function (response, options) {
    $.when($("#tenantContainer").html("").append(response)).done(function () {
        //if ($('#TenantTypeID :selected').text() == 'Individual') {
        $("select.selector_2").select2({
            width: "100%",
            placeholder: "Select an option",

            minimumResultsForSearch: 0,
        });
        $(".mutiple_sel").select2({ width: "style" });
        if (options.tenantType == 'Individual') {
            //getTenantAccompany();
            loadTenantProfessionDropdownList('ProfessionID', formData.ProfessionID, null, { text: 'Add New Profession', function: 'newTenantProfession' });
            loadTenantIdentificationDocumentTypeDropdownList('DocumentTypeID', formData.DocumentTypeID);
            loadCustomerControlAccountsDropdownList("ControlAccountID", formData.ControlAccountID);

            if (controllerAndActionArray[(controllerAndActionArray.length - 1)] == 'Update') {
                getIndividualTenantUploadedFilesByFKey(formData.ID);
                getTenantHousematesData();
                $('#ControlAccountID').attr('disabled', true);
            }
            else {
                getIndividualTenantUploadedFilesByFKey(0);
                $('#li-StatementofAccount').css('display', 'none');
            }
        }
        else {

            loadTenantBusinessActivityDropdownList('BusinessActivityID', formData.BusinessActivityID);
            loadCustomerControlAccountsDropdownList("ControlAccountID", formData.ControlAccountID);
            if (controllerAndActionArray[(controllerAndActionArray.length - 1)] == 'Update') {
                getCorporateTenantUploadedFilesByFKey(formData.ID);
                $('#ControlAccountID').attr('disabled', true);
            }
            else {
                getCorporateTenantUploadedFilesByFKey(0);
                $('#li-StatementofAccount').css('display', 'none');
            }
        }
        if (controllerAndActionArray[(controllerAndActionArray.length - 1)] == 'Update') {
            setResponseToFormInputs(formData, ['TenantTypeID']);

            $('.card-title').text('' + $('#TenantTypeID :selected').text() + ' Tenant (' + formData.Title + '. ' + formData.FirstName + ' ' + formData.LastName + ')');
            loadTableData();
        }
        loadCountryDropdownlist('CountryID', formData.CountryID, formData.StateID);
        loadNationalityDropdownList('NationalityID', formData.NationalityID);
    });
}
var getTenantHousematesData = function () {
    ajaxRequest({ url: '/RealEstate/TenantHousemates/GetByTenant', type: 'POST', data: { TenantID: tenantID }, callBack: getTenantHousematesDataCallBack });

}
var getTenantHousematesDataCallBack = function (responseJSON) {
    $('#TenantHousematesTable tbody').html('');  
    if (responseJSON.resultJSON.length > 0) {
        var addedTenantHousematesArray = [];
        $.each(responseJSON.resultJSON, function (index, rowItem) {
            tableRow =
                `<tr id="total-row" style="font-size:13px;">
                    <td class="tdID pt-0 pb-0" hidden>`+ rowItem.ID + `</td>
                    <td class="tdName pl-1 pr-1 pt-0 pb-0">
                        <div class="selector" style="margin-top:0px !important;">
                            <input class="js-states form-control bha-input w-100 mt-0" value="`+ rowItem.Name + `">
                        </div>                        
                    </td>
                    <td class="tdRelation pl-1 pr-1 pt-0 pb-0">
                        <div class="selector" style="margin-top:0px !important;">
                            <input class="js-states form-control bha-input w-100 mt-0" value="`+ rowItem.Relation + `">
                        </div>                        
                     </td>
                    <td class="tdAction text-center pt-0 pb-0">
                        <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;display:none;" onclick="addTenantHousematesRow(this)"></i>
                        <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTenantHousematesRow($(this))"></i>
                        
                    </td>
                </tr>
            `
            $('#TenantHousematesTable tbody').append(tableRow);
            addedTenantHousematesArray.push(rowItem.ID);

            /*
            <span class="red-tooltip" data-toggle="tooltip" title="" data-original-title="">
                                <button type="button" class="btn bg-danger btn-sm" style="padding: 0;width:2.1rem;height: 2rem;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;" onclick="removeTenantHousematesRow($(this));">
                                    <i class="fa fa-times" style="padding:0;color:#fff;"></i>
                                </button>
                            </span>
            */
        });
        $('#TenantHousematesTable tbody tr').last().find('td.tdAction').find('i.bi-plus-circle').show();
    }
    else {
        tableRow =
            `   <tr>
                <td class="tdID" hidden></td>
                <td class="tdName pl-1 pr-1"><input type="text" class="js-states form-control bha-input w-100 mt-0"></td>
                <td class="tdRelation pl-1 pr-1"><input type="text" class="js-states form-control bha-input w-100 mt-0"></td>
                <td class="tdAction text-center">
                    <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addTenantHousematesRow(this)"></i>
                    <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTenantHousematesRow(this)"></i>
                </td>
                 </tr>
            `
        $('#TenantHousematesTable tbody').append(tableRow);
    }
  
}
var getAndDecryptIDCallBack = function (responseJSON) {
    //getIndividualUploadedFilesByFKey(responseJSON);
    //getCorporateTenantUploadedFilesByFKey(responseJSON);
    $('#ID').val(responseJSON);
    tenantID = responseJSON;

    if (parseInt(responseJSON) > 0) {


        ajaxRequest({ url: '/RealEstate/Tenant/GetTenantById', type: 'POST', data: { ID: responseJSON }, callBack: getTenantByIdCallBack });
        //ajaxRequest({ url: '/RealEstate/File/Get', type: 'POST', data: { fkey: $('#ID').val(), entity: 'IndividualTenant' }, callBack: documentAttachmentsCallBack }); //getTenantIndividualIdCardFilesByIdCallBack });

        //ajaxRequest({ url: '/RealEstate/File/Get', type: 'POST', data: { fkey: $('#ID').val(), entity: 'IndividualTenantPassport' }, callBack: getTenantIndividualUploadFilesCallBack });
        //ajaxRequest({ url: '/RealEstate/File/Get', type: 'POST', data: { fkey: $('#ID').val(), entity: 'CorporateTenantTradeLicence' }, callBack: getCorporateTenantTradeLicenceCallBack });
    }

}
var getTenantByIdCallBack = function (responseJSON) {

    formData = responseJSON.resultJSON;
    setResponseToFormInputs(responseJSON.resultJSON);
    console.log(formData)
    /*loadTenantProfessionDropdownList('ProfessionID', responseJSON.resultJSON.ProfessionID);*/
    /*loadTenantBusinessActivityDropdownList('BusinessActivityID', responseJSON.resultJSON.BusinessActivityID);*/
    /* loadCountryDropdownlist('CountryID', responseJSON.resultJSON.CountryID, responseJSON.resultJSON.StateID);*/
    $.when(loadTenantTypeDropdownList('TenantTypeID', responseJSON.resultJSON.TenantTypeID)).done(function () {
        loadPartialView(responseJSON.resultJSON.TenantType);
        $('#TenantTypeID').select2('enable', false);
        if ($('#TenantTypeID :selected').text() == 'Individual') {
            getTenantHousematesData();
        }
    });
}
function isUsernameExist() {
    if ($('#Username').val() != null) {
        ajaxRequest({ url: '/RealEstate/Tenant/GetByUsername', type: 'POST', data: { Username: $('#Username').val() }, callBack: isUsernameExistCallBack });
    }
    //else {
    //    saveRecord();
    //}
}
var isUsernameExistCallBack = function (responseJSON) {
    if (responseJSON.resultJSON != null && responseJSON.resultJSON.ID != $('#ID').val()) {// || responseJSON.resultJSON.RefCustomerID != $('#RefCustomerID').val())) {
        infoToastr('Username (' + $('#Username').val() + ') already exist please try another one', 'info');
        return;
    }
    else {
        saveRecord(false);
    }
}
function loadTableData() {
    ajaxRequest({ url: "/RealEstate/Tenant/GetLeaseAgreements", type: 'POST', data: { TenantID: $('#RefCustomerID').val() }, callBack: loadTableDataCallBack });
}
var loadTableDataCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {

        //generateTableRowsFromJSON(responseJSON.resultJSON, 'LeaseAgreement', '/RealEstate/LeaseAgreement/Preview?isOnlyPreview=true&id=', 'AgreementNo', '_blank', false);
        //generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'tblTenantDetail', ['/RealEstate/LeaseAgreement/Preview?isOnlyPreview=true&id=', '/RealEstate/Unit/Detail?Id='], ['AgreementNo', 'StartDate'], ['_blank', '_blank'], false);
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'TenantHistory', '/RealEstate/LeaseAgreement/Preview?isOnlyPreview=true&id=', 'AgreementNo', '_blank', false);
        //generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'TenantHistory', null, null, null, null, null);

        //isOnlyPreview
    }
    else {
        //swal.fire("", responseJSON.Message, "error");
        errorToastr(responseJSON.Message, 'Error');
    }
}
function inputKeyUpEvent(event) {

    $('.card-title').text('Individual Tenant (' + $("#Title").val() + '. ' + $("#FirstName").val() + ' ' + $("#LastName").val() + ')');
}