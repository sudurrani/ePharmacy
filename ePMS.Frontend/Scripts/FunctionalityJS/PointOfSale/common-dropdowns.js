function loadProductTypeDropdownList(inputID, selectedValue = 0, selectedText = null, inputItemType = null, callBack =null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPInventorySuite.dbo.PrdRefProductType', Condition: 'WHERE IsActive = 1' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Product Type', selectedValue, selectedText);
                if (inputItemType != null) {
                    loadItemTypeDropdownList(inputItemType, 0, 'Finished Goods', $('#' + inputID).val(), callBack);
                }
            }
        }
    });
}
function loadItemTypeDropdownList(inputID, selectedValue = 0, selectedText = null, productTypeID = null, callBack =null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPInventorySuite.dbo.PrdRefItemType', Condition: 'WHERE IsActive = 1 AND ProductTypeID = ' + productTypeID }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Item Type', selectedValue, selectedText);
                if (typeof callBack === 'function') {
                    callBack();
                }
            }
        }
    });
}
function loadPaymentMethodsDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPPointOfSaleSuite.[dbo].[Setup.PaymentMethod]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Payment Method', selectedValue, selectedText);
            }
        }
    });
}
function loadCustomersByPaymentMethodDropdownList(inputID, selectedValue = 0, paymentMethodID = 0, selectedText = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPCoreSuite.dbo.RefCustomer C, BHAERPFinancialSuite.dbo.AccountHead AH, BHAERPPointOfSaleSuite.dbo.[Setup.PaymentMethod] PM',
            Columns: "C.ID Value, CONCAT(C.Number, ' - ', C.Name) Text", 
            Condition: `WHERE (C.AccountHeadID = AH.ID       OR C.ControlAccountID = PM.AccountHeadID)
                    AND AH.ID = PM.AccountHeadID
                    AND C.IsActive = 1
                    AND AH.IsActive = 1
                    AND PM.IsDeleted = 0
                    AND PM.ID = ${paymentMethodID}`
        }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                if (responseJSON.resultJSON.length == 1) {
                    selectedValue = responseJSON.resultJSON[0].Value;
                }
                else {
                    selectedValue = 0;
                }
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Customer', selectedValue, selectedText);
            }
        }
    });
}
function loadCustomerContactsDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPPointOfSaleSuite.dbo.Customer', Columns: "ID Value, CONCAT(Code, ' - ', Name) Text", Condition: 'WHERE IsDeleted = 0'
        }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                if (responseJSON.resultJSON.length == 1) {
                    selectedValue = responseJSON.resultJSON[0].Value;
                }
                else {
                    selectedValue = 0;
                }
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Customer', selectedValue, selectedText, addNewOption);
            }
        }
    });
}