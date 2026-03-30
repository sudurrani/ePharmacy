function loadCashCenterRoleTypeDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/CashCenter/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.RoleType]', Columns: 'ID Value, Description Text', Condition: 'WHERE  IsDeleted = 0' }, callBack: function (responseJSON) {

            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'RoleTypeID' : inputId)), (defaultText == null ? 'Select Role Type' : defaultText), selectedValue);
        }
    });
}

function loadCashCenterCashRoleDropdownList(inputId = null, selectedValue = 0, defaultText = null) {
    ajaxRequest({
        url: '/CashCenter/Dropdowns/Get', type: 'POST', data: { Table: 'CashHandlerRole', Columns: "ID Value, CONCAT(Code,' - ',Description) Text", Condition: 'WHERE  IsDeleted = 0' }, callBack: function (responseJSON) {            
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'CashHandlerRoleID' : inputId)), (defaultText == null ? 'Select Role' : defaultText), selectedValue);
        }
    });
}
function loadCashCenterCashRoleAssigneeDropdownList(inputId = null, selectedValue = 0, defaultText = null, cashHandlerRoleID = null) {
    ajaxRequest({
        url: '/CashCenter/Dropdowns/Get', type: 'POST', data: { Table: 'AssignedCashHandlerRole CR,BHAERPCoreSuite.dbo.Employee EMP', Columns: "CR.ID VALUE, CONCAT(EMP.EmployeeCode,' - ',EMP.FirstName, ' ',EMP.LastName) Text", Condition: 'WHERE CR.EmployeeID = EMP.ID AND CR.IsDeleted = 0 AND EMP.IsActive = 1 AND CR.CashHandlerRoleID = ISNULL(' + cashHandlerRoleID +',CR.CashHandlerRoleID)' }, callBack: function (responseJSON) {            
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputId == null ? 'CashHandlerRoleAssignedID' : inputId)), (defaultText == null ? 'Select Role Assignee' : defaultText), selectedValue);
        }
    });
}
