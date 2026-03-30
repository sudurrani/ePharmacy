var inputRequesteeTypeID = '', requesteeTypeSelectedValue = 0;
function loadRequesteeTypeDropdownList(inputID, selectedValue = 0) {
    inputRequesteeTypeID = inputID;
    requesteeTypeSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.RequesteeType]') == null) {
        ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.RequesteeType]', Condition: 'where Isdeleted =0' }, callBack: loadRequesteeTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.RequesteeType]')), $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue);
    }
}
var loadRequesteeTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue);
        localStorage.setItem('[Setup.RequesteeType]', JSON.stringify(responseJSON.resultJSON));
    }
}
var inputMaintenanceTypeID = '', maintenanceTypeSelectedValue = 0;
function loadMaintenanceTypeDropdownList(inputID, selectedValue = 0) {
    inputMaintenanceTypeID = inputID;
    maintenanceTypeSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.MaintenanceType]') == null) {
        ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.MaintenanceType]', Condition: 'where Isdeleted =0' }, callBack: loadMaintenanceTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.MaintenanceType]')), $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
    }
}
var loadMaintenanceTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
        localStorage.setItem('[Setup.MaintenanceType]', JSON.stringify(responseJSON.resultJSON));
    }
}
function loadAssigneeByMaintenanceRequestDropdownList(inputID, maintenanceRequestID = 0, selectedValue = 0) {


    ajaxRequest({ url: '/JobRequestCenter/AssignedJob/GetAssigneeByMR', type: 'POST', data: { ID: maintenanceRequestID }, callBack: loadAssigneeByMaintenanceRequestDropdownListCallBack, elementId: inputID, id: selectedValue });

}
var loadAssigneeByMaintenanceRequestDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + options.elementId), 'Select Assignee', options.id);        
    }
}
//Status DropDown
var inputStatausID = '', statusSelectedValue = 0;
function loadMaintenanceRequestStatusDropdownList(inputID, selectedValue = 0) {
    inputStatausID = inputID;
    statusSelectedValue = selectedValue;
    if (localStorage.getItem('[Setup.MaintenanceRequestStatus]') == null) {
        ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.MaintenanceRequestStatus]', Condition: 'where Isdeleted =0' }, callBack: loadMaintenanceRequestStatusDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.MaintenanceRequestStatus]')), $('#' + inputStatausID), 'Select Request Status', statusSelectedValue);
    }
}
var loadMaintenanceRequestStatusDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputStatausID), 'Select Request Status', statusSelectedValue);
        localStorage.setItem('[Setup.MaintenanceRequestStatus]', JSON.stringify(responseJSON.resultJSON));
    }
}

    //Job Card Status
var inputStatausID = '', statusSelectedValue = 0;
function loadJobCardStatusDropdownList(inputID, selectedValue = 0,selectedText = null) {    
    inputStatausID = inputID;
    statusSelectedValue = selectedValue;    
    if (localStorage.getItem('[Setup.JobCardStatus]') == null) {
        ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.JobCardStatus]', Condition: 'where IsDeleted =0' }, callBack: loadJobCardStatusDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.JobCardStatus]')), $('#' + inputStatausID), 'Select Status', statusSelectedValue, selectedText);
    }
}
var loadJobCardStatusDropdownListCallBack = function (responseJSON) {    
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputStatausID), 'Select Status', statusSelectedValue);
        localStorage.setItem('[Setup.JobCardStatus]', JSON.stringify(responseJSON.resultJSON));
    }
}

function loadPropertyLandlordDropdownList(inputID = null, propertyID, selectedValue = 0, defaultSelect = null) {
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPRealEstateSuite.dbo.Landlord LL, BHAERPRealEstateSuite.dbo.Property P', Columns: 'LL.ID Value, LL.Name Text', Condition: 'WHERE LL.ID = P.LandlordID AND LL.IsDeleted = 0 AND  P.ID = ' + propertyID }, callBack: loadPropertyLandlordDropdownListCallBack, id: selectedValue,inputID: inputID,defaultSelect:defaultSelect });
}
var loadPropertyLandlordDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, (options.inputID == null ? $('#LandlordID') : $('#' + options.inputID)), (options.defaultSelect == null ? 'Select Landlord' : options.defaultSelect), (responseJSON.resultJSON.length == 1 ? responseJSON.resultJSON[0].Value : options.id));
    }
}

function loadUnitTenantDropdownList(inputID = null, unitID, selectedValue = 0, defaultSelect = null) {
    ajaxRequest({ url: '/JobRequestCenter/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPCoreSuite.dbo.RefCustomer C, BHAERPRealEstateSuite.dbo.LeaseAgreement LA, BHAERPRealEstateSuite.dbo.UnitLeaseAgreementAssociation ULA, BHAERPRealEstateSuite.dbo.PropertyUnit PU', Columns: 'C.ID Value, C.Name Text', Condition: 'WHERE C.ID = LA.TenantID AND ULA.LeaseAgreementID = LA.ID AND PU.ID = ULA.UnitID AND LA.IsDeleted = 0 AND PU.IsDeleted = 0 AND C.IsActive = 1 AND PU.ID  = ' + unitID }, callBack: loadUnitTenantDropdownListCallBack, id: selectedValue, inputID: inputID, defaultSelect: defaultSelect });
}
var loadUnitTenantDropdownListCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, (options.inputID == null ? $('#TenantID') : $('#' + options.inputID)), (options.defaultSelect == null ? 'Select Tenant' : options.defaultSelect), (responseJSON.resultJSON.length == 1 ? responseJSON.resultJSON[0].Value : options.id));
    }
}

