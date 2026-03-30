
var inputPropertyID = '', propertySelectedValue = 0;
function loadTenantPropertyDropdownList(inputID, selectedValue) {    
    inputPropertyID = inputID;
    propertySelectedValue = selectedValue;
    ajaxRequest({ url: '/TenantPortal/Dropdowns/Property', type: 'POST', data: {}, callBack: loadTenantPropertyDropdownListCallBack });
}
var loadTenantPropertyDropdownListCallBack = function (responseJSON) {    
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputPropertyID), 'Select Property', propertySelectedValue);
    //if (responseJSON.resultJSON.length == 1) {
    //    $('#' + inputPropertyID).val(responseJSON.resultJSON[0].Value);        
    //}
}

var inputMaintenanceTypeID = '', maintenanceTypeSelectedValue = 0;
function loadTenantMaintenanceTypeDropdownList(inputID, selectedValue = 0) {
    inputMaintenanceTypeID = inputID;
    maintenanceTypeSelectedValue = selectedValue; localStorage.removeItem('[Setup.MaintenanceType]')
    if (localStorage.getItem('[Setup.MaintenanceType]') == null) {
        ajaxRequest({ url: '/TenantPortal/Dropdowns/JobRequestCenter', type: 'POST', data: { Table: '[Setup.MaintenanceType]', Condition: 'where Isdeleted =0' }, callBack: loadTenantMaintenanceTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.MaintenanceType]')), $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
    }
}
var loadTenantMaintenanceTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
        localStorage.setItem('[Setup.MaintenanceType]', JSON.stringify(responseJSON.resultJSON));
    }
}
var inputUnitByPropertyID = '', unitByPropertyIDSelectedValue = 0;
function loadUnitByPropertyIDDropdownList(inputID, selectedValue,  propertyID = 0) {
    inputUnitByPropertyID = inputID;
    unitByPropertyIDSelectedValue = selectedValue;
    ajaxRequest({ url: '/TenantPortal/Dropdowns/Unit', type: 'POST', data: { PropertyID: propertyID  }, callBack: loadUnitByPropertyIDDropdownListCallBack });
}
var loadUnitByPropertyIDDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitByPropertyID), 'Select Unit', unitByPropertyIDSelectedValue);

}

var inputRequesteeTypeID = '', requesteeTypeSelectedValue = 0, requesteeTypeSelectedText = null;
function loadTenantRequesteeTypeDropdownList(inputID, selectedValue = 0, selectedText) {
    inputRequesteeTypeID = inputID;
    requesteeTypeSelectedText = selectedText;
    requesteeTypeSelectedValue = selectedValue;
    localStorage.removeItem('[Setup.RequesteeType]');
    if (localStorage.getItem('[Setup.RequesteeType]') == null) {
        ajaxRequest({ url: '/TenantPortal/Dropdowns/JobRequestCenter', type: 'POST', data: { Table: '[Setup.RequesteeType]', Condition: 'where IsDeleted =0' }, callBack: loadTenantRequesteeTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.RequesteeType]')), $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue, requesteeTypeSelectedText);
    }
}
var loadTenantRequesteeTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue, requesteeTypeSelectedText);
        localStorage.setItem('[Setup.RequesteeType]', JSON.stringify(responseJSON.resultJSON));
    }
}


function loadUnitStatusDropdownList(selectedValue) {        
    ajaxRequest({ url: '/TenantPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: '[Setup.UnitStatus]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadUnitStatusDropdownListCallBack, id: selectedValue });
}
var loadUnitStatusDropdownListCallBack = function (responseJSON,options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitStatusID'), 'Select Status', options.id);

}
function loadPropertyTypeDropdownList(selectedValue) {
    ajaxRequest({ url: '/TenantPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: '[Setup.PropertyType]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadPropertyTypeDropdownListCallBack, id: selectedValue });
}
var loadPropertyTypeDropdownListCallBack = function (responseJSON,options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#TypeID'), 'Select Type', options.id);

}
/* This dropdown is populated in TenantPortal Move Out Requests Add View because in common script of 
Real Estate is not working here due to /TenantPortal/Dropdowns/RealEstate url.
*/
function loadTenantLeaseAgreementDropdownList(tenantID, selectedValue = 0) {
    ajaxRequest({ url: '/TenantPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: 'dbo.LeaseAgreement LA', Columns: 'LA.ID Value, LA.AgreementNo Text', Condition: "WHERE LA.Status = 'Executed' AND LA.IsDeleted = 0 AND LA.TenantID = " + tenantID }, callBack: loadTenantLeaseAgreementDropdownListCallBack, id: selectedValue });
}
var loadTenantLeaseAgreementDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#LeaseAgreementID'), 'Select Lease Agreement', options.id);
    }
}

function getTenantByUserID() {
    ajaxRequest({ url: '/TenantPortal/Tenant/GetByUserID', type: 'POST', data: {}, callBack: getTenantByUserIDCallBack});
}