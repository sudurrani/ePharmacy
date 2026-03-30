var unitDetailObject = {};
function getPostingAccounts(unitObject) {
    unitDetailObject = unitObject
    ajaxRequest({ url: '/AccountsManagement/JournalVoucher/GetAccountHeadForProduct', type: 'POST', data: {}, callBack: getAccountHeadForProductCallBack }, null, false);
}
var getAccountHeadForProductCallBack = function (responseJSON) {    
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#AdvanceAgainstLeasesAccountID'), 'Select Account', (unitDetailObject == null ? 0 :unitDetailObject.AdvanceAgainstLeasesAccountID));
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#LeaseIncomeAccountID'), 'Select Account', (unitDetailObject == null ? 0 : unitDetailObject.LeaseIncomeAccountID));
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#TenantAdvancesAccountID'), 'Select Account', (unitDetailObject == null ? 0 : unitDetailObject.TenantAdvancesAccountID));
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#LeaseExpenseAccountID'), 'Select Account', (unitDetailObject == null ? 0 : unitDetailObject.LeaseExpenseAccountID));
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#AccountReceivablesID'), 'Select Account', (unitDetailObject == null ? 0 : unitDetailObject.AccountReceivablesID));
    bindJQueryDropdownList(JSON.parse(responseJSON), $('#MaintenanceReceivablesID'), 'Select Account', (unitDetailObject == null ? 0 : unitDetailObject.MaintenanceReceivablesID));
}