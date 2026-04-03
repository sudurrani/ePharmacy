function loadModuleDropdownList(inputID = null, selectedValue = 0,selectedText = null, defaultText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Dropdowns/Get', type: 'POST', data: {
            Table: 'ePharmacy.dbo.Module', Columns: 'ID Value, Description Text', Condition: 'WHERE IsDeleted =0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'ModuleID' : inputID)), (defaultText == null ? 'Select Module' : defaultText), selectedValue, selectedText, addNewOption);
        }
    });
}