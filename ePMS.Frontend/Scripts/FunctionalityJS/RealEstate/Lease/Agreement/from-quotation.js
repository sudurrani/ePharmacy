$(document).ready(function () {    
    getTenantTaxes();
    getNumber();

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ID')) {
        getAndDecryptID(urlParams.get('ID'));
    }
});
var getAndDecryptIDCallBack = function (responseJSON) {
    $('#QuotationID').val(responseJSON);
    ajaxRequest({ url: '/RealEstate/Quotation/GetQuotationById', type: 'POST', data: { ID: responseJSON }, callBack: getQuotationByIdCallBack });



    //loadPropertyDropdownList('PropertyID', 0);
    loadLeaseTermTemplateDropdownList('LeaseTermTemplateID', 0);
    //loadTenantDropdownList('TenantID', 0, 'Select Tenant');
    

}
var getQuotationByIdCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON != null) {            
            responseJSON.resultJSON.QuotationDate = getFormattedDate(responseJSON.resultJSON.QuotationDate)
            responseJSON.resultJSON.QuotationValidity = getFormattedDate(responseJSON.resultJSON.QuotationValidity)
            setResponseToFormInputs(responseJSON.resultJSON, ['ID','TermsAndCondition']);
            $('#QuotationID').val(responseJSON.resultJSON.ID);
            loadTenantDropdownList('CustomerID', responseJSON.resultJSON.CustomerID);
            //getQuotaionDetailByQuotaionID();
            getQuotationRentDetail();
        }
    }
    else {
        infoToastr('Quotation not found', 'info');
    }
    
}
function getQuotationRentDetail(quotationDetailArray) {
    ajaxRequest({ url: '/RealEstate/Quotation/GetQuotationRentDetail', type: 'POST', data: { quotationID: $('#QuotationID').val(), quotationDetailJSON: quotationDetailArray }, callBack: getQuotationRentDetailCallBack });
}
var getQuotationRentDetailCallBack = function (responseJSON, options) {

    _quotationRentDetailsArray = responseJSON.resultJSON;

    var addedRentDetailsArray = [];    
    //generateHTMLTableRowsFromJSONWithCheckbox(_quotationRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', ["Amount", "SecurityDepositAmount"]);

    generateHTMLTableRowsFromJSONWithCheckbox(_quotationRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', ["Amount", "SecurityDepositAmount"]);
    //generateHTMLTableRowsFromJSONWithCheckbox(_quotationRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', ["Amount", "SecurityDepositAmount"]);
    _unitRentDetailsArray = addedRentDetailsArray;
    getQuotationAdditionalCharges();
}
function getQuotationAdditionalCharges() {
    //write ajax and get quotation additional cahrges as like lease agreement
    ajaxRequest({ url: '/RealEstate/Quotation/GetAdditionalCharges', type: 'POST', data: { ID: $('#QuotationID').val() }, callBack: getQuotationAdditionalChargesCallBack });
}
var getQuotationAdditionalChargesCallBack = function (responseJSON) {
    var numericFields = ["Amount", "SecurityDepositAmount"];
    _quotationAdditionalChargesArray = responseJSON.resultJSON;
    

    $.each(_quotationAdditionalChargesArray, function (additionalIndex, additionalItem) {
        var thID = '';
        $('#unitPaymentTermDetailTable>thead tr').each(function (rowIndexEachLoop, rowValue) {
            thID = "th" + additionalItem.Name.replace(/\s/g, '_');
            dataKey = additionalItem.Name.replace(/\s/g, '_');
            if ($(this).find('th#' + thID + '').length <= 0) {
                th = `<th style="width:8px;;" id=` + thID + `>` + additionalItem.Name + `</th>`;
                $('#unitPaymentTermDetailTable>thead>tr').append(th);
            }
            for (let index = 0; index < _quotationRentDetailsArray.length; index++) {
                _quotationRentDetailsArray[index][dataKey] = additionalItem.TotalAmount;
                numericFields.push(dataKey);
            }
        });
        additionalItem['AdditionalChargesID'] = additionalItem.ID;
        _leaseAgreementAdditionalChargesArray.push(additionalItem);
    });
    generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail, _leaseAgreementAdditionalChargesArray);
    //generateHTMLTableRowsFromJSONWithCheckbox(_allCheckedUnitRentDetailsArray, 'tblQuotationData', null, null, null, 0, null, numericFields);
    generateHTMLTableRowsFromJSONWithCheckbox(_quotationRentDetailsArray, 'unitPaymentTermDetailTable', null, null, null, 0, 'rentDetailcheckBoxClicked', numericFields);
    //checkedTableAllRows();
}
var quotationRentDetailcheckBoxClicked = function (requestFrom, rowIndex, rowItem) {
    var isSelected = $('#unitPaymentTermDetailTabletdCheckbox' + rowIndex + '').is(':checked');
    if (isSelected) {
        
        _unitsJSONArray.push(rowItem.UnitID);
    }
    else {
        
        var index = _unitsJSONArray.indexOf(rowItem.UnitID);
        _unitsJSONArray.splice(index, 1);
    }
    _selectedUnitInputJSONArray = [];
    $.each(_unitsJSONArray, function (unitsIndex, unitsValue) {
        _selectedUnitInputJSONArray.push({ 'ID': unitsValue });
    });
}

function getTenantTaxes() {
    ajaxRequest({ url: '/RealEstate/PropertyTax/GetByPayer', type: 'POST', data: { Payer: 'Tenant' }, callBack: getTenantTaxesCallBack });
}
var getTenantTaxesCallBack = function (responseJSON) {

    _leaseAgreementTenantTaxesDetail = responseJSON.resultJSON;

    generatePaymentScheduleTableTHEAD(_leaseAgreementTenantTaxesDetail);
}