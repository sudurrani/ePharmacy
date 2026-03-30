//Schema
let contactDetailSchema = {
    ID: { type: 'hidden' },
    ContactPersonName: { type: 'text', maxlength: 50 },
    Description: { type: 'text', maxlength: 50 },
    ContactNumber: { type: 'text', maxlength: 20 },
    Action: { type: 'action', addRowFunction: 'addContactNumber', removeRowFunction: 'deleteContactNumber' }
};
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    $('#BankID,#CurrencyID,#AccountHeadID,#BankAccountCountryID').select2({
        width: '100%',
        dropdownParent: $('#bankAccountModal')
    });
    $('#btnSave').click(function (e) {
        e.preventDefault();
        saveRecord();
    });
    $('#btnClose').click(function () {
        redirectToSubcontractorList();
    });
});


function saveRecord(isCloseAndSaveAsDraft = false) {
    if (customValidateForm('subcontractorForm')) {
        var inputJSON = getFormDataAsJSONObject('subcontractorForm');
        debugger;
        _subcontractorBankAccountsArray = _subcontractorBankAccountsArray.map(function (item) {
            item.CountryID = item.BankAccountCountryID; 
            delete item.BankAccountCountryID;           
            return item;
        });


        inputJSON['BankAccounts'] = _subcontractorBankAccountsArray;

        let contacts = getTableRowsBySchema(contactDetailSchema, 'ContactDetailTableTbody');
        // validation for invoiceDetail 
        if (contacts.length > 1) {
            for (let i = 0; i < contacts.length; i++) {
                let c = contacts[i], rowNo = i + 1;
                if (!c.ContactPersonName || c.ContactPersonName === "0") return infoToastr(`In Contact Detail row ${rowNo}: Contact Person Name  is missing`);
            }
        }

        inputJSON['Contacts'] = contacts;
        console.log(inputJSON);
        ajaxRequest({ url: "/Services/Subcontractor/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
      
        $('#ID').val(responseJSON.resultJSON);
        console.log(responseJSON.resultJSON)
        successToastr("The Subcontractor has been saved", 'success');

        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/Subcontractor/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }

    }
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}
function addContactNumber(id, requestRow) {
    addTableRowsBySchema(contactDetailSchema, 'ContactDetailTableTbody', {});
}
//function deleteContactNumber(id, requestedRow) {
//    let $row = $(requestedRow).closest("tr");
//    $row.remove();
//    resetTableActions('ContactDetailTableTbody');
//}
function deleteContactNumber(id, requestedRow) {
    console.log(id);
    let $row = $(requestedRow).closest("tr");
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you really want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (id <= 0) {
                   $row.remove();
                resetTableActions('ContactDetailTableTbody', 'addServiceItemQotationRow', null);
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/Subcontractor/DeleteContact", type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            resetTableActions('ContactDetailTableTbody', 'addServiceItemQotationRow', null);
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                });
            }


        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}

//Btn Close Code
function redirectToSubcontractorList() {
    swal.fire({
        title: "",
        text: 'Do you want save changes?',
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,
        allowOutsideClick: false,
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                saveRecord(true);
            }
            else {
                window.location.href = '/Services/Subcontractor/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code