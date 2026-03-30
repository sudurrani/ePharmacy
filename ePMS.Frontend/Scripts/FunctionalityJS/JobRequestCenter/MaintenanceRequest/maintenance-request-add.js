var Uname = null, companyID = null;
var selectedUnitID = 0;
const dataTransferMaintenanceUploadPictures = new DataTransfer();
const dataTransferMaintenanceUploadPicturesSlider = [];// new DataTransfer();
$(document).ready(function () {    
    getNumber();
    loadPropertyDropdownList('PropertyID', 0);
    loadTenantDropdownList('TenantID', 0, 'Select Tenant');
    loadPropertyOwnerDropdownlist('LandlordID', 0);
    loadHRDepartmentDropdownList('RequestedDepartmentID', 0, companyID);
    loadMaintenanceTypeDropdownList('MaintenanceTypeID', 0);
    loadRequesteeTypeDropdownList('RequestedByID', 0);
    //loadMaintenanceRequestStatusDropdownList('StatusID', 0);
    $('#PropertyID').on('select2:select', function (e) {
        if (e.params.data.id > 0) {
            $(this).removeClass("invalid");
            $(this).next("span").next("span").remove();
        }
        $('#TenantID').val(0).change();
        ajaxRequest({ url: '/RealEstate/Unit/GetPropertyDetailByID', type: 'POST', data: { ID: $(this).val() }, callBack: getPropertyByIdCallBack });
        ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND PropertyID =' + $('#PropertyID').val() }, callBack: loadPropertyUnitDropdownListCallBack });
    });

    $('#UnitID').on('select2:select', function (e) {
        if (e.params.data.id > 0) {
            $(this).removeClass("invalid");
            $(this).next("span").next("span").remove();
        }
        $('#TenantID').val(0).change();
        ajaxRequest({
            url: '/JobRequestCenter/MaintenanceRequest/GetUnitTenantFromLatestLeaseAgreement', type: 'POST', data: { ID: $('#UnitID').val() }, callBack: getUnitTenantFromLatestLeaseAgreementCallBack
        });
    });

    $('#TenantID').on('select2:select', function (e) {
        if (e.params.data.id > 0) {            
            $(this).removeClass("invalid");
            $(this).next("span").next("span").remove();         
        }
        getTenantDetailByID($(this).val());

    });

    $('#LandlordID').on('select2:select', function (e) {
        if (e.params.data.id > 0) {
            $(this).removeClass("invalid");
            $(this).next("span").next("span").remove();
        }
        getOwnerDetail($(this).val());
    });

    $('#RequestedDepartmentID').on('select2:select', function (e) {
        //loadHREmployeeDropdownList('RequestedMemberID', e.params.data.RequestedDepartmentID, e.params.data.RequestedMemberID, companyID);
        loadHREmployeeDropdownList('RequestedMemberID', 0, $(this).val(), companyID);
    });
    $('#RequestedByID').on('select2:select', function (e) {
        if (e.params.data.text == 'Tenant') {
            $('#TenantID').attr('required', true);
            $('#span-tenant-required').show();
        }
        else {
            $('#TenantID').removeAttr('required');
            $('#TenantID').removeClass("invalid");
            $('#TenantID').next("span").next("span").remove();
            $('#span-tenant-required').hide();
        }
        if (e.params.data.text == 'Landlord') {
            $('#LandlordID').attr('required', true);
            $('#span-landlord-required').show();
        }
        else {
            $('#LandlordID').removeAttr('required');
            $('#LandlordID').removeClass("invalid");
            $('#LandlordID').next("span").next("span").remove();
            $('#span-landlord-required').hide();
        }
    });
    //New Button
    $("#btnNewMaintenanceRequest").on("click", function () {
        clearFormFields();

    });
    //End New Button

    //Btn Close Code
    $('#btnCloseMaintenanceRequest').on("click", function () {
        var propertyId = $('#PropertyID').val();
        var unitID = $('#UnitID').val();
        if (propertyId > 0 || unitID > 0) {
            swal.fire({
                title: "",
                text: 'Do you want save changes?',
                type: 'info',
                cancelButtonColor: '#F04249',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                dangerMode: true,
            }).then(
                function (isConfirm) {
                    if (isConfirm.value == true) {
                        saveRecord(true);
                    }
                    else {
                        window.location.href = '/JobRequestCenter/MaintenanceRequest/List?FID=fL3ejaIcO/XOF1QBJv3t0A==&ModuleID=jNHqAddtKf7CFsq4TzEc/A==';
                    }
                });
        }
        else {
            window.location.href = '/JobRequestCenter/MaintenanceRequest/List?FID=fL3ejaIcO/XOF1QBJv3t0A==&ModuleID=jNHqAddtKf7CFsq4TzEc/A==';
        }
    });
    //Btn Close End Code

    $('#btnSave').click(function (event) {

        event.preventDefault();
        saveRecord();

    });
});
function saveRecord(isCloseAndSaveAsDraft = false) {
    if (customValidateForm('saveMaintenanceForm')) {
        var inputJSON = getFormDataAsJSONObject('saveMaintenanceForm', inputJSON);
        inputJSON['FKeyIdentifier'] = fKeyIdentifierVal;
        ajaxRequest({ url: "/JobRequestCenter/MaintenanceRequest/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });
    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON != null) {
            $('#ID').val(responseJSON.resultJSON);

        }
        successToastr('Request created, Successfully', 'success');
        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/JobRequestCenter/MaintenanceRequest/List?FID=fL3ejaIcO/XOF1QBJv3t0A==&ModuleID=jNHqAddtKf7CFsq4TzEc/A==';
            }, 2000);
        }
    }
    else {
        errorToastr(responseJSON.Message, responseJSON.Type);
    }
}
var getUnitTenantFromLatestLeaseAgreementCallBack = function (responseJSON) {
    if (responseJSON.resultJSON != null) {
        $('#TenantID').val(responseJSON.resultJSON.TenantID).change();
        getTenantDetailByID(responseJSON.resultJSON.TenantID);
        /* COMMENTED AFTER ENW DESING
        $('#TenancyExpiryDate').datepicker("setDate", getFormattedDate(responseJSON.resultJSON.EndDate));
        */
        $('#TenancyExpiryDate').val(getFormattedDate(responseJSON.resultJSON.EndDate));
    }
    else {
        $('#TenantID').val(0).change();
    }
}
var loadPropertyUnitDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitID'), 'Select Unit', selectedUnitID);

}
var getPropertyByIdCallBack = function (responseJSON) {    
    if (responseJSON.resultJSON) {
        setResponseToFormInputs(responseJSON.resultJSON);
        getOwnerDetail(responseJSON.resultJSON.LandlordID);
        console.log(responseJSON.resultJSON.LandlordID);
    }

}
function getTenantDetailByID(tenantID = 0) {
    ajaxRequest({
        url: '/RealEstate/Tenant/GetTenantById', type: 'POST', data: { ID: tenantID }, callBack: getTenantDetailByIDCallBack
    });
}
var getTenantDetailByIDCallBack = function (responseJSON) {
    if (responseJSON && responseJSON.resultJSON != null) {
        $('#Email').val(responseJSON.resultJSON.Email);
        $('#PrimaryMobileNo').val(responseJSON.resultJSON.PrimaryMobileNo);
        $('#SecondaryMobileNo').val(responseJSON.resultJSON.SecondaryMobileNo);
    }
}
function getOwnerDetail(ID) {
    try {
        ajaxRequest({ url: "/RealEstate/PropertyOwner/GetByID", type: 'POST', data: { ID: ID }, callBack: getOwnerDetailCallBack });
    }
    catch (err) {
        swal.fire("Cancelled", err.toString(), "error");
    }
}
var getOwnerDetailCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON != null) {

            $('#PrimaryContactNumber').val(responseJSON.resultJSON.Landlord.PrimaryContactNumber);
            $('#SecondaryContactNumber').val(responseJSON.resultJSON.Landlord.SecondaryContactNumber);
        }

    }
    else {
        swal.fire("", responseJSON.Message, "error");
    }
}
datePickerDDMMYYYYHHMMSSFormat('RequestDate', true);
datePickerDDMMYYYYFormat('PreferredDate');
datePickerDDMMYYYYFormat('TenancyExpiryDate');