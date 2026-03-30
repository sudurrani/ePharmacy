function loadMakeDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/UsedCar/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.Make]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Make', selectedValue, selectedText, addNewOption);
            }
        }
    });
}

function loadInspectionHeadDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/UsedCar/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.InspectionHead]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Head', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
