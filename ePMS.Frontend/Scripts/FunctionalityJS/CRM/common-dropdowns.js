var inputCustomerID = '', customerIDSelectedValue = 0;
//function loadCustomerDropdownList(inputID, selectedValue) {
//    inputCustomerID = inputID;
//    customerIDSelectedValue = selectedValue;
//    if (localStorage.getItem('Customer') == null || localStorage.getItem('Customer') == 'null') {
//        ajaxRequest({ url: '/CRM/Dropdowns/Get', type: 'POST', data: { Table: '[Customer]', Columns: 'ID Value, FirstName Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadCustomerDropdownListCallBack });
//    }
//    else {
//        bindJQueryDropdownList(JSON.parse(localStorage.getItem('Customer')), $('#' + inputCustomerID), 'Select Customer', customerIDSelectedValue);
//    }

//}
//var loadCustomerDropdownListCallBack = function (responseJSON) {
//    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputCustomerID), 'Select Customer', customerIDSelectedValue);
//    localStorage.setItem('Customer', JSON.stringify(responseJSON.resultJSON));
    
//}

var inputNationalityID = '', nationalityIDSelectedValue = 0;
//function loadNationalityDropdownList(inputID, selectedValue) {
//    localStorage.removeItem('Nationality');
//    inputNationalityID = inputID;
//    nationalityIDSelectedValue = selectedValue;
//    if (localStorage.getItem('Nationality') == null || localStorage.getItem('Nationality') == 'null') {
//        ajaxRequest({ url: '/CRM/Dropdowns/Get', type: 'POST', data: { Table: '[Nationality]', Columns: 'ID Value, Nationality Text', Condition: 'WHERE IsDeleted = 0' }, callBack: loadNationalityDropdownListCallBack });
//    }
//    else {
//        bindJQueryDropdownList(JSON.parse(localStorage.getItem('Nationality')), $('#' + inputNationalityID), 'Select Nationality', nationalityIDSelectedValue);
//    }

//}
//var loadNationalityDropdownListCallBack = function (responseJSON) {
//    bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputNationalityID), 'Select Nationality', nationalityIDSelectedValue);
//    localStorage.setItem('Nationality', JSON.stringify(responseJSON.resultJSON));
//}