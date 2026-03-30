
var inputPropertyID = '', propertySelectedValue = 0;
function loadLandlordPropertyDropdownList(inputID, selectedValue) {
    inputPropertyID = inputID;
    propertySelectedValue = selectedValue;
    ajaxRequest({ url: '/LandlordPortal/Dropdowns/Property', type: 'POST', data: {}, callBack: loadLandlordPropertyDropdownListCallBack });
}
var loadLandlordPropertyDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputPropertyID), 'Select Property', propertySelectedValue);
}

var inputMaintenanceTypeID = '', maintenanceTypeSelectedValue = 0;
function loadLandlordMaintenanceTypeDropdownList(inputID, selectedValue = 0) {
    inputMaintenanceTypeID = inputID;
    maintenanceTypeSelectedValue = selectedValue; localStorage.removeItem('[Setup.MaintenanceType]')
    if (localStorage.getItem('[Setup.MaintenanceType]') == null) {
        ajaxRequest({ url: '/LandlordPortal/Dropdowns/JobRequestCenter', type: 'POST', data: { Table: '[Setup.MaintenanceType]', Condition: 'where Isdeleted =0' }, callBack: loadLandlordMaintenanceTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.MaintenanceType]')), $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
    }
}
var loadLandlordMaintenanceTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputMaintenanceTypeID), 'Select Maintenance Type', maintenanceTypeSelectedValue);
        localStorage.setItem('[Setup.MaintenanceType]', JSON.stringify(responseJSON.resultJSON));
    }
}
var inputUnitByPropertyID = '', unitByPropertyIDSelectedValue = 0;
function loadUnitByPropertyIDDropdownList(inputID, selectedValue, propertyID = 0) {
    inputUnitByPropertyID = inputID;
    unitByPropertyIDSelectedValue = selectedValue;
    ajaxRequest({ url: '/LandlordPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: '[PropertyUnit]', Columns: 'ID Value, UnitNo Text', Condition: 'WHERE IsDeleted = 0 AND PropertyID = ' + propertyID + '' }, callBack: loadUnitByPropertyIDDropdownListCallBack });


}
var loadUnitByPropertyIDDropdownListCallBack = function (responseJSON) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputUnitByPropertyID), 'Select Unit', unitByPropertyIDSelectedValue);

}

var inputRequesteeTypeID = '', requesteeTypeSelectedValue = 0, requesteeTypeSelectedText = null;
function loadLandlordRequesteeTypeDropdownList(inputID, selectedValue = 0, selectedText) {
    inputRequesteeTypeID = inputID;
    requesteeTypeSelectedText = selectedText;
    requesteeTypeSelectedValue = selectedValue;
    localStorage.removeItem('[Setup.RequesteeType]');
    if (localStorage.getItem('[Setup.RequesteeType]') == null) {
        ajaxRequest({ url: '/LandlordPortal/Dropdowns/JobRequestCenter', type: 'POST', data: { Table: '[Setup.RequesteeType]', Condition: 'where IsDeleted =0' }, callBack: loadLandlordRequesteeTypeDropdownListCallBack });
    }
    else {
        bindJQueryDropdownList(JSON.parse(localStorage.getItem('[Setup.RequesteeType]')), $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue,requesteeTypeSelectedText);
    }
}
var loadLandlordRequesteeTypeDropdownListCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputRequesteeTypeID), 'Select Requestee Type', requesteeTypeSelectedValue, requesteeTypeSelectedText);
        localStorage.setItem('[Setup.RequesteeType]', JSON.stringify(responseJSON.resultJSON));
    }
}

function loadUnitStatusDropdownList(selectedValue) {
    ajaxRequest({ url: '/LandlordPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: '[Setup.UnitStatus]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadUnitStatusDropdownListCallBack, id: selectedValue });
}
var loadUnitStatusDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#UnitStatusID'), 'Select Status', options.id);

}
function loadPropertyTypeDropdownList(selectedValue) {
    ajaxRequest({ url: '/LandlordPortal/Dropdowns/RealEstate', type: 'POST', data: { Table: '[Setup.PropertyType]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1' }, callBack: loadPropertyTypeDropdownListCallBack, id: selectedValue });
}
var loadPropertyTypeDropdownListCallBack = function (responseJSON, options) {
    bindJQueryDropdownList(responseJSON.resultJSON, $('#TypeID'), 'Select Type', options.id);
}

function getLandlordByUserID() {
    ajaxRequest({ url: '/LandlordPortal/Profile/GetByUserID', type: 'POST', data: {}, callBack: getLandlordByUserIDCallBack });
}