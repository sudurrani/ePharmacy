function deleteRecord(id = 0) {
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: swalConfirmText,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                ajaxRequest({ url: "/Services/Subcontractor/Delete", type: 'POST', data: { ID: id }, callBack: deleteRecordCallBack });
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function deleteRecordCallBack(responseJSON) {
    if (responseJSON.IsSuccess) {
        loadTableData();
        successToastr(responseJSON.Message, 'success');
    }
    else {
        errorToastr(responseJSON.Message, 'error');
    }
}
function newRecord(id) {
    redirectToAction("/Services/Subcontractor/Add?ID=", id, null);
}
function modifyRecord(id, index) {
    redirectToAction("/Services/Subcontractor/Update?ID=", id, null);
}